import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add aboutTitle
content = content.replace("interface ServiceInfoLayoutProps {", "interface ServiceInfoLayoutProps {\n    aboutTitle?: string;")
content = content.replace("aboutContent,", "aboutContent,\n    aboutTitle = 'Tentang Layanan',")
content = content.replace("<h3 className=\"font-bold text-neutral-800\">Tentang Layanan</h3>", "<h3 className=\"font-bold text-neutral-800\">{aboutTitle}</h3>")

# Add IDs to sections
content = content.replace("<!-- A. Mini Information Cards -->", "") # just in case
content = content.replace("{/* A. Mini Information Cards */}", "")
content = content.replace("<div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">", "<div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">")

content = content.replace("{/* B. Persyaratan Layanan */}", "")
content = content.replace("className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60\"", "id={`sec-${requirementsTitle.replace(/\\s+/g, '-').toLowerCase()}`} className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24\"")

content = content.replace("{/* C. Prosedur Layanan */}", "")
content = content.replace("className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden\"", "id=\"sec-prosedur\" className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden scroll-mt-24\"")

content = content.replace("{/* D. Alur Layanan Flowchart (Optional) */}", "")
content = content.replace("flowchartContent && (\n                <div className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60\">", "flowchartContent && (\n                <div id=\"sec-alur-layanan\" className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24\">")

content = content.replace("{/* E. Waktu & Biaya, F. Produk Layanan */}", "")
content = content.replace("className={`bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 ${!timeContent ? 'md:col-span-2' : ''}`}", "id=\"sec-produk-layanan\" className={`bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24 ${!timeContent ? 'md:col-span-2' : ''}`}")
content = content.replace("timeContent && (\n                    <div className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60\">", "timeContent && (\n                    <div id=\"sec-waktu-&-biaya\" className=\"bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24\">")

content = content.replace("{/* G. Saluran Pengaduan */}", "")
content = content.replace("className=\"bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none\"", "id=\"sec-pengaduan\" className=\"bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none scroll-mt-24\"")
content = content.replace("id=\"sec-ringkasan\" className=\"scroll-mt-24\">\n            {aboutContent && (\n                <div id=\"sec-pengaduan\"", "id=\"sec-ringkasan\" className=\"scroll-mt-24\">\n            {aboutContent && (\n                <div")

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
