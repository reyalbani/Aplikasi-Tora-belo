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
use Illuminate\Support\Facades\Storage;

class KonsultasiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'nama_lengkap' => 'required|string|max:100',
            'nik' => 'nullable|string|max:20',
            'no_hp' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'instansi' => 'nullable|string|max:150',
            'alamat' => 'nullable|string',
            
            'jenis_konsultasi' => 'required|string',
            'judul_konsultasi' => 'required|string|max:255',
            'uraian_konsultasi' => 'required|string',
            'kanal_konsultasi' => 'required|string',
            'waktu_konsultasi' => 'nullable|string',
            
            'dokumen_pendukung' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            
            'pernyataan' => 'required|in:1,true,on',
        ]);

        try {
            DB::beginTransaction();
            $uploadedFiles = [];

            // 1. Handle User
            $email = !empty($validated['email']) ? $validated['email'] : 'konsultasi_' . time() . '@sipadu.local';
            $user = User::where('email', $email)->first();
            if (!$user) {
                $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                $user = User::create([
                    'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                    'name' => $validated['nama_lengkap'],
                    'email' => $email,
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
                    'alamat' => $validated['alamat'] ?? '-',
                ]);
            }

            // 3. Prepare JSON content
            $isiPermohonan = json_encode([
                'nama_lengkap' => $validated['nama_lengkap'],
                'nik' => $validated['nik'] ?? '-',
                'no_hp' => $validated['no_hp'],
                'email' => $validated['email'] ?? '-',
                'instansi' => $validated['instansi'] ?? '-',
                'alamat' => $validated['alamat'] ?? '-',
                'jenis_konsultasi' => $validated['jenis_konsultasi'],
                'judul_konsultasi' => $validated['judul_konsultasi'],
                'uraian_konsultasi' => $validated['uraian_konsultasi'],
                'kanal_konsultasi' => $validated['kanal_konsultasi'],
                'waktu_konsultasi' => $validated['waktu_konsultasi'] ?? '-',
            ]);

            $kodeTiket = 'KNS-' . date('Y') . '-' . strtoupper(Str::random(6));

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
            if ($request->hasFile('dokumen_pendukung')) {
                $file = $request->file('dokumen_pendukung');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/dokumen_permohonan', $filename);
                $uploadedFiles[] = $path;
                
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
                'keterangan' => 'Permohonan berhasil dikirim dan sedang menunggu verifikasi.',
                'waktu' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan Konsultasi berhasil dikirim.',
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now()->format('Y-m-d H:i:s'),
                'nama_pemohon' => $validated['nama_lengkap'],
                'topik_konsultasi' => $validated['jenis_konsultasi']
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Cleanup files
            if (isset($uploadedFiles) && count($uploadedFiles) > 0) {
                foreach ($uploadedFiles as $path) {
                    Storage::delete($path);
                }
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat memproses pengajuan Anda. Silakan coba beberapa saat lagi.'
            ], 500);
        }
    }
}
