import re

with open('app/Http/Controllers/PengaduanPelayananController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# I will just write a new script, no interpolation!
new_content = '''<?php

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
    public function store(Request )
    {
         = ->validate([
            'id_layanan' => 'required|exists:layanans,id_layanan',
            'nama_pelapor' => 'required|string|max:255',
            'nik_pelapor' => 'required|string|size:16',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat_pelapor' => 'required|string',
            'jenis_laporan' => 'required|string',
            'ringkasan_aduan' => 'required|string',
            'bukti_pendukung' => 'nullable|file|max:5120',
        ]);

        try {
            DB::beginTransaction();

            // 1. Handle User
             = User::where('email', ['email'])->first();
            if (!) {
                 = Role::where('nama_role', 'Masyarakat')->first();
                 = User::create([
                    'id_role' =>  ? ->id_role : null,
                    'name' => ['nama_pelapor'],
                    'email' => ['email'],
                    'password' => Hash::make(Str::random(12)),
                    'no_hp' => ['no_hp'],
                    'status' => 'Aktif',
                ]);
            }

            // 2. Handle Masyarakat Profile
             = Masyarakat::where('id_user', ->id)->first();
            if (!) {
                 = Masyarakat::create([
                    'id_user' => ->id,
                    'nik' => ['nik_pelapor'],
                    'alamat' => ['alamat_pelapor'],
                ]);
            } else {
                if (!->nik) {
                    ->update([
                        'nik' => ['nik_pelapor'], 
                        'alamat' => ['alamat_pelapor']
                    ]);
                }
            }

            // 3. Prepare JSON content for Permohonan
             = [
                'jenis_laporan' => ['jenis_laporan'],
                'ringkasan_aduan' => ['ringkasan_aduan'],
            ];

             = 'PGD-' . strtoupper(Str::random(6));
             = 'Diterima';
             = 'Pengaduan pelayanan telah diterima dan akan segera diverifikasi.';

            // 4. Create Permohonan
             = Permohonan::create([
                'id_masyarakat' => ->id_masyarakat,
                'id_layanan' => ['id_layanan'],
                'kode_tiket' => ,
                'tanggal_pengajuan' => now(),
                'isi_permohonan' => json_encode(),
                'status' => ,
            ]);

            // 5. Handle File Uploads
            if (->hasFile('bukti_pendukung')) {
                 = ->file('bukti_pendukung');
                 = time() . '_' . Str::random(10) . '.' . ->getClientOriginalExtension();
                 = ->storeAs('public/dokumen_permohonan', );
                
                DokumenPermohonan::create([
                    'id_permohonan' => ->id_permohonan,
                    'nama_file' => ->getClientOriginalName(),
                    'path_file' => 'storage/dokumen_permohonan/' . ,
                    'jenis_dokumen' => 'Bukti Pendukung Aduan',
                    'ukuran_file' => ->getSize(),
                    'tanggal_upload' => now(),
                ]);
            }

            // 6. Create Initial Status
            StatusPermohonan::create([
                'id_permohonan' => ->id_permohonan,
                'status' => ,
                'keterangan' => ,
                'waktu' => now(),
            ]);

            DB::commit();

            if (->wantsJson() || ->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pengaduan berhasil dikirim.',
                    'kode_tiket' => ,
                    'id_permohonan' => ->id_permohonan,
                    'status' => ,
                    'tanggal' => now()->format('Y-m-d H:i:s'),
                    'jenis_laporan' => ['jenis_laporan']
                ]);
            }

            return back()->with('success', "Pengaduan berhasil dikirim. Nomor Tiket Anda: ");

        } catch (\Exception ) {
            DB::rollBack();
            if (->wantsJson() || ->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan sistem saat menyimpan data: ' . ->getMessage()
                ], 500);
            }
            return back()->withErrors(['error' => 'Terjadi kesalahan sistem saat menyimpan data: ' . ->getMessage()]);
        }
    }
}
'''

with open('app/Http/Controllers/PengaduanPelayananController.php', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
