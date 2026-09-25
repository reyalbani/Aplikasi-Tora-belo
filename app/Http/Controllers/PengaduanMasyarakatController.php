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

class PengaduanMasyarakatController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_layanan' => 'required|exists:layanan,id_layanan',
                'status_pelapor' => 'required|in:Perorangan,Kuasa Pelapor,Anonim/Rahasia',
                
                'nik' => 'nullable|required_unless:status_pelapor,Anonim/Rahasia|string|max:16',
                'nama' => 'nullable|required_unless:status_pelapor,Anonim/Rahasia|string|max:100',
                'no_hp' => 'nullable|string|max:20',
                'email' => 'nullable|required_unless:status_pelapor,Anonim/Rahasia|email|max:100',
                'alamat' => 'nullable|required_unless:status_pelapor,Anonim/Rahasia|string',
                
                'kategori_pengaduan' => 'required|in:Administrasi Pelayanan,Kode Etik,Sengketa,WBS / Dugaan Pelanggaran',
                'judul_pengaduan' => 'required|string|max:255',
                'uraian_pengaduan' => 'required|string',
                'lokasi_kejadian' => 'required|string',
                'waktu_kejadian' => 'required|string',
                'pihak_dilaporkan' => 'required|string',
                'tuntutan' => 'required|string',
                
                'dokumen_ktp' => 'nullable|required_unless:status_pelapor,Anonim/Rahasia|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'dokumen_surat_kuasa' => 'nullable|required_if:status_pelapor,Kuasa Pelapor|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'bukti_pendukung.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,mp3,mp4,doc,docx,xls,xlsx|max:10240',
            ]);

            DB::beginTransaction();

            $masyarakat = null;
            if ($validated['status_pelapor'] !== 'Anonim/Rahasia') {
                $user = User::where('email', $validated['email'])->first();
                if (!$user) {
                    $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                    $user = User::create([
                        'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                        'name' => $validated['nama'],
                        'email' => $validated['email'],
                        'password' => Hash::make(Str::random(12)),
                        'no_hp' => $validated['no_hp'] ?? '',
                        'status' => 'Aktif',
                    ]);
                }

                $masyarakat = Masyarakat::where('id_user', $user->id)->first();
                if (!$masyarakat) {
                    $masyarakat = Masyarakat::create([
                        'id_user' => $user->id,
                        'nik' => $validated['nik'],
                        'alamat' => $validated['alamat'],
                    ]);
                }
            } else {
                $user = User::where('email', 'anonim@sipadu.local')->first();
                if (!$user) {
                    $roleMasyarakat = Role::where('nama_role', 'Masyarakat')->first();
                    $user = User::create([
                        'id_role' => $roleMasyarakat ? $roleMasyarakat->id_role : null,
                        'name' => 'Anonim',
                        'email' => 'anonim@sipadu.local',
                        'password' => Hash::make(Str::random(12)),
                        'no_hp' => '',
                        'status' => 'Aktif',
                    ]);
                }
                
                $masyarakat = Masyarakat::where('id_user', $user->id)->first();
                if (!$masyarakat) {
                    $masyarakat = Masyarakat::create([
                        'id_user' => $user->id,
                        'nik' => '0000000000000000',
                        'alamat' => 'Rahasia',
                    ]);
                }
            }

            $isiPermohonan = json_encode([
                'status_pelapor' => $validated['status_pelapor'],
                'nik' => $validated['nik'] ?? 'Dirahasiakan',
                'nama' => $validated['nama'] ?? 'Anonim',
                'email' => $validated['email'] ?? 'Dirahasiakan',
                'no_hp' => $validated['no_hp'] ?? 'Dirahasiakan',
                'alamat' => $validated['alamat'] ?? 'Dirahasiakan',
                'kategori_pengaduan' => $validated['kategori_pengaduan'],
                'judul_pengaduan' => $validated['judul_pengaduan'],
                'uraian_pengaduan' => $validated['uraian_pengaduan'],
                'lokasi_kejadian' => $validated['lokasi_kejadian'],
                'waktu_kejadian' => $validated['waktu_kejadian'],
                'pihak_dilaporkan' => $validated['pihak_dilaporkan'],
                'tuntutan' => $validated['tuntutan'],
            ]);

            $kodeTiket = 'ADU-' . strtoupper(Str::random(6));

            $permohonan = Permohonan::create([
                'id_masyarakat' => $masyarakat->id_masyarakat,
                'id_layanan' => $validated['id_layanan'],
                'kode_tiket' => $kodeTiket,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => $isiPermohonan,
                'status' => 'Diajukan',
            ]);

            if ($request->hasFile('dokumen_ktp')) {
                $file = $request->file('dokumen_ktp');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Identitas KTP',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }
            
            if ($request->hasFile('dokumen_surat_kuasa')) {
                $file = $request->file('dokumen_surat_kuasa');
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/dokumen_permohonan', $filename);
                DokumenPermohonan::create([
                    'id_permohonan' => $permohonan->id_permohonan,
                    'nama_file' => $file->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . $filename,
                    'jenis_dokumen' => 'Surat Kuasa Khusus',
                    'ukuran_file' => $file->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            if ($request->hasFile('bukti_pendukung')) {
                foreach ($request->file('bukti_pendukung') as $file) {
                    $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('public/dokumen_permohonan', $filename);
                    DokumenPermohonan::create([
                        'id_permohonan' => $permohonan->id_permohonan,
                        'nama_file' => $file->getClientOriginalName(),
                        'path_file' => 'storage/dokumen_permohonan/' . $filename,
                        'jenis_dokumen' => 'Bukti Pendukung',
                        'ukuran_file' => $file->getSize(),
                        'tanggal_upload' => now(),
                    ]);
                }
            }

            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => 'Diajukan',
                'keterangan' => 'Pengaduan berhasil diajukan dan menunggu penerimaan oleh petugas.',
                'waktu' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengaduan berhasil diajukan.',
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
