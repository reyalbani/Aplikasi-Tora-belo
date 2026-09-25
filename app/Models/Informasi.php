<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Informasi extends Model
{
    use HasFactory;

    protected $table = 'informasi';
    protected $primaryKey = 'id_informasi';
    protected $fillable = ['id_admin', 'judul', 'slug', 'kategori', 'ringkasan', 'isi', 'gambar', 'tanggal', 'status'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'datetime',
        ];
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }
}
