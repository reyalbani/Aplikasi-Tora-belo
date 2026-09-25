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

class KerjasamaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'nama' => 'required|string|max:100',
            'instansi' => 'required|string|max:150',
            'jabatan' => 'required|string|max:100',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'jenis_lembaga' => 'required|string|in:Instansi Pemerintah,TNI/Polri,Perguruan Tinggi,Ormas/NGO/Lembaga Masyarakat,BUMN/BUMD,Swasta,Lainnya',
            
            'judul_kerjasama' => 'required|string|max:255',
            'latar_belakang' => 'required|string',
            'maksud_tujuan' => 'required|string',
            'ruang_lingkup' => 'required|string',
            'rencana_kegiatan' => 'required|string',
            'jangka_waktu' => 'required|string',
            'keterangan_tambahan' => 'nullable|string',
            
            'dokumen_surat' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_proposal' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_legalitas' => 'required|file|mimes:pdf,jpg,jpeg,png,zip,rar|max:10240',
            'dokumen_draft' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'dokumen_pendukung' => 'nullable|file|mimes:pdf,jpg,jpeg,png,zip,rar|max:10240',
        ]);

        try {
            DB::beginTransaction();

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
                    'alamat' => '', // Alamat not explicitly required in Kerjasama form based on prompt, but keeping it empty string
                ]);
            }

            // 3. Prepare JSON content
            $isiPermohonan = json_encode([
                'instansi' => $validated['instansi'],
                'jabatan' => $validated['jabatan'],
                'jenis_lembaga' => $validated['jenis_lembaga'],
                'judul_kerjasama' => $validated['judul_kerjasama'],
                'latar_belakang' => $validated['latar_belakang'],
                'maksud_tujuan' => $validated['maksud_tujuan'],
                'ruang_lingkup' => $validated['ruang_lingkup'],
                'rencana_kegiatan' => $validated['rencana_kegiatan'],
                'jangka_waktu' => $validated['jangka_waktu'],
                'keterangan_tambahan' => $validated['keterangan_tambahan'],
            ]);

            $kodeTiket = 'KS-' . strtoupper(Str::random(6));

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
            $filesToUpload = [
                'dokumen_surat' => 'Surat Permohonan',
                'dokumen_proposal' => 'Proposal Kerjasama',
                'dokumen_legalitas' => 'Dokumen Legalitas',
                'dokumen_draft' => 'Draft MoU/PKS',
                'dokumen_pendukung' => 'Dokumen Pendukung'
            ];

            foreach ($filesToUpload as $inputName => $jenisDokumen) {
                if ($request->hasFile($inputName)) {
                    $file = $request->file($inputName);
                    $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('public/dokumen_permohonan', $filename);
                    
                    DokumenPermohonan::create([
                        'id_permohonan' => $permohonan->id_permohonan,
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => 'storage/dokumen_permohonan/' . $filename,
                        'jenis_dokumen' => $jenisDokumen,
                        'ukuran_file' => $file->getSize(),
                        'tanggal_upload' => now(),
                    ]);
                }
            }

            // 6. Create Initial Status
            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => 'Menunggu Verifikasi',
                'keterangan' => 'Permohonan kerjasama berhasil diajukan dan sedang menunggu verifikasi awal.',
                'waktu' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan kerjasama berhasil dikirim.',
                'kode_tiket' => $kodeTiket,
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
