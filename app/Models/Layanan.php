<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    use HasFactory;

    protected $table = 'layanan';
    protected $primaryKey = 'id_layanan';
    protected $fillable = ['nama_layanan', 'deskripsi', 'kategori', 'icon', 'status'];

    public function persyaratan()
    {
        return $this->hasMany(Persyaratan::class, 'id_layanan', 'id_layanan');
    }

    public function permohonan()
    {
        return $this->hasMany(Permohonan::class, 'id_layanan', 'id_layanan');
    }

    public function bukuTamu()
    {
        return $this->hasMany(BukuTamu::class, 'id_layanan', 'id_layanan');
    }
}
