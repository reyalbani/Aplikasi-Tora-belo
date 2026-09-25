<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    use HasFactory;

    protected $table = 'pengaduan';
    protected $primaryKey = 'id_pengaduan';
    protected $fillable = ['id_masyarakat', 'id_petugas', 'kode_pengaduan', 'isi_pengaduan', 'tanggal', 'status', 'tanggapan', 'tanggal_selesai'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'datetime',
            'tanggal_selesai' => 'datetime',
        ];
    }

    public function masyarakat()
    {
        return $this->belongsTo(Masyarakat::class, 'id_masyarakat', 'id_masyarakat');
    }

    public function petugas()
    {
        return $this->belongsTo(Petugas::class, 'id_petugas', 'id_petugas');
    }
}
