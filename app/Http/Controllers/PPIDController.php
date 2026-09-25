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

class PPIDController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_layanan' => 'required|exists:layanan,id_layanan',
            'tipe_pengajuan' => 'nullable|string|in:permohonan,keberatan',
            'jenis_pemohon' => 'required|string|in:Perorangan,Lembaga/Organisasi Masyarakat,Badan Hukum,Kuasa Pemohon',
            'nik' => 'required|string|max:20',
            'nama' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
            'pekerjaan' => 'nullable|string|max:100',
            
            // Fields for Permohonan Informasi
            'rincian_informasi' => 'required_if:tipe_pengajuan,permohonan|nullable|string',
            'tujuan_penggunaan' => 'required_if:tipe_pengajuan,permohonan|nullable|string',
            'cara_memperoleh' => 'required_if:tipe_pengajuan,permohonan|nullable|string',
            'cara_mendapatkan_salinan' => 'required_if:tipe_pengajuan,permohonan|nullable|string',
            
            // Fields for Pengajuan Keberatan
            'kode_tiket_awal' => 'nullable|string|max:50',
            'alasan_keberatan' => 'required_if:tipe_pengajuan,keberatan|nullable|string',
            'kasus_posisi' => 'required_if:tipe_pengajuan,keberatan|nullable|string',
            
            'dokumen_ktp' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_legalitas' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_surat_kuasa' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_identitas_pemberi_kuasa' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_tanda_terima_awal' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumen_surat_pemberitahuan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        try {
            
            $tipe = $validated['tipe_pengajuan'] ?? 'permohonan';
            $jenis = $validated['jenis_pemohon'];
            $errors = [];
            
            if (!$request->hasFile('dokumen_ktp')) {
                $errors['dokumen_ktp'] = ['Identitas/KTP wajib diunggah.'];
            }
            if (in_array($jenis, ['Lembaga/Organisasi Masyarakat', 'Badan Hukum']) && !$request->hasFile('dokumen_legalitas')) {
                $errors['dokumen_legalitas'] = ['Dokumen legalitas wajib diunggah.'];
            }
            if ($jenis === 'Kuasa Pemohon') {
                if (!$request->hasFile('dokumen_surat_kuasa')) {
                    $errors['dokumen_surat_kuasa'] = ['Surat kuasa wajib diunggah.'];
                }
                if (!$request->hasFile('dokumen_identitas_pemberi_kuasa')) {
                    $errors['dokumen_identitas_pemberi_kuasa'] = ['Identitas pemberi kuasa wajib diunggah.'];
                }
            }
            
            if (count($errors) > 0) {
                return response()->json(['message' => 'The given data was invalid.', 'errors' => $errors], 422);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation failed', $e->errors());
            throw $e;
        }

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
                    'nik' => $validated['nik'],
                    'alamat' => $validated['alamat'],
                ]);
            } else {
                // Update missing info if necessary
                if (!$masyarakat->nik) {
                    $masyarakat->update(['nik' => $validated['nik'], 'alamat' => $validated['alamat']]);
                }
            }

            // 3. Prepare JSON content for Permohonan
            $isiPermohonan = [
                'tipe_pengajuan' => $tipe,
                'jenis_pemohon' => $validated['jenis_pemohon'],
                'pekerjaan' => $validated['pekerjaan'] ?? null,
            ];

            if ($tipe === 'keberatan') {
                $isiPermohonan['kode_tiket_awal'] = $validated['kode_tiket_awal'] ?? null;
                $isiPermohonan['alasan_keberatan'] = $validated['alasan_keberatan'] ?? null;
                $isiPermohonan['kasus_posisi'] = $validated['kasus_posisi'] ?? null;
                $kodeTiket = 'KBT-' . strtoupper(Str::random(6));
                $initialStatus = 'Pengajuan Keberatan';
                $statusKeterangan = 'Pemohon mengajukan surat keberatan informasi publik melalui layanan PPID.';
            } else {
                $isiPermohonan['rincian_informasi'] = $validated['rincian_informasi'] ?? null;
                $isiPermohonan['tujuan_penggunaan'] = $validated['tujuan_penggunaan'] ?? null;
                $isiPermohonan['cara_memperoleh'] = $validated['cara_memperoleh'] ?? null;
                $isiPermohonan['cara_mendapatkan_salinan'] = $validated['cara_mendapatkan_salinan'] ?? null;
                $kodeTiket = 'PID-' . strtoupper(Str::random(6));
                $initialStatus = 'Pengajuan Permohonan';
                $statusKeterangan = 'Pemohon mengajukan permohonan informasi publik melalui layanan PPID.';
            }

            // 4. Create Permohonan
            $permohonan = Permohonan::create([
                'id_masyarakat' => $masyarakat->id_masyarakat,
                'id_layanan' => $validated['id_layanan'],
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => json_encode($isiPermohonan),
                'status' => $initialStatus,
            ]);

            // 5. Handle File Uploads
            $filesToProcess = [
                'dokumen_ktp' => 'KTP/Identitas Diri',
                'dokumen_legalitas' => 'Dokumen Legalitas',
                'dokumen_surat_kuasa' => 'Surat Kuasa',
                'dokumen_identitas_pemberi_kuasa' => 'Identitas Pemberi Kuasa',
                'dokumen_tanda_terima_awal' => 'Tanda Terima Awal Permohonan',
                'dokumen_surat_pemberitahuan' => 'Surat Pemberitahuan Tertulis PPID',
            ];
            
            foreach($filesToProcess as $inputName => $jenisDokumen) {
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
                'status' => $initialStatus,
                'keterangan' => $statusKeterangan,
                'waktu' => now(),
            ]);

            DB::commit();

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => $tipe === 'keberatan' ? 'Pengajuan keberatan PPID berhasil dikirim.' : 'Permohonan PPID berhasil dikirim.',
                    'kode_tiket' => $kodeTiket,
                    'id_permohonan' => $permohonan->id_permohonan,
                    'status' => $initialStatus
                ]);
            }

            return redirect()->route('ppid.success', ['tiket' => $kodeTiket]);

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
