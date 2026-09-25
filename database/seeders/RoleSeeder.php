<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nama_role' => 'Admin'],
            ['nama_role' => 'Petugas'],
            ['nama_role' => 'Pimpinan'],
            ['nama_role' => 'Masyarakat'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['nama_role' => $role['nama_role']],
                $role
            );
        }
    }
}
