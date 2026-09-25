<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions';
    protected $primaryKey = 'id_permission';
    protected $fillable = ['name', 'group'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'permission_role', 'id_permission', 'id_role');
    }
}
