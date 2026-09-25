<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenPermohonan extends Model
{
    use HasFactory;

    protected $table = 'dokumen_permohonan';
    protected $primaryKey = 'id_dokumen';
    public $timestamps = false;
    protected $fillable = ['id_permohonan', 'nama_file', 'path_file', 'jenis_dokumen', 'ukuran_file', 'tanggal_upload'];

    protected function casts(): array
    {
        return [
            'tanggal_upload' => 'datetime',
        ];
    }

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class, 'id_permohonan', 'id_permohonan');
    }
}
