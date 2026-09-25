<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';
    protected $primaryKey = 'id_notifikasi';
    public $timestamps = false;
    protected $fillable = ['id_user', 'judul', 'pesan', 'tanggal', 'dibaca'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'datetime',
            'dibaca' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
