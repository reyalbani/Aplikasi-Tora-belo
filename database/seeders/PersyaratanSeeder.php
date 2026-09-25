<?php

namespace Database\Seeders;

use App\Models\Layanan;
use App\Models\Persyaratan;
use Illuminate\Database\Seeder;

class PersyaratanSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan seluruh data persyaratan sebelumnya
        Persyaratan::query()->delete();
        
        // Hapus juga berdasarkan Layanan kependudukan yang mungkin masih tersisa di DB
        $layananLama = [
            'Pembuatan KTP',
            'Pembuatan Kartu Keluarga',
            'Surat Keterangan Usaha (SKU)',
            'Surat Keterangan Tidak Mampu (SKTM)'
        ];

        $idsLama = Layanan::whereIn('nama_layanan', $layananLama)->pluck('id_layanan');
        if ($idsLama->isNotEmpty()) {
            Persyaratan::whereIn('id_layanan', $idsLama)->delete();
        }

        /*
         * Catatan: 
         * Sesuai ketentuan kesepakatan SIPADU (6 Layanan KPU):
         * 1. Layanan PPID
         * 2. Layanan Pendidikan Pemilih
         * 3. Layanan Pengaduan Masyarakat
         * 4. Layanan Kerjasama
         * 5. Layanan Pemutakhiran Data Pemilih
         * 6. Layanan Pemutakhiran Data Partai Politik
         * 
         * Belum ada sumber persyaratan resmi di dalam project untuk 6 layanan di atas.
         * Sehingga tidak ada data persyaratan fiktif yang ditambahkan.
         * Harap laporkan bagian ini untuk ditambahkan apabila persyaratannya sudah resmi turun.
         */
    }
}
