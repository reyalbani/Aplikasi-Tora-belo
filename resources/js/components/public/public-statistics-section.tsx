import type {
    LucideIcon} from 'lucide-react';
import { 
    Users, 
    UserCheck, 
    ShieldCheck, 
    Handshake, 
    FileText, 
    GraduationCap, 
    MessageSquareWarning, 
    Building2,
    Mail,
    MessageSquare,
    ClipboardList,
    FileSearch,
    Landmark,
    Send
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Custom hook for Intersection Observer to trigger animation when visible
function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return { ref, isIntersecting };
}

// Custom hook for Smooth Count-Up Animation
function useCountUp(end: number, startAnimating: boolean, duration: number = 1500) {
    const [count, setCount] = useState(0);

    // Keep track of the "previous" end value to smoothly transition if data changes
    const prevEndRef = useRef(0);

    useEffect(() => {
        if (!startAnimating) {
return;
}

        let startTime: number | null = null;
        let animationFrame: number;
        
        const startValue = prevEndRef.current;
        const difference = end - startValue;

        const animate = (timestamp: number) => {
            if (!startTime) {
startTime = timestamp;
}

            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // easeOutQuart easing for natural deceleration
            const easeProgress = 1 - Math.pow(1 - percentage, 4);
            
            setCount(Math.floor(startValue + (difference * easeProgress)));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
                prevEndRef.current = end;
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, startAnimating, duration]);

    return count;
}

interface ServiceBreakdown {
    name: string;
    total: number;
}

interface StatisticsData {
    visitors: number;
    supervisors: number;
    commissioners: number;
    cooperations: number;
    total_submissions: number;
    services: ServiceBreakdown[];
    updated_at: string;
}

// Helper to get the correct icon based on service name
const getServiceIcon = (name: string): LucideIcon => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('ppid') || lowerName.includes('pejabat pengelola informasi')) {
return FileSearch;
}

    if (lowerName.includes('pendidikan pemilih')) {
return GraduationCap;
}

    if (lowerName.includes('pengaduan masyarakat')) {
return MessageSquareWarning;
}

    if (lowerName.includes('kerja sama') || lowerName.includes('kerjasama')) {
return Handshake;
}

    if (lowerName.includes('pemutakhiran data pemilih')) {
return Users;
}

    if (lowerName.includes('partai politik')) {
return Landmark;
}

    if (lowerName.includes('pengantaran surat')) {
return Send;
}

    if (lowerName.includes('konsultasi')) {
return MessageSquare;
}

    if (lowerName.includes('pengaduan pelayanan')) {
return ClipboardList;
}

    return FileText;
};

