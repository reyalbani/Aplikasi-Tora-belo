import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FileText, Users, MessageSquare, Handshake, UserCheck, BarChart, ArrowRight, Smile, Book, Mail, MessageCircle, Headset, Search } from 'lucide-react';
import { SearchServices } from './search-services';

interface Service {
    id_layanan: number;
    nama_layanan: string;
    deskripsi: string;
    icon: string;
    kategori?: string;
    keyword?: string;
}

interface ServicesSectionProps {
    services?: Service[];
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'fa-info-circle': return FileText; // PPID
        case 'fa-graduation-cap': return Users; // Pendidikan Pemilih
        case 'fa-bullhorn': return MessageSquare; // Pengaduan Masyarakat
        case 'fa-handshake': return Handshake; // Kerjasama
        case 'fa-users-cog': return UserCheck; // Pemutakhiran Data Pemilih
        case 'fa-flag': return BarChart; // Pemutakhiran Data Partai Politik
        case 'fa-smile': return Smile; // SKM
        case 'fa-book': return Book; // Buku Tamu
        case 'fa-envelope': return Mail; // Pengantaran Surat
        case 'fa-comments': return MessageCircle; // Konsultasi
        case 'fa-headset': return Headset; // Layanan Pengaduan Pelayanan
        default: return FileText;
    }
};

export function ServicesSection({ services = [] }: ServicesSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredServices = services.filter((service) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        
        // Cek nama dan deskripsi, serta properti dinamis lain jika ada dari backend
        const searchString = `${service.nama_layanan} ${service.deskripsi} ${service.kategori || ''} ${service.keyword || ''}`.toLowerCase();
        
        return searchString.includes(query);
    });

    return (
        <section id="layanan" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-neutral-800">Layanan Publik</h2>
                <p className="mt-3 text-sm md:text-[15px] text-neutral-500">Pilih layanan resmi KPU Kota Palu yang Anda butuhkan.</p>
            </div>
            
            <SearchServices value={searchQuery} onChange={setSearchQuery} />
            
            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-2 min-[380px]:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 xl:gap-4">
                    {filteredServices.map((service) => {
                        const IconComponent = getIcon(service.icon);
                        return (
                            <Link 
                                key={service.id_layanan} 
                                href={`/layanan/${service.id_layanan}`}
                                className="group flex flex-col md:flex-row items-center md:items-center gap-2.5 md:gap-4 xl:gap-5 p-3 md:p-4 rounded-[20px] bg-transparent hover:bg-neutral-50/80 active:bg-neutral-100/90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-kpu-primary/30 touch-manipulation transition-all duration-200 ease-out text-center md:text-left"
                            >
                                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-100/60 text-neutral-500 flex items-center justify-center group-hover:bg-kpu-primary/10 group-hover:text-kpu-primary group-active:bg-kpu-primary/15 transition-colors duration-300">
                                    <IconComponent className="h-6 w-6 md:h-6 md:w-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                                </div>
                                
                                <div className="flex-1 min-w-0 w-full">
                                    <h3 className="text-[12px] md:text-[15px] xl:text-base font-bold text-neutral-800 mb-0.5 md:mb-1 group-hover:text-kpu-primary transition-colors leading-tight line-clamp-2">
                                        {service.nama_layanan}
                                    </h3>
                                    <p className="text-[10px] md:text-[13px] text-neutral-500 line-clamp-2 leading-snug md:leading-relaxed">
                                        {service.deskripsi}
                                    </p>
                                </div>

                                <div className="hidden md:block shrink-0 text-neutral-300 group-hover:text-kpu-primary group-hover:translate-x-1.5 transition-all duration-300">
                                    <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-14 px-4 bg-white rounded-[24px] border border-neutral-200/60 max-w-2xl mx-auto shadow-sm transition-all duration-300">
                    <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-neutral-100">
                        <Search className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-[17px] font-bold text-neutral-800 mb-2 tracking-tight">Tidak ada layanan yang ditemukan</h3>
                    <p className="text-[14px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        Coba gunakan kata kunci lain.
                    </p>
                </div>
            )}
        </section>
    );
}
