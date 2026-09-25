import os
import shutil

shutil.copyfile('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'resources/js/pages/layanan/muparpol.tsx')

with open('resources/js/pages/layanan/muparpol.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("PemutakhiranDataPemilih", "Muparpol")
content = content.replace("pemutakhiran_data_pemilih", "muparpol")
content = content.replace("mutarlih.store", "muparpol.store")
content = content.replace("Layanan Pemutakhiran Data Pemilih Berkelanjutan resmi KPU Kota Palu.", "Layanan penyampaian laporan pemutakhiran data dan dokumen Partai Politik secara berkelanjutan melalui mekanisme yang ditetapkan KPU.")

with open('resources/js/pages/layanan/muparpol.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
