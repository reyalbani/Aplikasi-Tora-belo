<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkmPertanyaan extends Model
{
    use HasFactory;

    protected $table = 'skm_pertanyaan';
    
    protected $fillable = [
        'pertanyaan',
        'tipe',
        'urutan',
        'status'
    ];

    public function jawaban()
    {
        return $this->hasMany(SkmJawaban::class, 'pertanyaan_id', 'id');
    }
}
