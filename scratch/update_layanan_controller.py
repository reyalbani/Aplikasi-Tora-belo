import re

with open('app/Http/Controllers/LayananController.php', 'r', encoding='utf-8') as f:
    content = f.read()

if "Layanan Pemutakhiran Data Pemilih" not in content:
    insert_str = '''
        if (->nama_layanan === 'Layanan Pemutakhiran Data Pemilih') {
             = null;
            if (session('buku_tamu_id')) {
                 = \App\Models\BukuTamu::find(session('buku_tamu_id'));
            }

            return Inertia::render('layanan/pemutakhiran-data-pemilih', [
                'layanan' => ,
                'bukuTamu' =>  ? [
                    'nama' => ->nama,
                    'email' => ->email,
                    'no_hp' => ->nomor_whatsapp,
                    'instansi' => ->instansi,
                ] : null,
            ]);
        }
'''
    content = content.replace("        // For other services", insert_str + "\n        // For other services")
    with open('app/Http/Controllers/LayananController.php', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Updated LayananController")
else:
    print("Already updated")
