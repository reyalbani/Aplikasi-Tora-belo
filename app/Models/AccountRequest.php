<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_code',
        'nama_lengkap',
        'nik',
        'nip',
        'email',
        'nomor_whatsapp',
        'jabatan',
        'unit_bagian',
        'requested_role',
        'alasan',
        'status',
        'rejection_reason',
        'reviewed_by',
        'user_id',
        'activation_token',
        'activation_expires_at',
        'reviewed_at',
        'approved_at',
    ];

    protected $casts = [
        'activation_expires_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
