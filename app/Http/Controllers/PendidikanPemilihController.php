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

class PendidikanPemilihController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'nama' => 'required|string|max:100',
            'lembaga' => 'required|string|max:150',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'alamat' => 'required|string',
            
            'waktu_kegiatan' => 'required|string',
            'tempat_kegiatan' => 'required|string',
            'jumlah_peserta' => 'required|integer|min:1',
            'profil_peserta' => 'required|string',
            'topik_materi' => 'required|string',
            
            'bentuk_kegiatan' => 'required|string|in:Sosialisasi tatap muka,Kunjungan Rumah Pintar Pemilu/RPP,KPU Goes to School,KPU Goes to Campus,Webinar',
            
            'dokumen_surat' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_proposal' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        try {
            DB::beginTransaction();
            $uploadedFiles = [];

            // 1. Handle User
            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                $user = User::create([
                    'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                    'name' => $validated['nama'],
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
                    'alamat' => $validated['alamat'],
                ]);
            }

            // 3. Prepare JSON content
            $isiPermohonan = json_encode([
                'lembaga' => $validated['lembaga'],
                'waktu_kegiatan' => $validated['waktu_kegiatan'],
                'tempat_kegiatan' => $validated['tempat_kegiatan'],
                'jumlah_peserta' => $validated['jumlah_peserta'],
                'profil_peserta' => $validated['profil_peserta'],
                'topik_materi' => $validated['topik_materi'],
                'bentuk_kegiatan' => $validated['bentuk_kegiatan'],
                // Add workflow fields placeholder
                'kajian_teknis' => null,
                'pelaksanaan' => null,
                'evaluasi' => null
            ]);

            $kodeTiket = 'DIK-' . strtoupper(Str::random(6));

            // 4. Create Permohonan
            $permohonan = Permohonan::create([
                'id_masyarakat' => $masyarakat->id_masyarakat,
                'id_layanan' => $validated['id_layanan'],
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => $isiPermohonan,
                'status' => 'Pengajuan Permohonan',
            ]);

            // 5. Handle File Uploads
            if ($request->hasFile('dokumen_surat')) {
                $file = $request->file('dokumen_surat');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/dokumen_permohonan', $filename);
                $uploadedFiles[] = $path;
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Surat Permohonan',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            if ($request->hasFile('dokumen_proposal')) {
                $file = $request->file('dokumen_proposal');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/dokumen_permohonan', $filename);
                $uploadedFiles[] = $path;
                
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Proposal Kegiatan',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            // 6. Create Initial Status
            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => 'Pengajuan Permohonan',
                'keterangan' => 'Permohonan berhasil dikirim.',
                'waktu' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan berhasil dikirim.',
                'kode_tiket' => $kodeTiket,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Cleanup uploaded files if database fails
            if (isset($uploadedFiles) && count($uploadedFiles) > 0) {
                foreach ($uploadedFiles as $path) {
                    \Illuminate\Support\Facades\Storage::delete($path);
                }
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat memproses pengajuan Anda. Silakan coba beberapa saat lagi.'
            ], 500);
        }
    }
}
