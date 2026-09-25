<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Masyarakat;
use App\Models\Petugas;
use App\Models\Pimpinan;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('nama_role', 'Admin')->first();
        $petugasRole = Role::where('nama_role', 'Petugas')->first();
        $pimpinanRole = Role::where('nama_role', 'Pimpinan')->first();
        $masyarakatRole = Role::where('nama_role', 'Masyarakat')->first();

        // 1. Admin
        $userAdmin = User::updateOrCreate(
            ['email' => 'admin@sipadu.com'],
            [
                'id_role' => $adminRole->id_role,
                'name' => 'Administrator SIPADU',
                'password' => Hash::make('password123'),
                'no_hp' => '081111111111',
                'status' => 'Aktif',
                'email_verified_at' => now(),
            ]
        );
        Admin::firstOrCreate(['id_user' => $userAdmin->id]);

        // 2. Petugas
        $userPetugas = User::updateOrCreate(
            ['email' => 'petugas@sipadu.com'],
            [
                'id_role' => $petugasRole->id_role,
                'name' => 'Petugas Pelayanan',
                'password' => Hash::make('password123'),
                'no_hp' => '082222222222',
                'status' => 'Aktif',
                'email_verified_at' => now(),
            ]
        );
        Petugas::updateOrCreate(
            ['id_user' => $userPetugas->id],
            ['nip' => '198001012010011001', 'jabatan' => 'Staf Pelayanan']
        );

        // 3. Pimpinan
        $userPimpinan = User::updateOrCreate(
            ['email' => 'pimpinan@sipadu.com'],
            [
                'id_role' => $pimpinanRole->id_role,
                'name' => 'Ketua Pimpinan',
                'password' => Hash::make('password123'),
                'no_hp' => '083333333333',
                'status' => 'Aktif',
                'email_verified_at' => now(),
            ]
        );
        Pimpinan::updateOrCreate(
            ['id_user' => $userPimpinan->id],
            ['jabatan' => 'Kepala Instansi']
        );

        // 4. Masyarakat
        $userMasyarakat = User::updateOrCreate(
            ['email' => 'masyarakat@sipadu.com'],
            [
                'id_role' => $masyarakatRole->id_role,
                'name' => 'Budi Santoso',
                'password' => Hash::make('password123'),
                'no_hp' => '084444444444',
                'status' => 'Aktif',
                'email_verified_at' => now(),
            ]
        );
        Masyarakat::updateOrCreate(
            ['id_user' => $userMasyarakat->id],
            ['nik' => '3201010101900001', 'alamat' => 'Jl. Kebon Jeruk No. 12']
        );
    }
}
