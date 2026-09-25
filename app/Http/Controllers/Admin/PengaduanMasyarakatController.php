<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use App\Models\StatusPermohonan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PengaduanMasyarakatController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        
        $query = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', 'Layanan Pengaduan Masyarakat');
            });
            
        if ($status) {
            $query->where('status', $status);
        }
        
        $permohonan = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('admin/pengaduan-masyarakat/index', [
            'permohonan' => $permohonan,
            'filters' => ['status' => $status]
        ]);
    }

    public function show($id)
    {
        $permohonan = Permohonan::with(['masyarakat.user', 'layanan', 'dokumen', 'status_riwayat' => function($q) {
            $q->orderBy('waktu', 'desc');
        }])->findOrFail($id);

        return Inertia::render('admin/pengaduan-masyarakat/show', [
            'permohonan' => $permohonan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'action_type' => 'required|string',
            'tujuan_disposisi' => 'nullable|string',
            'catatan_telaah' => 'nullable|string',
            'hasil_klarifikasi' => 'nullable|string',
            'tindakan_lanjut' => 'nullable|string',
            'jawaban_final' => 'nullable|string',
            'dokumentasi' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $permohonan = Permohonan::findOrFail($id);
            
            $permohonan->status = $validated['status'];
            
            $isi = json_decode($permohonan->isi_permohonan, true) ?? [];
            
            if ($validated['action_type'] === 'telaah') {
                $isi['telaah'] = [
                    'catatan' => $request->catatan_telaah
                ];
            } else if ($validated['action_type'] === 'disposisi') {
                $isi['disposisi'] = [
                    'tujuan' => $request->tujuan_disposisi,
                    'keterangan' => $request->keterangan
                ];
            } else if ($validated['action_type'] === 'klarifikasi') {
                $isi['klarifikasi'] = [
                    'hasil' => $request->hasil_klarifikasi
                ];
            } else if ($validated['action_type'] === 'tindak_lanjut') {
                $isi['tindak_lanjut'] = [
                    'tindakan' => $request->tindakan_lanjut
                ];
                if ($request->hasFile('dokumentasi')) {
                    $file = $request->file('dokumentasi');
                    $filename = time() . '_' . \Illuminate\Support\Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('public/dokumen_permohonan', $filename);
                    
                    \App\Models\DokumenPermohonan::create([
                        'id_permohonan' => $permohonan->id_permohonan,
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => 'storage/dokumen_permohonan/' . $filename,
                        'jenis_dokumen' => 'Dokumentasi Tindak Lanjut',
                        'ukuran_file' => $file->getSize(),
                        'tanggal_upload' => now(),
                    ]);
                }
            } else if ($validated['action_type'] === 'selesai') {
                $isi['jawaban_final'] = $request->jawaban_final;
                if ($validated['status'] === 'Selesai') {
                    $permohonan->tanggal_selesai = now();
                }
            }
            
            $permohonan->isi_permohonan = json_encode($isi);
            $permohonan->save();

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
