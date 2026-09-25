<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SkmPertanyaan;

class SkmPertanyaanSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            "Bagaimana pendapat saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?",
            "Bagaimana pemahaman saudara tentang kemudahan prosedur pelayanan di Unit ini?",
            "Bagaimana pendapat saudara tentang kecepatan waktu dalam memberikan pelayanan?",
            "Bagaimana pendapat saudara tentang kewajaran biaya/tarif dalam pelayanan?",
            "Bagaimana pendapat saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?",
            "Bagaimana pendapat saudara tentang kompetensi/kemampuan petugas dalam pelayanan?",
            "Bagaimana pendapat saudara perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?",
            "Bagaimana pendapat saudara tentang kualitas sarana dan prasarana?",
            "Bagaimana pendapat saudara tentang penanganan pengaduan pengguna layanan?"
        ];

        foreach ($questions as $index => $q) {
            SkmPertanyaan::firstOrCreate([
                'pertanyaan' => $q
            ], [
                'tipe' => 'rating',
                'urutan' => $index + 1,
                'status' => 'aktif'
            ]);
        }
    }
}
