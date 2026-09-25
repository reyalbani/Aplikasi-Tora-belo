<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    protected $table = 'laporan';
    protected $primaryKey = 'id_laporan';
    public $timestamps = false;
    protected $fillable = ['id_admin', 'jenis', 'periode', 'tanggal', 'file'];

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
