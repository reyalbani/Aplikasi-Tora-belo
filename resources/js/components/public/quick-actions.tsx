import { Grid, Search, Info, ChevronRight } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            title: 'Lihat Layanan',
            desc: 'Daftar layanan publik KPU',
            icon: Grid,
            href: '#layanan'
        },
        {
            title: 'Cek Status',
            desc: 'Lacak status permohonan',
            icon: Search,
            href: '#cek-status'
        },
        {
            title: 'Informasi',
            desc: 'Berita dan info resmi',
            icon: Info,
            href: '#informasi'
        }
    ];

    return (
        <section className="container mx-auto px-4 -mt-8 sm:-mt-10 relative z-20 max-w-5xl">
            <div className="bg-white/90 backdrop-blur-xl border border-neutral-100 rounded-3xl p-2 sm:p-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row gap-2 sm:gap-3">
                {actions.map((item, idx) => (
                    <a 
                        key={idx} 
                        href={item.href}
                        className="group flex-1 flex items-center gap-3.5 p-3 rounded-[20px] bg-transparent hover:bg-neutral-50 active:bg-neutral-100 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-kpu-primary/50 touch-manipulation transition-all duration-300 ease-out"
                    >
                        {/* Icon Badge */}
                        <div className="shrink-0 w-12 h-12 rounded-full bg-neutral-100/80 text-neutral-600 flex items-center justify-center group-hover:bg-kpu-primary/10 group-hover:text-kpu-primary group-active:bg-kpu-primary/15 transition-colors duration-300">
                            <item.icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[14px] sm:text-[15px] font-bold text-neutral-900 leading-tight mb-0.5 group-hover:text-kpu-primary transition-colors duration-300">{item.title}</h3>
                            <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-tight font-medium truncate">{item.desc}</p>
                        </div>

                        {/* Arrow Indicator */}
                        <div className="shrink-0 text-neutral-300 group-hover:text-kpu-primary group-hover:translate-x-1 transition-all duration-300">
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
