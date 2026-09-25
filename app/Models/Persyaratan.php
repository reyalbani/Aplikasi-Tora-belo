<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persyaratan extends Model
{
    use HasFactory;

    protected $table = 'persyaratan';
    protected $primaryKey = 'id_persyaratan';
    public $timestamps = false;
    protected $fillable = ['id_layanan', 'nama_persyaratan', 'keterangan', 'wajib'];

    protected function casts(): array
    {
        return [
            'wajib' => 'boolean',
        ];
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }
}
