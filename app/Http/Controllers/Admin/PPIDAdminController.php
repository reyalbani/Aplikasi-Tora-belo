<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use App\Models\StatusPermohonan;
use App\Models\DokumenPermohonan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PPIDAdminController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $tipe = $request->query('tipe');
        
        $query = Permohonan::with(['masyarakat.user', 'layanan'])
            ->whereHas('layanan', function($q) {
                $q->where('nama_layanan', 'Pejabat Pengelola Informasi dan Dokumentasi');
            });
            
        if ($status) {
            $query->where('status', $status);
        }

        if ($tipe === 'keberatan') {
            $query->where('kode_tiket', 'LIKE', 'KBT-%');
        } else if ($tipe === 'permohonan') {
            $query->where('kode_tiket', 'LIKE', 'PID-%');
        }
        
        $permohonan = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('admin/ppid/index', [
            'permohonan' => $permohonan,
            'filters' => [
                'status' => $status,
                'tipe' => $tipe
            ]
        ]);
    }

    public function show($id)
    {
        $permohonan = Permohonan::with([
            'masyarakat.user', 
            'layanan', 
            'dokumenPermohonan', 
            'statusPermohonan' => function($q) {
                $q->orderBy('waktu', 'desc');
            }
        ])->findOrFail($id);

        return Inertia::render('admin/ppid/show', [
            'permohonan' => $permohonan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'action_type' => 'required|string', // verifikasi, pengolahan, pemberitahuan, penyerahan, tanggapan, tolak
            'catatan_pengolahan' => 'nullable|string',
            'nomor_surat_pemberitahuan' => 'nullable|string',
            'format_penyerahan' => 'nullable|string',
            'biaya_penggandaan' => 'nullable|string',
            'tanggapan_atasan' => 'nullable|string',
            'dokumen_lampiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx,zip,rar|max:10240',
        ]);

        try {
            DB::beginTransaction();

            $permohonan = Permohonan::findOrFail($id);
            $permohonan->status = $validated['status'];
            
            $isi = json_decode($permohonan->isi_permohonan, true) ?? [];
            
            if ($validated['action_type'] === 'pengolahan') {
                $isi['pengolahan_informasi'] = [
                    'catatan' => $request->catatan_pengolahan,
                    'waktu' => now()->toIso8601String(),
                ];
            } else if ($validated['action_type'] === 'pemberitahuan') {
                $isi['pemberitahuan_tertulis'] = [
                    'nomor_surat' => $request->nomor_surat_pemberitahuan,
                    'format' => $request->format_penyerahan,
                    'biaya' => $request->biaya_penggandaan,
                    'keterangan' => $request->keterangan,
                    'waktu' => now()->toIso8601String(),
                ];
            } else if ($validated['action_type'] === 'tanggapan') {
                $isi['tanggapan_atasan_ppid'] = [
                    'tanggapan' => $request->tanggapan_atasan,
                    'waktu' => now()->toIso8601String(),
                ];
            } else if ($validated['action_type'] === 'penyerahan') {
                $isi['penyerahan_informasi'] = [
                    'keterangan' => $request->keterangan,
                    'waktu' => now()->toIso8601String(),
                ];
                $permohonan->tanggal_selesai = now();
            }

            if ($request->hasFile('dokumen_lampiran')) {
                $file = $request->file('dokumen_lampiran');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => $validated['action_type'] === 'pemberitahuan' ? 'Surat Pemberitahuan Tertulis' : 'Dokumen Jawaban/Informasi Publik',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }
            
            $permohonan->isi_permohonan = json_encode($isi);
            $permohonan->save();

            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? ('Status diperbarui menjadi ' . $validated['status']),
                'waktu' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Status layanan PPID berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
