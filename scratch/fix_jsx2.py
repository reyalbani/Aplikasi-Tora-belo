import re

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("title={${layanan.nama_layanan} - SIPADU}", "title={`\\${layanan.nama_layanan} - SIPADU`}")

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
