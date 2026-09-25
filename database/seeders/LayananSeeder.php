<?php

namespace Database\Seeders;

use App\Models\Layanan;
use Illuminate\Database\Seeder;

class LayananSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data layanan kependudukan sebelumnya
        Layanan::whereIn('nama_layanan', [
            'Pembuatan KTP',
            'Pembuatan Kartu Keluarga',
            'Surat Keterangan Usaha (SKU)',
            'Surat Keterangan Tidak Mampu (SKTM)'
        ])->delete();

        $layanans = [
            [
                'nama_layanan' => 'Pejabat Pengelola Informasi dan Dokumentasi',
                'deskripsi' => 'Layanan Permohonan Informasi Publik.',
                'kategori' => 'Informasi Publik',
                'icon' => 'fa-info-circle',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Layanan Pendidikan Pemilih',
                'deskripsi' => 'Layanan Pendidikan Pemilih dan Sosialisasi.',
                'kategori' => 'Pendidikan',
                'icon' => 'fa-graduation-cap',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Layanan Pengaduan Masyarakat',
                'deskripsi' => 'Layanan Pengaduan dan Aspirasi Masyarakat.',
                'kategori' => 'Pengaduan',
                'icon' => 'fa-bullhorn',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Layanan Kerjasama',
                'deskripsi' => 'Layanan Kerjasama Antar Lembaga.',
                'kategori' => 'Kerjasama',
                'icon' => 'fa-handshake',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Layanan Pemutakhiran Data Pemilih',
                'deskripsi' => 'Layanan Pemutakhiran Data Pemilih Berkelanjutan.',
                'kategori' => 'Data Pemilih',
                'icon' => 'fa-users-cog',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Layanan Pemutakhiran Data Partai Politik',
                'deskripsi' => 'Layanan Pemutakhiran Data Partai Politik.',
                'kategori' => 'Partai Politik',
                'icon' => 'fa-flag',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Survei Kepuasan Masyarakat (SKM)',
                'deskripsi' => 'Survei untuk mengukur tingkat kepuasan masyarakat terhadap layanan KPU.',
                'kategori' => 'Survei',
                'icon' => 'fa-smile',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Buku Tamu',
                'deskripsi' => 'Layanan pengisian buku tamu digital KPU.',
                'kategori' => 'Administrasi',
                'icon' => 'fa-book',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Pengantaran Surat',
                'deskripsi' => 'Layanan pengantaran surat menyurat dinas.',
                'kategori' => 'Administrasi',
                'icon' => 'fa-envelope',
                'status' => 'Aktif',
            ],
            [
                'nama_layanan' => 'Konsultasi',
                'deskripsi' => 'Layanan konsultasi terkait kepemiluan dan kelembagaan.',
                'kategori' => 'Konsultasi',
                'icon' => 'fa-comments',
                'status' => 'Aktif',
            ],
        ];

        foreach ($layanans as $layanan) {
            Layanan::updateOrCreate(
                ['nama_layanan' => $layanan['nama_layanan']],
                $layanan
            );
        }
    }
}
