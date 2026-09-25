import { Calendar, ArrowRight, Info } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface InformasiData {
    id_informasi: number;
    judul: string;
    kategori: string;
    isi: string;
    gambar: string | null;
    tanggal: string;
    slug?: string;
}

export function InformationSection({ data = [] }: { data?: InformasiData[] }) {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    return (
        <section id="informasi" className="py-20 sm:py-28 bg-white border-t border-neutral-100 relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 bg-red-50 rounded-full border border-red-100/50">
                        <span className="text-[12px] font-bold text-red-600 uppercase tracking-widest">
                            UPDATE
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-neutral-800">
                        Informasi dan Pengumuman Terbaru
                    </h2>
                    <p className="mt-3 text-sm md:text-[15px] text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                        Dapatkan berita, pembaruan layanan, dan informasi resmi terkini dari KPU Kota Palu.
                    </p>
                </div>

                {/* Content Grid */}
                {data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.map((item) => (
                            <div key={item.id_informasi} className="group flex flex-col bg-white rounded-[24px] border border-neutral-200/60 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 transform hover:-translate-y-1">
                                
                                {/* Image Container */}
                                <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                                    {item.gambar ? (
                                        <img 
                                            src={`/storage/${item.gambar}`} 
                                            alt={item.judul}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50">
                                            <Info className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-xs font-medium uppercase tracking-wider">TORA BELO KPU KOTA PALU</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                    
                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider bg-red-600/90 backdrop-blur-sm rounded-full">
                                            {item.kategori}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 sm:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-[13px] text-neutral-500 font-medium mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={item.tanggal}>
                                            {formatDate(item.tanggal)}
                                        </time>
                                    </div>
                                    
                                    <h3 className="text-lg sm:text-[20px] font-bold text-neutral-900 leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {item.judul}
                                    </h3>
                                    
                                    {/* Strip HTML tags for preview */}
                                    <p className="text-[14px] text-neutral-500 leading-relaxed line-clamp-3 mb-6"
                                       dangerouslySetInnerHTML={{ __html: item.isi.replace(/<[^>]+>/g, '').substring(0, 150) + '...' }}
                                    ></p>

                                    {/* Read More Link */}
                                    <div className="mt-auto pt-4 border-t border-neutral-100">
                                        <Link href={`/informasi/${item.slug || item.id_informasi}`} className="inline-flex items-center gap-2 text-[14px] font-bold text-red-600 group/link cursor-pointer">
                                            Lihat Selengkapnya 
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-[32px] p-12 text-center flex flex-col items-center justify-center max-w-3xl mx-auto">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <Info className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-800 mb-2">Belum ada informasi terbaru</h3>
                        <p className="text-neutral-500">
                            Saat ini belum ada pengumuman atau informasi terbaru yang diterbitkan oleh KPU Kota Palu.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
