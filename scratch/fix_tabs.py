import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make it use state for activeTab and smooth scrolling
import_replacement = """import { ReactNode, useState, useEffect } from 'react';"""
content = content.replace("import { ReactNode } from 'react';", import_replacement)

# Update the component signature
comp_pattern = r'export function ServiceInfoLayout\(\{[^}]+\}: ServiceInfoLayoutProps\) \{'
comp_match = re.search(comp_pattern, content, re.MULTILINE)
if comp_match:
    comp_str = comp_match.group(0)
    
    # We will insert state hooks right after the colorMap
    state_injection = """
    const tabsList = ['Ringkasan', requirementsTitle === 'Persyaratan Layanan' ? 'Persyaratan' : requirementsTitle, 'Prosedur', flowchartContent ? 'Alur Layanan' : null, 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', legalContent ? 'Dasar Hukum' : null].filter(Boolean) as string[];
    const [activeTab, setActiveTab] = useState(tabsList[0] || 'Ringkasan');

    const scrollToSection = (tabName: string) => {
        setActiveTab(tabName);
        const el = document.getElementById(`sec-${tabName.replace(/\s+/g, '-').toLowerCase()}`);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
"""
    content = content.replace("const colorMap = {", state_injection + "\n    const colorMap = {")

# Update tabs rendering
old_tabs = """<button key={tab} className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-neutral-500 hover:text-kpu-primary border-b-2 border-transparent hover:border-kpu-primary transition-colors focus:outline-none">
                            {tab}
                        </button>"""
new_tabs = """<button 
                            key={tab} 
                            onClick={() => scrollToSection(tab)}
                            className={`whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none border-b-2 ${
                                activeTab === tab 
                                    ? 'text-kpu-primary border-kpu-primary' 
                                    : 'text-neutral-500 border-transparent hover:text-kpu-primary hover:border-kpu-primary/50'
                            }`}
                        >
                            {tab}
                        </button>"""
content = content.replace(old_tabs, new_tabs)
content = content.replace("{['Ringkasan', requirementsTitle === 'Persyaratan Layanan' ? 'Persyaratan' : requirementsTitle, 'Prosedur', flowchartContent ? 'Alur Layanan' : null, 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', legalContent ? 'Dasar Hukum' : null].filter(Boolean).map(tab => (", "{tabsList.map(tab => (")


# Add IDs to sections
content = content.replace("{aboutContent && (", """{aboutContent && (
                <div id="sec-ringkasan" className="scroll-mt-24">""")
content = content.replace("</button>\n                    ))}\n                </div>\n            )}\n            \n            {aboutContent && (", "</button>\n                    ))}\n                </div>\n            )}\n            \n            <div id=\"sec-ringkasan\" className=\"scroll-mt-24\">\n            {aboutContent && (")

# But wait, Ringkasan could be the mini cards if aboutContent doesn't exist. Let's just wrap aboutContent and miniCards in sec-ringkasan.
# Actually, I'll just regex replace specific section headers to include IDs.

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
