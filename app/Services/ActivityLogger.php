<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log($action, $module, $description, $subjectType = null, $subjectId = null, $properties = null)
    {
        $user = Auth::user();
        
        $roleName = null;
        if ($user) {
            $roleName = $user->role->nama_role ?? ($user->role_name ?? 'User');
        }

        // Sanitize properties if any password related fields are present
        if ($properties && is_array($properties)) {
            $sensitiveFields = ['password', 'password_confirmation', 'token', 'secret', 'remember_token'];
            array_walk_recursive($properties, function (&$value, $key) use ($sensitiveFields) {
                if (in_array(strtolower($key), $sensitiveFields)) {
                    $value = '********';
                }
            });
        }

        return AuditLog::create([
            'id_user' => $user ? $user->id : null,
            'role' => $roleName,
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'aktivitas' => $action . ' - ' . $description, // For backward compatibility with existing field
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'properties' => $properties,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'waktu' => now(),
        ]);
    }
}
