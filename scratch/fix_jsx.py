import re

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("title={\ - SIPADU}", "title={\\ - SIPADU\}").replace("title={ - SIPADU}", "title={\\ - SIPADU\}")

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
