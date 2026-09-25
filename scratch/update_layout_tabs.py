import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded tabs with conditional tabs
old_tabs = "{['Ringkasan', 'Persyaratan', 'Prosedur', 'Alur Layanan', 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', 'Dasar Hukum'].map(tab => ("
new_tabs = "{['Ringkasan', 'Persyaratan', 'Prosedur', flowchartContent ? 'Alur Layanan' : null, 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', legalContent ? 'Dasar Hukum' : null].filter(Boolean).map(tab => ("

if old_tabs in content:
    content = content.replace(old_tabs, new_tabs)
    with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated tabs in ServiceInfoLayout")
else:
    print("Old tabs not found. Maybe already updated?")
