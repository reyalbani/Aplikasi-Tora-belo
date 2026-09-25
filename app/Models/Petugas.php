<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Petugas extends Model
{
    use HasFactory;

    protected $table = 'petugas';
    protected $primaryKey = 'id_petugas';
    protected $fillable = ['id_user', 'nip', 'jabatan'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function permohonan()
    {
        return $this->hasMany(Permohonan::class, 'id_petugas', 'id_petugas');
    }

    public function statusPermohonan()
    {
        return $this->hasMany(StatusPermohonan::class, 'id_petugas', 'id_petugas');
    }

    public function konsultasi()
    {
        return $this->hasMany(Konsultasi::class, 'id_petugas', 'id_petugas');
    }

    public function pengaduan()
    {
        return $this->hasMany(Pengaduan::class, 'id_petugas', 'id_petugas');
    }

    public function pengantaranSurat()
    {
        return $this->hasMany(PengantaranSurat::class, 'id_petugas', 'id_petugas');
    }
}
