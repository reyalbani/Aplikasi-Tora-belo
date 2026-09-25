import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nilai = [
        { letter: 'T', word: 'Transparan' },
        { letter: 'O', word: 'Objektif' },
        { letter: 'R', word: 'Responsif' },
        { letter: 'A', word: 'Akuntabel' },
        { letter: 'B', word: 'Baik' },
        { letter: 'E', word: 'Efisien' },
        { letter: 'L', word: 'Luwes' },
        { letter: 'O', word: 'Organisatoris' },
    ];

    const slides = [
        // Slide 1: Original Hero (Gedung KPU)
        (
            <div className="relative w-full flex-1 flex flex-col justify-center pt-[120px] pb-24 sm:pt-[140px] sm:pb-28 lg:pt-[160px] lg:pb-32">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/gedung-kpu.jpeg" 
                        alt="Background Gedung KPU Kota Palu" 
                        className="w-full h-full object-cover object-center"
                        loading="eager" 
                    />
                </div>
                
                <div 
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.5) 65%, rgba(10,10,10,0.1) 100%)'
                    }}
                ></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex flex-col justify-center">
                    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-white mb-6 uppercase shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-kpu-primary mr-2.5 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                            PORTAL RESMI KPU KOTA PALU
                        </div>
                        
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-5 leading-[1.15]">
                            Selamat Datang di <br className="hidden sm:block" />
                            <span className="text-white mt-2 block drop-shadow-sm font-['Kalam'] tracking-wide relative w-fit pr-4">
                                TORA BELO
                                <svg className="absolute -bottom-1 left-0 w-full h-3 sm:h-4 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-200 mb-5 leading-snug tracking-tight">
                            Sistem Informasi Pelayanan Terpadu KPU Kota Palu
                        </h2>
                        
                        <p className="max-w-2xl text-[15px] sm:text-base text-neutral-300 mb-10 leading-relaxed font-medium">
                            Memudahkan masyarakat mengakses layanan publik, informasi, pengajuan, dan memantau status permohonan secara mudah, transparan, dan terpadu.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 max-w-sm sm:max-w-none">
                            <Button size="lg" asChild className="w-full sm:w-auto bg-kpu-primary hover:bg-kpu-primary-light text-white rounded-[12px] shadow-lg hover:shadow-kpu-primary/25 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 h-[52px] px-8 text-[15px] font-semibold group border border-transparent hover:border-white/20">
                                <a href="#layanan" className="flex items-center justify-center">
                                    Lihat Layanan
                                    <ChevronRight className="ml-2 h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-white/10 backdrop-blur-md hover:bg-white/15 border-white/20 hover:border-white/30 text-white rounded-[12px] shadow-sm hover:-translate-y-1 active:translate-y-0 transition-all duration-300 h-[52px] px-8 text-[15px] font-semibold group">
                                <a href="#cek-status" className="flex items-center justify-center">
                                    <Search className="mr-2.5 h-[16px] w-[16px] text-neutral-300 group-hover:text-white transition-colors" />
                                    Cek Status Pengajuan
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        ),
        // Slide 2: TORA BELO Banner (8 Values)
        (
            <div className="relative w-full flex-1 flex flex-col justify-center pt-[120px] pb-16 sm:pt-[140px] sm:pb-20 lg:pt-[140px] px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/gedung-kpu.jpeg" 
                        alt="Background" 
                        className="w-full h-full object-cover object-center grayscale"
                        loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                </div>
                <div className="w-full max-w-7xl mx-auto bg-[#8b1115] rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-8 relative overflow-hidden shadow-2xl shadow-red-900/20 border border-red-900/50 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 h-auto z-20">
                    <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-red-600/20 rounded-full blur-[50px] pointer-events-none translate-y-1/3 translate-x-1/4"></div>

                    <div className="flex-shrink-0 flex flex-col md:flex-row items-center gap-4 relative z-10 w-full lg:w-1/3 lg:min-w-[340px] lg:border-r lg:border-red-400/20 lg:pr-8">
                        <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-12 sm:h-14 lg:h-16 w-auto object-contain drop-shadow-sm hidden md:block" />
                        <div className="flex flex-col text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2 md:hidden">
                                <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-10 w-auto" />
                                <h2 className="font-['Kalam'] text-[26px] text-white tracking-wide leading-none relative inline-block drop-shadow-md pr-1">
                                    TORA BELO
                                    <svg className="absolute -bottom-1 left-0 w-full h-1.5 text-red-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                    </svg>
                                </h2>
                            </div>
                            <h2 className="hidden md:inline-block font-['Kalam'] text-[28px] lg:text-[36px] text-white tracking-wide leading-none relative drop-shadow-md pr-2 mb-3">
                                TORA BELO
                                <svg className="absolute -bottom-1.5 left-0 w-full h-2 sm:h-2.5 text-red-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </h2>
                            <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-red-50 leading-relaxed font-medium opacity-95 mx-auto lg:mx-0 max-w-md lg:max-w-sm">
                                Inovasi pelayanan KPU Kota Palu yang dirancang untuk memberikan kemudahan, kepastian, dan kenyamanan dalam mengakses seluruh layanan kepemiluan bagi masyarakat.
                            </p>
                        </div>
                    </div>

                    <div className="w-full relative z-10 flex-1">
                        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 w-full">
                            {nilai.map((item, index) => (
                                <div key={index} className="bg-red-950/40 backdrop-blur-sm rounded-[12px] sm:rounded-[14px] p-2 sm:p-2.5 lg:p-3 border border-red-400/20 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-red-900/60 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-md group aspect-square lg:aspect-auto min-h-[70px]">
                                    <span className="font-['Kalam'] text-[22px] sm:text-[24px] lg:text-[26px] text-red-300 leading-none mb-1 group-hover:text-white transition-colors drop-shadow-sm">
                                        {item.letter}
                                    </span>
                                    <span className="font-bold text-white/90 text-[9px] sm:text-[10px] uppercase tracking-wider group-hover:text-white transition-colors break-words text-center w-full">
                                        {item.word}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [isHovered]);

    return (
        <section 
            id="beranda" 
            className="relative overflow-hidden w-full bg-neutral-950 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full flex flex-col group min-h-[550px] md:min-h-[600px] flex-1">
                
                {/* Slides Container */}
                <div 
                    className="flex transition-transform duration-1000 ease-in-out flex-1"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full shrink-0 flex flex-col items-stretch">
                            {slide}
                        </div>
                    ))}
                </div>

                {/* Left/Right Arrow Navigation */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md shadow-lg flex items-center justify-center text-white opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 focus:outline-none hidden sm:flex border border-white/10 hover:border-white/30"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md shadow-lg flex items-center justify-center text-white opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 focus:outline-none hidden sm:flex border border-white/10 hover:border-white/30"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                {/* Dots Indicators */}
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2.5 sm:gap-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 focus:outline-none shadow-sm border border-black/10 ${
                                currentSlide === index 
                                    ? "bg-kpu-primary w-10 sm:w-12" 
                                    : "bg-white/50 hover:bg-white w-2.5 sm:w-3"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