const MainStatItem = ({ label, value, icon: Icon, isVisible, isLast = false }: { label: string, value: number, icon: LucideIcon, isVisible: boolean, isLast?: boolean }) => {
    const animatedValue = useCountUp(value, isVisible);
    
    return (
        <div className={`flex flex-col items-center justify-center p-4 sm:p-6 relative ${!isLast ? 'after:content-[""] after:hidden lg:after:block after:absolute after:right-0 after:top-[25%] after:h-[50%] after:w-px after:bg-neutral-200/60' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mb-4 text-neutral-400 border border-neutral-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-110 hover:text-kpu-primary">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span className="text-[32px] sm:text-[36px] lg:text-[44px] font-bold text-neutral-900 tracking-tighter mb-1.5 font-mono leading-none">
                {new Intl.NumberFormat('id-ID').format(animatedValue)}
            </span>
            <span className="text-[11px] sm:text-[12px] font-medium text-neutral-500 uppercase tracking-[0.1em] text-center mt-1">
                {label}
            </span>
        </div>
    );
};


const getServiceDescription = (name: string): string => {
    switch(name) {
        case "Pejabat Pengelola Informasi dan Dokumentasi":
            return "Layanan permohonan informasi publik secara transparan.";
        case "Pendidikan Pemilih":
            return "Layanan untuk kegiatan pendidikan dan sosialisasi pemilih.";
        case "Pengaduan Masyarakat":
            return "Layanan untuk menyampaikan pengaduan kepada KPU Kota Palu.";
        case "Kerja Sama":
            return "Layanan pengajuan kerja sama dengan instansi atau pihak luar.";
        case "Pemutakhiran Data Pemilih":
            return "Layanan terkait pengecekan dan pembaruan data pemilih.";
        case "Pemutakhiran Data Partai Politik":
            return "Layanan terkait pendataan partai politik peserta pemilu.";
        case "Pengantaran Surat":
            return "Layanan administrasi untuk pengantaran surat resmi KPU.";
        case "Konsultasi":
            return "Layanan konsultasi terkait kepemiluan dan layanan KPU.";
        case "Pengaduan Pelayanan":
            return "Layanan pengaduan terhadap kualitas pelayanan publik KPU.";
        default:
            return "Layanan dan informasi resmi KPU Kota Palu.";
    }
};

const ServiceStatItem = ({ service, isVisible }: { service: ServiceBreakdown, isVisible: boolean }) => {
    const animatedValue = useCountUp(service.total, isVisible);
    const Icon = getServiceIcon(service.name);
    const description = getServiceDescription(service.name);
    
    const formattedValue = String(animatedValue).padStart(2, '0');
    
    return (
        <div className="group relative flex flex-col items-center text-center p-2 sm:p-4 transition-all duration-300 cursor-default">
            {/* Tooltip */}
            <div className="absolute bottom-[85%] left-1/2 -translate-x-1/2 mb-2 sm:mb-4 w-[200px] sm:w-[240px] opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out z-20">
                <div className="bg-neutral-900/95 backdrop-blur-md text-white text-[12px] sm:text-[13px] font-medium leading-relaxed px-4 py-3 sm:py-4 rounded-[16px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
                    {description}
                    {/* Tooltip pointer */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-neutral-900/95"></div>
                </div>
            </div>

            {/* Icon Container with Badge */}
            <div className="relative mb-4 sm:mb-5">
                {/* Badge */}
                <div className="absolute -top-2.5 -right-3.5 sm:-top-3 sm:-right-4 z-10 flex items-center gap-1.5 sm:gap-2 bg-white rounded-full pl-2.5 pr-3 py-1 sm:py-1.5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)] border border-neutral-100 transition-transform duration-300 group-hover:scale-110">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"></span>
                    <span className="text-[12px] sm:text-[13px] font-extrabold text-neutral-900 font-mono leading-none tracking-tight">
                        {formattedValue}
                    </span>
                </div>

                {/* Icon Circle */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-50/80 flex items-center justify-center text-neutral-400 border border-neutral-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-red-50 group-hover:text-kpu-primary group-hover:shadow-[0_12px_24px_-10px_rgba(239,68,68,0.25)] group-hover:border-red-100/60">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                </div>
            </div>

            {/* Title */}
            <span className="text-[12px] sm:text-[13px] font-semibold text-neutral-600 leading-snug group-hover:text-kpu-primary transition-colors duration-300 max-w-[140px] sm:max-w-[180px]">
                {service.name}
            </span>
        </div>
    );
};

export function PublicStatisticsSection() {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [error, setError] = useState(false);
    
    // Intersection Observer for triggering animations only when scrolled into view
    const { ref: sectionRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/public/statistics');

                if (!res.ok) {
throw new Error("Failed to fetch");
}

                const json = await res.json();

                if (json.success) {
                    setData(json.data);
                    setError(false);
                } else {
                    throw new Error("API returned false success");
                }
            } catch (err) {
                console.error("Error fetching statistics", err);
                setError(true);
            }
        };

        fetchStats();
        // Real-time polling every 30 seconds
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <section className="py-16 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-4 text-center text-neutral-500 font-medium">
                    Data statistik belum dapat dimuat. Silakan coba kembali.
                </div>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="py-24 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-8 h-8 border-4 border-kpu-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </section>
        );
    }

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);

        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };



    return (
        <section 
            ref={sectionRef} 
            className="py-10 sm:py-16 lg:py-20 bg-[#fafafa] border-t border-neutral-100 relative overflow-hidden" 
            id="statistik"
        >
            {/* Removed background decoration to ensure clean background */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                
                {/* Main Stats Container */}
                <div className="relative mb-12 sm:mb-16">

                    <div className="py-4">
                        
                        {/* Header Section Inside Card */}
                        <div className="text-center mb-5">
                            <div className="inline-flex items-center justify-center gap-2.5 px-5 py-2 bg-red-50 rounded-full border border-red-100/50 shadow-[0_2px_10px_-4px_rgba(239,68,68,0.1)]">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                </span>
                                <h2 className="text-[14px] sm:text-[16px] font-bold text-red-600 uppercase tracking-[0.1em]">
                                    INFORMASI TORA BELO
                                </h2>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent mb-6 mt-2"></div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-6 lg:gap-y-6 gap-x-4 sm:gap-x-6 relative z-10 mb-8">
                            <div className="col-span-1 flex justify-center">
                                <MainStatItem label="Pengunjung" value={data.visitors} icon={Users} isVisible={isIntersecting} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <MainStatItem label="Pengawas" value={data.supervisors} icon={ShieldCheck} isVisible={isIntersecting} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <MainStatItem label="Komisioner" value={data.commissioners} icon={UserCheck} isVisible={isIntersecting} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <MainStatItem label="Kerja Sama" value={data.cooperations} icon={Handshake} isVisible={isIntersecting} />
                            </div>
                            <div className="col-span-2 lg:col-span-1 flex justify-center">
                                <MainStatItem label="Pengajuan Masuk" value={data.total_submissions} icon={FileText} isVisible={isIntersecting} isLast={true} />
                            </div>
                        </div>

                        {/* Bottom Text & Updated */}
                        <div className="text-center flex flex-col items-center">
                            <p className="text-[13px] text-neutral-500 mb-4 font-medium">
                                Statistik pelayanan TORA BELO berdasarkan data layanan yang tercatat.
                            </p>
                            <div className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-[12px] font-medium text-neutral-500 bg-neutral-50 px-3.5 py-1.5 rounded-lg border border-neutral-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Terakhir diperbarui: {formatTimeAgo(data.updated_at)}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Breakdown by Service */}
                <div className="max-w-5xl mx-auto relative z-10 mt-16 sm:mt-24">
                    <div className="text-center mb-12 sm:mb-16">
                        <h3 className="text-[18px] sm:text-[22px] font-bold text-neutral-800 tracking-tight inline-flex items-center gap-4">
                            <span className="w-8 sm:w-12 h-[2px] bg-red-500/20 rounded-full"></span>
                            Total Pengajuan per Layanan
                            <span className="w-8 sm:w-12 h-[2px] bg-red-500/20 rounded-full"></span>
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 sm:gap-y-16 gap-x-4 sm:gap-x-8">
                        {data.services.map((service, idx) => (
                            <ServiceStatItem 
                                key={idx} 
                                service={service} 
                                isVisible={isIntersecting} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
