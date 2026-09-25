<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkmResponden extends Model
{
    use HasFactory;

    protected $table = 'skm_responden';

    protected $fillable = [
        'id_masyarakat',
        'id_permohonan',
        'nama',
        'email',
        'nomor_hp',
        'umur',
        'usia',
        'jenis_kelamin',
        'domisili',
        'pendidikan',
        'pekerjaan',
        'saran',
        'tanggal',
        'jam_survei'
    ];

    public function jawaban()
    {
        return $this->hasMany(SkmJawaban::class, 'responden_id', 'id');
    }

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'id_permohonan', 'id_permohonan');
    }
}
