<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admin';
    protected $primaryKey = 'id_admin';
    protected $fillable = ['id_user'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function informasi()
    {
        return $this->hasMany(Informasi::class, 'id_admin', 'id_admin');
    }

    public function laporan()
    {
        return $this->hasMany(Laporan::class, 'id_admin', 'id_admin');
    }
}
