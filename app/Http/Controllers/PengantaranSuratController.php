<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Masyarakat;
use App\Models\Permohonan;
use App\Models\DokumenPermohonan;
use App\Models\StatusPermohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PengantaranSuratController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'nama_pemohon' => 'required|string|max:100',
            'nik' => 'required|string|max:20',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'alamat_pemohon' => 'required|string',
            
            'jenis_surat' => 'required|string',
            'nomor_surat' => 'nullable|string',
            'tanggal_surat' => 'required|date',
            'perihal' => 'required|string',
            'instansi_tujuan' => 'required|string',
            'nama_penerima' => 'required|string',
            'no_hp_penerima' => 'nullable|string',
            'alamat_tujuan' => 'required|string',
            'catatan_pengantaran' => 'nullable|string',
            'catatan_tambahan' => 'nullable|string',
            
            'dokumen_surat' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_pendukung' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            
            'pernyataan' => 'required|in:1,true,on',
        ]);

        try {
            DB::beginTransaction();

            // 1. Handle User
            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                $user = User::create([
                    'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                    'name' => $validated['nama_pemohon'],
                    'email' => $validated['email'],
                    'password' => Hash::make(Str::random(12)),
                    'no_hp' => $validated['no_hp'],
                    'status' => 'Aktif',
                ]);
            }

            // 2. Handle Masyarakat Profile
            $masyarakat = Masyarakat::where('id_user', $user->id)->first();
            if (!$masyarakat) {
                $masyarakat = Masyarakat::create([
                    'id_user' => $user->id,
                    'nik' => $validated['nik'],
                    'alamat' => $validated['alamat_pemohon'],
                ]);
            } else {
                if (!$masyarakat->nik) {
                    $masyarakat->update(['nik' => $validated['nik']]);
                }
            }

            // 3. Prepare JSON content
            $isiPermohonan = json_encode([
                'nama_pemohon' => $validated['nama_pemohon'],
                'nik' => $validated['nik'],
                'no_hp' => $validated['no_hp'],
                'email' => $validated['email'],
                'alamat_pemohon' => $validated['alamat_pemohon'],
                
                'jenis_surat' => $validated['jenis_surat'],
                'nomor_surat' => $validated['nomor_surat'] ?? null,
                'tanggal_surat' => $validated['tanggal_surat'],
                'perihal' => $validated['perihal'],
                'instansi_tujuan' => $validated['instansi_tujuan'],
                'nama_penerima' => $validated['nama_penerima'],
                'no_hp_penerima' => $validated['no_hp_penerima'] ?? null,
                'alamat_tujuan' => $validated['alamat_tujuan'],
                'catatan_pengantaran' => $validated['catatan_pengantaran'] ?? null,
                'catatan_tambahan' => $validated['catatan_tambahan'] ?? null,
            ]);

            $kodeTiket = 'SRT-' . strtoupper(Str::random(6));

            // 4. Create Permohonan
            $permohonan = Permohonan::create([
                'id_masyarakat' => $masyarakat->id_masyarakat,
                'id_layanan' => $validated['id_layanan'],
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => $isiPermohonan,
                'status' => 'Menunggu Verifikasi',
            ]);

            // 5. Handle File Uploads
            if ($request->hasFile('dokumen_surat')) {
                $file = $request->file('dokumen_surat');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Surat/Dokumen',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }
            
            if ($request->hasFile('dokumen_pendukung')) {
                $file = $request->file('dokumen_pendukung');
                $filename = time() . '_pendukung_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Dokumen Pendukung',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            // 6. Create Initial Status
            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => 'Menunggu Verifikasi',
                'keterangan' => 'Pengajuan pengantaran surat Anda telah berhasil diterima dan akan diperiksa oleh petugas.',
                'waktu' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan pengantaran surat Anda telah berhasil diterima.',
                'kode_tiket' => $kodeTiket,
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => 'Menunggu Verifikasi',
                'tanggal_pengajuan' => now()->format('d M Y'),
                'nama_pemohon' => $validated['nama_pemohon'],
                'tujuan_pengantaran' => $validated['instansi_tujuan']
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
