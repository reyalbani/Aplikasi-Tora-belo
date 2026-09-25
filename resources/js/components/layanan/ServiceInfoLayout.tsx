import { ReactNode, useState, useEffect } from 'react';
import { 
    Users, Clock, CheckCircle2, FileText, Activity, AlertCircle, PhoneCall, Mail, MapPin, ExternalLink, Info, BookOpen
} from 'lucide-react';

export interface MiniCardProps {
    title: string;
    content: ReactNode;
    icon: ReactNode;
    colorClass: 'blue' | 'amber' | 'green' | 'purple' | 'red' | 'indigo';
}

export interface ProcedureStepProps {
    title: string;
    desc: ReactNode;
}

export interface ComplaintChannel {
    type: 'sipadu' | 'email' | 'phone' | 'lapor' | 'whatsapp' | 'location' | 'custom';
    label: string;
    value?: string;
    link?: string;
}

interface ServiceInfoLayoutProps {
    requirementsTitle?: string;
    requirementsSubtitle?: string;
    miniCards: MiniCardProps[];
    requirementsContent: ReactNode;
    procedures: ProcedureStepProps[];
    timeContent?: ReactNode;
    productsContent: ReactNode;
    complaintText?: ReactNode;
    complaintChannels?: ComplaintChannel[];
    complaintContent?: ReactNode;
    aboutTitle?: string;
    aboutContent?: ReactNode;
    flowchartContent?: ReactNode;
    legalContent?: ReactNode;
    ctaContent?: ReactNode;
    showTabs?: boolean;
}

export function ServiceInfoLayout({
    requirementsTitle = 'Persyaratan Layanan',
    requirementsSubtitle,
    miniCards,
    requirementsContent,
    procedures,
    timeContent,
    productsContent,
    complaintText = "Apabila Anda menemui kendala, pelayanan tidak sesuai standar, atau dugaan pelanggaran, Anda dapat menyampaikan pengaduan resmi melalui:",
    complaintChannels = [],
    complaintContent,
    aboutTitle = 'Tentang Layanan',
    aboutContent,
    flowchartContent,
    legalContent,
    ctaContent,
    showTabs = false
}: ServiceInfoLayoutProps) {
    
    const channels = complaintChannels.length > 0 ? complaintChannels : [
        { type: 'sipadu', label: 'Modul Pengaduan di portal TORA BELO' },
        { type: 'email', label: 'Email: palukota.kpu@gmail.com', link: 'mailto:palukota.kpu@gmail.com' },
        { type: 'phone', label: 'Telp: (0451) 457271', link: 'tel:0451457271' }
    ] as ComplaintChannel[];

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

    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
        <div className="space-y-6 sm:space-y-8 mt-2 animate-fade-in">
            {showTabs && (
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide border-b border-neutral-200">
                    {tabsList.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => scrollToSection(tab)}
                            className={`whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none border-b-2 ${
                                activeTab === tab 
                                    ? 'text-kpu-primary border-kpu-primary' 
                                    : 'text-neutral-500 border-transparent hover:text-kpu-primary hover:border-kpu-primary/50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}
            
            <div id="sec-ringkasan" className="scroll-mt-24 space-y-6 sm:space-y-8">
                {aboutContent && (
                    <div className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none">
                        <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <Info className="w-5 h-5 text-kpu-primary" />
                            <h3 className="font-bold text-neutral-800">{aboutTitle}</h3>
                        </div>
                        <div className="p-6">
                            {aboutContent}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {miniCards.map((card, idx) => (
                        <div key={idx} className="bg-card border border-neutral-200/60 rounded-[20px] p-5 shadow-sm dark:shadow-none flex items-start gap-4">
                            <div className={`p-2.5 rounded-xl shrink-0 ${colorMap[card.colorClass]}`}>
                                {card.icon}
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-1">{card.title}</h4>
                                <div className="text-sm font-semibold text-neutral-900 leading-snug">
                                    {card.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div id={`sec-${requirementsTitle.replace(/\s+/g, '-').toLowerCase()}`} className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24">
                <div className="flex items-start gap-3 mb-6">
                    <FileText className="w-6 h-6 text-kpu-primary mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">{requirementsTitle}</h3>
                        {requirementsSubtitle && (
                            <p className="text-[13px] text-neutral-500 mt-1">{requirementsSubtitle}</p>
                        )}
                    </div>
                </div>
                {requirementsContent}
            </div>

            <div id="sec-prosedur" className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden scroll-mt-24">
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-6 h-6 text-kpu-primary" />
                    <h3 className="text-lg font-bold text-neutral-900">Prosedur Layanan</h3>
                </div>
                
                <div className="relative">
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-neutral-200 hidden sm:block"></div>
                    <div className="space-y-6">
                        {procedures.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group">
                                <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-white border-4 border-neutral-50 shadow-sm z-10 group-hover:border-red-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-kpu-primary font-bold">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-[15px] font-bold text-neutral-800 mb-1">{step.title}</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {flowchartContent && (
                <div id="sec-alur-layanan" className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">Alur Layanan</h3>
                    </div>
                    <div className="overflow-x-auto pb-4">
                        {flowchartContent}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div id="sec-waktu-&-biaya" className={`bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24 ${!timeContent ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">Waktu & Biaya</h3>
                    </div>
                    {timeContent ? (
                        timeContent
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-40 bg-neutral-50/50 rounded-2xl border border-neutral-100">
                            <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                            <div className="text-2xl font-black text-green-600 mb-1">Rp 0,-</div>
                            <div className="text-sm font-bold text-green-700 uppercase tracking-wider">(GRATIS)</div>
                        </div>
                    )}
                </div>

                <div id="sec-produk-layanan" className={`bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 scroll-mt-24 ${!timeContent ? 'md:col-span-3' : 'md:col-span-2'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">Produk Layanan</h3>
                    </div>
                    {productsContent}
                </div>
            </div>

            <div id="sec-pengaduan" className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none scroll-mt-24">
                <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-kpu-primary" />
                    <h3 className="font-bold text-neutral-800">Saluran Pengaduan</h3>
                </div>
                <div className="p-6">
                    {complaintContent ? (
                        complaintContent
                    ) : (
                        <>
                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed mb-6">
                                {complaintText}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {channels.map((ch, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50/30">
                                        {ch.type === 'email' && <Mail className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'phone' && <PhoneCall className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'location' && <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'sipadu' && <ExternalLink className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'custom' && <ExternalLink className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        
                                        <div className="flex-1">
                                            {ch.link ? (
                                                <a href={ch.link} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-kpu-primary hover:underline">
                                                    {ch.label}
                                                </a>
                                            ) : (
                                                <span className="text-[13px] font-semibold text-neutral-700">{ch.label}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {legalContent && (
                <div id="sec-dasar-hukum" className="bg-card border border-neutral-200/60 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none scroll-mt-24">
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
}
