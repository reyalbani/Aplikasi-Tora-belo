import re

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix flash undefined error
content = content.replace("if (flash.success && flash.success.includes('Nomor Tiket')) {", "if (flash?.success?.includes('Nomor Tiket')) {")

# Change background to white
content = content.replace("bg-neutral-50 flex flex-col font-sans", "bg-white flex flex-col font-sans")

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
