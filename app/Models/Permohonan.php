<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;

    protected $table = 'permohonan';
    protected $primaryKey = 'id_permohonan';
    protected $fillable = ['id_masyarakat', 'id_layanan', 'id_petugas', 'kode_tiket', 'tanggal_pengajuan', 'isi_permohonan', 'status', 'hasil', 'tanggal_selesai'];

    protected function casts(): array
    {
        return [
            'tanggal_pengajuan' => 'datetime',
            'tanggal_selesai' => 'datetime',
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

    public function petugas()
    {
        return $this->belongsTo(Petugas::class, 'id_petugas', 'id_petugas');
    }

    public function dokumenPermohonan()
    {
        return $this->hasMany(DokumenPermohonan::class, 'id_permohonan', 'id_permohonan');
    }

    public function statusPermohonan()
    {
        return $this->hasMany(StatusPermohonan::class, 'id_permohonan', 'id_permohonan');
    }

    public function pengantaranSurat()
    {
        return $this->hasMany(PengantaranSurat::class, 'id_permohonan', 'id_permohonan');
    }
}
