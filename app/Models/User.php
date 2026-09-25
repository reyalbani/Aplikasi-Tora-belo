<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property int|null $id_role
 * @property string $name
 * @property string|null $email
 * @property string|null $password
 * @property string|null $no_hp
 * @property string|null $status
 * @property Carbon|null $email_verified_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['id_role', 'name', 'email', 'password', 'no_hp', 'status'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }

    public function masyarakat()
    {
        return $this->hasOne(Masyarakat::class, 'id_user', 'id');
    }

    public function petugas()
    {
        return $this->hasOne(Petugas::class, 'id_user', 'id');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_user', 'id');
    }

    public function pimpinan()
    {
        return $this->hasOne(Pimpinan::class, 'id_user', 'id');
    }

    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'id_user', 'id');
    }

    public function auditLog()
    {
        return $this->hasMany(AuditLog::class, 'id_user', 'id');
    }

    public function hasPermission($permissionName)
    {
        if (!$this->role) return false;
        
        // Cache permissions or check directly
        return $this->role->permissions()->where('name', $permissionName)->exists();
    }
}
