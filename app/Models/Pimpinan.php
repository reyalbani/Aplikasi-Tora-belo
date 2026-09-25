<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pimpinan extends Model
{
    use HasFactory;

    protected $table = 'pimpinan';
    protected $primaryKey = 'id_pimpinan';
    protected $fillable = ['id_user', 'jabatan'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
