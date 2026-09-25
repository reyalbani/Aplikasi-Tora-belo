import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("interface ServiceInfoLayoutProps {", "interface ServiceInfoLayoutProps {\n    requirementsTitle?: string;")
content = content.replace("export function ServiceInfoLayout({", "export function ServiceInfoLayout({\n    requirementsTitle = 'Persyaratan Layanan',")
content = content.replace("<h3 className=\"text-lg font-bold text-neutral-900\">Persyaratan Layanan</h3>", "<h3 className=\"text-lg font-bold text-neutral-900\">{requirementsTitle}</h3>")

# Let's also update the tabs map to use requirementsTitle
content = content.replace("['Ringkasan', 'Persyaratan', 'Prosedur', flowchartContent ? 'Alur Layanan' : null, 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', legalContent ? 'Dasar Hukum' : null]", "['Ringkasan', requirementsTitle === 'Persyaratan Layanan' ? 'Persyaratan' : requirementsTitle, 'Prosedur', flowchartContent ? 'Alur Layanan' : null, 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', legalContent ? 'Dasar Hukum' : null]")

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
