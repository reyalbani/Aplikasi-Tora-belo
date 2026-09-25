<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusPermohonan extends Model
{
    use HasFactory;

    protected $table = 'status_permohonan';
    protected $primaryKey = 'id_status';
    public $timestamps = false;
    protected $fillable = ['id_permohonan', 'id_petugas', 'status', 'keterangan', 'waktu'];

    protected function casts(): array
    {
        return [
            'waktu' => 'datetime',
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
