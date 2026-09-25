import re

with open('app/Http/Controllers/LayananController.php', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("if (->nama_layanan", "if (->nama_layanan")
content = content.replace(" = null;\n            if (session('buku_tamu_id')) {\n                 = \App\Models\BukuTamu::find(session('buku_tamu_id'));", 
    " = null;\n            if (session('buku_tamu_id')) {\n                 = \App\Models\BukuTamu::find(session('buku_tamu_id'));")
content = content.replace("'bukuTamu' =>  ? [", "'bukuTamu' =>  ? [")
content = content.replace("'nama' => ->nama", "'nama' => ->nama")
content = content.replace("'email' => ->email", "'email' => ->email")
content = content.replace("'no_hp' => ->nomor_whatsapp", "'no_hp' => ->nomor_whatsapp")
content = content.replace("'instansi' => ->instansi", "'instansi' => ->instansi")

with open('app/Http/Controllers/LayananController.php', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed LayananController.php")
