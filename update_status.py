import os

base_dir = 'E:/laragon/www/sipadu'

# Update Controllers
controllers_dir = os.path.join(base_dir, 'app', 'Http', 'Controllers', 'Petugas')
for file_name in os.listdir(controllers_dir):
    if file_name == 'PetugasDashboardController.php' or not file_name.endswith('Controller.php'):
        continue
    
    file_path = os.path.join(controllers_dir, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    old_status_create = """            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? ('Status diperbarui menjadi ' . $validated['status']),
                'waktu' => now(),
            ]);"""
            
    new_status_create = """            StatusPermohonan::create([
                'id_permohonan' => $permohonan->id_permohonan,
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? ('Status diperbarui menjadi ' . $validated['status']),
                'waktu' => now(),
                'id_petugas' => auth()->user()->petugas->id_petugas ?? null,
            ]);

            \\App\\Models\\AuditLog::create([
                'id_user' => auth()->id(),
                'aktivitas' => 'Memperbarui status permohonan ' . $permohonan->kode_tiket . ' menjadi ' . $validated['status'],
                'waktu' => now(),
                'ip_address' => request()->ip(),
                'role' => 'Petugas',
                'action' => 'update_status',
                'module' => 'Permohonan',
                'description' => $validated['keterangan'] ?? 'Status updated via Petugas area',
                'subject_type' => get_class($permohonan),
                'subject_id' => $permohonan->id_permohonan,
                'user_agent' => request()->userAgent()
            ]);"""
            
    if old_status_create in content:
        content = content.replace(old_status_create, new_status_create)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_name}')

# Update React Pages
pages_dir = os.path.join(base_dir, 'resources', 'js', 'Pages', 'Petugas')
for root, dirs, files in os.walk(pages_dir):
    for file_name in files:
        if file_name in ['Index.tsx', 'Show.tsx']:
            file_path = os.path.join(root, file_name)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if file_name == 'Index.tsx':
                old_options = """                            <option value="">Semua Status</option>
                            <option value="Pengajuan Permohonan">Pengajuan Permohonan</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditolak">Ditolak</option>"""
                new_options = """                            <option value="">Semua Status</option>
                            <option value="Diajukan">Diajukan</option>
                            <option value="Dalam Verifikasi">Dalam Verifikasi</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Menunggu Data">Menunggu Data</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditolak">Ditolak</option>
                            <option value="Dibatalkan">Dibatalkan</option>"""
                content = content.replace(old_options, new_options)
                
            elif file_name == 'Show.tsx':
                old_options = """                                    <option value="Pengajuan Permohonan">Pengajuan Permohonan</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>"""
                new_options = """                                    <option value="Diajukan">Diajukan</option>
                                    <option value="Dalam Verifikasi">Dalam Verifikasi</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Menunggu Data">Menunggu Data</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>
                                    <option value="Dibatalkan">Dibatalkan</option>"""
                content = content.replace(old_options, new_options)
                
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {file_path}')

print('Done')
