import re

with open('app/Http/Controllers/LayananController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace show method
show_pattern = r'public function show\(\$id\)\s*\{\s*\$layanan = Layanan::findOrFail\(\$id\);\s*return Inertia::render\(\'layanan/buku-tamu\', \[\s*\'layanan\' => \$layanan\s*\]\);\s*\}'
show_replacement = r'''public function show($id)
    {
        $layanan = Layanan::findOrFail($id);

        if ($layanan->nama_layanan === 'Layanan Pengaduan Pelayanan') {
            return Inertia::render('layanan/pengaduan-pelayanan', [
                'layanan' => $layanan
            ]);
        }

        return Inertia::render('layanan/buku-tamu', [
            'layanan' => $layanan
        ]);
    }'''

content = re.sub(show_pattern, show_replacement, content)

# Replace form method
form_pattern = r'public function form\(\$id\)\s*\{\s*if \(session\(\'buku_tamu_layanan_id\'\) != \$id\) \{\s*return redirect\(\)->route\(\'layanan.show\', \[\'id\' => \$id\]\);\s*\}'
form_replacement = r'''public function form($id)
    {
        $layanan = Layanan::findOrFail($id);
        
        if ($layanan->nama_layanan === 'Layanan Pengaduan Pelayanan') {
            return Inertia::render('layanan/pengaduan-pelayanan', [
                'layanan' => $layanan
            ]);
        }

        if (session('buku_tamu_layanan_id') != $id) {
            return redirect()->route('layanan.show', ['id' => $id]);
        }'''

content = re.sub(form_pattern, form_replacement, content)

with open('app/Http/Controllers/LayananController.php', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
