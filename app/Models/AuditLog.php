<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_log';
    protected $primaryKey = 'id_log';
    
    // We disable default timestamps because the existing table uses 'waktu' instead of created_at/updated_at
    public $timestamps = false;
    
    protected $fillable = [
        'id_user', 
        'aktivitas', 
        'waktu', 
        'ip_address',
        'role',
        'action',
        'module',
        'description',
        'subject_type',
        'subject_id',
        'properties',
        'user_agent'
    ];

    protected function casts(): array
    {
        return [
            'waktu' => 'datetime',
            'properties' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
