with open("app/Http/Controllers/PengaduanPelayananController.php", "r", encoding="utf-8") as f:
    content = f.read()

# Update validation
old_val = """$validated = $request->validate([
            'id_layanan' => 'required|exists:layanans,id_layanan',
            'nama_pelapor' => 'required|string|max:255',
            'nik_pelapor' => 'required|string|size:16',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat_pelapor' => 'required|string',
            'jenis_laporan' => 'required|string',
            'ringkasan_aduan' => 'required|string',
            'bukti_pendukung' => 'nullable|file|max:5120',
        ]);"""
new_val = """$validated = $request->validate([
            'id_layanan' => 'required|exists:layanans,id_layanan',
            'nama_pelapor' => 'required|string|max:255',
            'nik_pelapor' => 'required|string|size:16',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat_pelapor' => 'required|string',
            'jenis_pengaduan' => 'required|string',
            'judul_pengaduan' => 'required|string|max:255',
            'uraian_pengaduan' => 'required|string',
            'waktu_kejadian' => 'nullable|string|max:255',
            'lokasi_kejadian' => 'nullable|string|max:255',
            'harapan' => 'nullable|string',
            'bukti_pendukung' => 'nullable|file|max:102400',
            'pernyataan' => 'accepted'
        ]);"""
content = content.replace(old_val, new_val)

old_isi = """$isiPermohonan = [
                'jenis_laporan' => $validated['jenis_laporan'],
                'ringkasan_aduan' => $validated['ringkasan_aduan'],
            ];"""
new_isi = """$isiPermohonan = [
                'jenis_pengaduan' => $validated['jenis_pengaduan'],
                'judul_pengaduan' => $validated['judul_pengaduan'],
                'uraian_pengaduan' => $validated['uraian_pengaduan'],
                'waktu_kejadian' => $validated['waktu_kejadian'] ?? null,
                'lokasi_kejadian' => $validated['lokasi_kejadian'] ?? null,
                'harapan' => $validated['harapan'] ?? null,
            ];"""
content = content.replace(old_isi, new_isi)

old_resp = """'jenis_laporan' => $validated['jenis_laporan']"""
new_resp = """'jenis_pengaduan' => $validated['jenis_pengaduan']"""
content = content.replace(old_resp, new_resp)

with open("app/Http/Controllers/PengaduanPelayananController.php", "w", encoding="utf-8") as f:
    f.write(content)
print("done")
