<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkmJawaban extends Model
{
    use HasFactory;

    protected $table = 'skm_jawaban';

    protected $fillable = [
        'responden_id',
        'pertanyaan_id',
        'jawaban',
        'nilai'
    ];

    public function responden()
    {
        return $this->belongsTo(SkmResponden::class, 'responden_id', 'id');
    }

    public function pertanyaan()
    {
        return $this->belongsTo(SkmPertanyaan::class, 'pertanyaan_id', 'id');
    }
}
