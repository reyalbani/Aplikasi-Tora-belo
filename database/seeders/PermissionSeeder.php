<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'dashboard.view' => 'Dashboard',
            'users.view' => 'Manajemen Pengguna',
            'users.create' => 'Manajemen Pengguna',
            'users.update' => 'Manajemen Pengguna',
            'users.delete' => 'Manajemen Pengguna',
            'users.manage' => 'Manajemen Pengguna',
            'services.view' => 'Manajemen Layanan',
            'services.manage' => 'Manajemen Layanan',
            'information.view' => 'Manajemen Informasi',
            'information.manage' => 'Manajemen Informasi',
            'guestbook.view' => 'Buku Tamu',
            'guestbook.manage' => 'Buku Tamu',
            'survey.view' => 'Survey SKM',
            'survey.manage' => 'Survey SKM',
            'monitoring.view' => 'Monitoring',
            'reports.view' => 'Laporan',
            'logs.view' => 'Log Sistem',
            'settings.view' => 'Pengaturan',
            'settings.manage' => 'Pengaturan',
        ];

        foreach ($permissions as $name => $group) {
            \App\Models\Permission::firstOrCreate(['name' => $name], ['group' => $group]);
        }

        // Attach permissions to roles
        $admin = \App\Models\Role::where('nama_role', 'Admin')->first();
        if ($admin) {
            $admin->permissions()->sync(\App\Models\Permission::pluck('id_permission'));
        }

        $petugas = \App\Models\Role::where('nama_role', 'Petugas')->first();
        if ($petugas) {
            $petugasPerms = \App\Models\Permission::whereIn('name', [
                'dashboard.view', 'services.view', 'settings.view'
            ])->pluck('id_permission');
            $petugas->permissions()->sync($petugasPerms);
        }

        $pimpinan = \App\Models\Role::where('nama_role', 'Pimpinan')->first();
        if ($pimpinan) {
            $pimpinanPerms = \App\Models\Permission::whereIn('name', [
                'dashboard.view', 'monitoring.view', 'reports.view', 'settings.view'
            ])->pluck('id_permission');
            $pimpinan->permissions()->sync($pimpinanPerms);
        }
    }
}
