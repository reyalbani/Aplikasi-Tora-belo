<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengantaranSurat extends Model
{
    use HasFactory;

    protected $table = 'pengantaran_surat';
    protected $primaryKey = 'id_pengantaran';
    protected $fillable = ['id_permohonan', 'id_petugas', 'nomor_surat', 'tujuan', 'alamat_tujuan', 'tanggal_pengantaran', 'status', 'keterangan'];

    protected function casts(): array
    {
        return [
            'tanggal_pengantaran' => 'datetime',
        ];
    }

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'id_permohonan', 'id_permohonan');
    }

    public function petugas()
    {
        return $this->belongsTo(Petugas::class, 'id_petugas', 'id_petugas');
    }
}
