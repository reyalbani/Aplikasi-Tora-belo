import re

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("<a href={/cek-status?tiket=}>Cek Status Pengaduan</a>", "<a href={`/cek-status?tiket=${ticketNumber}`}>Cek Status Pengaduan</a>")

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
