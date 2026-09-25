<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use App\Models\StatusPermohonan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PendidikanPemilihController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        
        $query = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', 'Layanan Pendidikan Pemilih');
            });
            
        if ($status) {
            $query->where('status', $status);
        }
        
        $permohonan = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('admin/pendidikan-pemilih/index', [
            'permohonan' => $permohonan,
            'filters' => ['status' => $status]
        ]);
    }

    public function show($id)
    {
        $permohonan = Permohonan::with(['masyarakat.user', 'layanan', 'dokumen', 'status_riwayat' => function($q) {
            $q->orderBy('waktu', 'desc');
        }])->findOrFail($id);

        return Inertia::render('admin/pendidikan-pemilih/show', [
            'permohonan' => $permohonan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'action_type' => 'required|string', // verify, disposisi, kajian, konfirmasi, pelaksanaan, evaluasi
            // Specific fields based on action_type
            'tujuan_disposisi' => 'nullable|string',
            'catatan_kajian' => 'nullable|string',
            'hasil_konfirmasi' => 'nullable|string',
            'tanggal_pelaksanaan' => 'nullable|date',
            'dokumentasi' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $permohonan = Permohonan::findOrFail($id);
            $oldStatus = $permohonan->status;
            
            $permohonan->status = $validated['status'];
            
            // Update JSON data if needed based on action_type
            $isi = json_decode($permohonan->isi_permohonan, true) ?? [];
            
            if ($validated['action_type'] === 'disposisi') {
                $isi['disposisi'] = [
                    'tujuan' => $request->tujuan_disposisi,
                    'keterangan' => $request->keterangan
                ];
            } else if ($validated['action_type'] === 'kajian') {
                $isi['kajian_teknis'] = [
                    'catatan' => $request->catatan_kajian
                ];
            } else if ($validated['action_type'] === 'konfirmasi') {
                $isi['konfirmasi'] = [
                    'hasil' => $request->hasil_konfirmasi
                ];
            } else if ($validated['action_type'] === 'pelaksanaan') {
                $isi['pelaksanaan'] = [
                    'tanggal' => $request->tanggal_pelaksanaan,
                    'keterangan' => $request->keterangan
                ];
                
                // Handle optional documentation upload
                if ($request->hasFile('dokumentasi')) {
                    $file = $request->file('dokumentasi');
                    $filename = time() . '_' . \Illuminate\Support\Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('public/dokumen_permohonan', $filename);
                    
                    \App\Models\DokumenPermohonan::create([
                        'id_permohonan' => $permohonan->id_permohonan,
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => 'storage/dokumen_permohonan/' . $filename,
                        'jenis_dokumen' => 'Dokumentasi Pelaksanaan',
                        'ukuran_file' => $file->getSize(),
                        'tanggal_upload' => now(),
                    ]);
                }
            } else if ($validated['action_type'] === 'evaluasi') {
                $isi['evaluasi'] = [
                    'keterangan' => $request->keterangan
                ];
                if ($validated['status'] === 'Selesai') {
                    $permohonan->tanggal_selesai = now();
                }
            }
            
            $permohonan->isi_permohonan = json_encode($isi);
            $permohonan->save();

            // Create Status History
            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? 'Status diupdate ke ' . $validated['status'],
                'waktu' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Status permohonan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
