import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('''interface ServiceInfoLayoutProps {
    miniCards: MiniCardProps[];
    requirementsContent: ReactNode;
    procedures: ProcedureStepProps[];
    timeContent?: ReactNode;
    productsContent: ReactNode;
    complaintText?: ReactNode;
    complaintChannels?: ComplaintChannel[];
}''', '''interface ServiceInfoLayoutProps {
    miniCards: MiniCardProps[];
    requirementsContent: ReactNode;
    procedures: ProcedureStepProps[];
    timeContent?: ReactNode;
    productsContent: ReactNode;
    complaintText?: ReactNode;
    complaintChannels?: ComplaintChannel[];
    aboutContent?: ReactNode;
    flowchartContent?: ReactNode;
    legalContent?: ReactNode;
    ctaContent?: ReactNode;
    showTabs?: boolean;
}''')

content = content.replace('''export function ServiceInfoLayout({
    miniCards,
    requirementsContent,
    procedures,
    timeContent,
    productsContent,
    complaintText = "Apabila Anda menemui kendala, pelayanan tidak sesuai standar, atau dugaan pelanggaran, Anda dapat menyampaikan pengaduan resmi melalui:",
    complaintChannels = []
}: ServiceInfoLayoutProps) {''', '''export function ServiceInfoLayout({
    miniCards,
    requirementsContent,
    procedures,
    timeContent,
    productsContent,
    complaintText = "Apabila Anda menemui kendala, pelayanan tidak sesuai standar, atau dugaan pelanggaran, Anda dapat menyampaikan pengaduan resmi melalui:",
    complaintChannels = [],
    aboutContent,
    flowchartContent,
    legalContent,
    ctaContent,
    showTabs = false
}: ServiceInfoLayoutProps) {''')

# Insert Tabs and About Content
old_cards = '''            {/* A. Mini Information Cards */}'''
new_cards = '''            {showTabs && (
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide border-b border-neutral-200">
                    {['Ringkasan', 'Persyaratan', 'Prosedur', 'Alur Layanan', 'Waktu & Biaya', 'Produk Layanan', 'Pengaduan', 'Dasar Hukum'].map(tab => (
                        <button key={tab} className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-neutral-500 hover:text-kpu-primary border-b-2 border-transparent hover:border-kpu-primary transition-colors focus:outline-none">
                            {tab}
                        </button>
                    ))}
                </div>
            )}
            
            {aboutContent && (
                <div className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none">
                    <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                        <Info className="w-5 h-5 text-kpu-primary" />
                        <h3 className="font-bold text-neutral-800">Tentang Layanan</h3>
                    </div>
                    <div className="p-6">
                        {aboutContent}
                    </div>
                </div>
            )}

            {/* A. Mini Information Cards */}'''

content = content.replace(old_cards, new_cards)

# Insert Flowchart
old_flowchart = '''            {/* D. Waktu Penyelesaian & Produk Layanan */}'''
new_flowchart = '''            {flowchartContent && (
                <div className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none">
                    <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                        <Activity className="w-5 h-5 text-kpu-primary" />
                        <h3 className="font-bold text-neutral-800">Alur Layanan</h3>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        {flowchartContent}
                    </div>
                </div>
            )}

            {/* D. Waktu Penyelesaian & Produk Layanan */}'''

content = content.replace(old_flowchart, new_flowchart)

# Insert Legal and CTA
old_end = '''        </div>
    );
}'''
new_end = '''            {legalContent && (
                <div className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none">
                    <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-kpu-primary" />
                        <h3 className="font-bold text-neutral-800">Dasar Hukum</h3>
                    </div>
                    <div className="p-6">
                        {legalContent}
                    </div>
                </div>
            )}

            {ctaContent && (
                <div className="mt-8">
                    {ctaContent}
                </div>
            )}
        </div>
    );
}'''

content = content.replace(old_end, new_end)

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ServiceInfoLayout.tsx")
