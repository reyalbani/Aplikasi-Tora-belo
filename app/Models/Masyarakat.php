<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Masyarakat extends Model
{
    use HasFactory;

    protected $table = 'masyarakat';
    protected $primaryKey = 'id_masyarakat';
    protected $fillable = ['id_user', 'nik', 'alamat'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function permohonan()
    {
        return $this->hasMany(Permohonan::class, 'id_masyarakat', 'id_masyarakat');
    }

    public function bukuTamu()
    {
        return $this->hasMany(BukuTamu::class, 'id_masyarakat', 'id_masyarakat');
    }

    public function konsultasi()
    {
        return $this->hasMany(Konsultasi::class, 'id_masyarakat', 'id_masyarakat');
    }

    public function pengaduan()
    {
        return $this->hasMany(Pengaduan::class, 'id_masyarakat', 'id_masyarakat');
    }
}
