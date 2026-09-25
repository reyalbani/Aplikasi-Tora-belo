<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Masyarakat;
use App\Models\Permohonan;
use App\Models\StatusPermohonan;
use App\Models\DokumenPermohonan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PengaduanPelayananController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanans,id_layanan',
            'nama_pelapor' => 'required|string|max:255',
            'nik_pelapor' => 'required|string|size:16',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat_pelapor' => 'required|string',
            'jenis_pengaduan' => 'required|string',
            'judul_pengaduan' => 'required|string|max:255',
            'uraian_pengaduan' => 'required|string',
            'waktu_kejadian' => 'nullable|string|max:255',
            'lokasi_kejadian' => 'nullable|string|max:255',
            'harapan' => 'nullable|string',
            'bukti_pendukung' => 'nullable|file|max:102400',
            'pernyataan' => 'accepted'
        ]);

        try {
            DB::beginTransaction();

            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                $user = User::create([
                    'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                    'name' => $validated['nama_pelapor'],
                    'email' => $validated['email'],
                    'password' => Hash::make(Str::random(12)),
                    'no_hp' => $validated['no_hp'],
                    'status' => 'Aktif',
                ]);
            }

            $masyarakat = Masyarakat::where('id_user', $user->id)->first();
            if (!$masyarakat) {
                $masyarakat = Masyarakat::create([
                    'id_user' => $user->id,
                    'nik' => $validated['nik_pelapor'],
                    'alamat' => $validated['alamat_pelapor'],
                ]);
            } else {
                if (!$masyarakat->nik) {
                    $masyarakat->update([
                        'nik' => $validated['nik_pelapor'], 
                        'alamat' => $validated['alamat_pelapor']
                    ]);
                }
            }

            $isiPermohonan = [
                'jenis_pengaduan' => $validated['jenis_pengaduan'],
                'judul_pengaduan' => $validated['judul_pengaduan'],
                'uraian_pengaduan' => $validated['uraian_pengaduan'],
                'waktu_kejadian' => $validated['waktu_kejadian'] ?? null,
                'lokasi_kejadian' => $validated['lokasi_kejadian'] ?? null,
                'harapan' => $validated['harapan'] ?? null,
            ];

            $kodeTiket = 'PGD-' . strtoupper(Str::random(6));
            $initialStatus = 'Diterima';
            $statusKeterangan = 'Pengaduan pelayanan telah diterima dan akan segera diverifikasi.';

            $permohonan = Permohonan::create([
                'id_masyarakat' => $masyarakat->id_masyarakat,
                'id_layanan' => $validated['id_layanan'],
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => json_encode($isiPermohonan),
                'status' => $initialStatus,
            ]);

            if ($request->hasFile('bukti_pendukung')) {
                $file = $request->file('bukti_pendukung');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/dokumen_permohonan', $filename);
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Bukti Pendukung Aduan',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $initialStatus,
                'keterangan' => $statusKeterangan,
                'waktu' => now(),
            ]);

            DB::commit();

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pengaduan berhasil dikirim.',
                    'kode_tiket' => $kodeTiket,
                    'id_permohonan' => $permohonan->id_permohonan,
                    'status' => $initialStatus,
                    'tanggal' => now()->format('Y-m-d H:i:s'),
                    'jenis_pengaduan' => $validated['jenis_pengaduan']
                ]);
            }

            return back()->with('success', "Pengaduan berhasil dikirim. Nomor Tiket Anda: $kodeTiket");

        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan sistem saat menyimpan data: ' . $e->getMessage()
                ], 500);
            }
            return back()->withErrors(['error' => 'Terjadi kesalahan sistem saat menyimpan data: ' . $e->getMessage()]);
        }
    }
}
