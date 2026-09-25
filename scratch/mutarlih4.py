import re

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("PendidikanPemilih", "PemutakhiranDataPemilih")
content = content.replace("pendidikan_pemilih", "pemutakhiran_data_pemilih")
content = content.replace("pendidikan-pemilih.store", "mutarlih.store")

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
