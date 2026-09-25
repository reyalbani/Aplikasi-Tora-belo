<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BukuTamu extends Model
{
    use HasFactory;

    protected $table = 'buku_tamu';
    protected $primaryKey = 'id_buku_tamu';
    public $timestamps = false;
    protected $fillable = ['id_masyarakat', 'id_layanan', 'nama', 'nomor_whatsapp', 'email', 'instansi', 'keperluan', 'tanggal'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'datetime',
        ];
    }

    public function masyarakat()
    {
        return $this->belongsTo(Masyarakat::class, 'id_masyarakat', 'id_masyarakat');
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }
}
