<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaduanPelayanan extends Model
{
    protected $fillable = [
        'nomor_tiket',
        'nama_lengkap',
        'email',
        'telepon',
        'jenis',
        'pesan',
        'status',
    ];
}
