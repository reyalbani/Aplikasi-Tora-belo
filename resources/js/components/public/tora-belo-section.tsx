import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ToraBeloSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

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
        // Slide 1: Banner TORA BELO Utama
        (
            <div className="w-full bg-[#8b1115] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-lg border border-red-900/50 flex flex-col items-center justify-center text-center h-full min-h-[160px] sm:min-h-[200px]">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-red-600/30 rounded-full blur-[50px] pointer-events-none translate-y-1/3 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                    <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-16 sm:h-20 lg:h-24 w-auto object-contain drop-shadow-md" />
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="font-['Kalam'] text-[32px] sm:text-[44px] lg:text-[56px] text-white tracking-wide leading-none relative inline-block drop-shadow-lg mb-2">
                            TORA BELO
                            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-red-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </h2>
                        <span className="text-[12px] sm:text-[14px] lg:text-[16px] font-bold text-red-50 uppercase tracking-[0.2em] opacity-90 drop-shadow-sm">
                            Sistem Informasi Pelayanan Terpadu
                        </span>
                        <span className="text-[11px] sm:text-[13px] font-medium text-red-200 uppercase tracking-widest mt-1">
                            KPU Kota Palu
                        </span>
                    </div>
                </div>
            </div>
        ),
        // Slide 2: Penjelasan mengenai identitas/nilai TORA BELO (8-grid)
        (
            <div className="w-full bg-[#8b1115] rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-8 relative overflow-hidden shadow-lg border border-red-900/50 flex flex-col md:flex-row items-center gap-6 lg:gap-8 h-full min-h-[160px] sm:min-h-[200px]">
                {/* Background decorations */}
                <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-red-600/20 rounded-full blur-[50px] pointer-events-none translate-y-1/3 translate-x-1/4"></div>

                {/* Left: Branding & Explanation */}
                <div className="flex-shrink-0 flex flex-col md:flex-row items-center gap-4 relative z-10 w-full md:w-1/3 md:min-w-[280px] lg:min-w-[340px] md:border-r md:border-red-400/20 md:pr-6 lg:pr-8">
                    <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm hidden md:block" />
                    <div className="flex flex-col text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2 md:hidden">
                            <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-10 w-auto" />
                            <h2 className="font-['Kalam'] text-[26px] text-white tracking-wide leading-none relative inline-block drop-shadow-md pr-1">
                                TORA BELO
                                <svg className="absolute -bottom-1 left-0 w-full h-1.5 text-red-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </h2>
                        </div>
                        <h2 className="hidden md:inline-block font-['Kalam'] text-[28px] lg:text-[34px] text-white tracking-wide leading-none relative drop-shadow-md pr-2 mb-3">
                            TORA BELO
                            <svg className="absolute -bottom-1.5 left-0 w-full h-2 sm:h-2.5 text-red-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </h2>
                        <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-red-50 leading-relaxed font-medium opacity-95 mx-auto md:mx-0 max-w-sm">
                            Inovasi pelayanan KPU Kota Palu yang dirancang untuk memberikan kemudahan, kepastian, dan kenyamanan dalam mengakses seluruh layanan kepemiluan bagi masyarakat.
                        </p>
                    </div>
                </div>

                {/* Right: Values Grid */}
                <div className="w-full relative z-10 flex-1">
                    <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-3 w-full">
                        {nilai.map((item, index) => (
                            <div key={index} className="bg-red-950/40 backdrop-blur-sm rounded-[12px] sm:rounded-[14px] p-2 sm:p-2.5 border border-red-400/20 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-red-900/60 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-md group">
                                <span className="font-['Kalam'] text-[20px] sm:text-[24px] text-red-300 leading-none mb-1 group-hover:text-white transition-colors drop-shadow-sm">
                                    {item.letter}
                                </span>
                                <span className="font-bold text-white/90 text-[8px] sm:text-[9px] uppercase tracking-wider group-hover:text-white transition-colors line-clamp-1">
                                    {item.word}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-neutral-50 py-6 sm:py-8 relative overflow-hidden" id="tora-belo-carousel">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <div className="relative w-full group">
                    
                    {/* Carousel Viewport */}
                    <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-sm">
                        <div 
                            className="flex transition-transform duration-700 ease-in-out h-full items-stretch"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {slides.map((slide, index) => (
                                <div key={index} className="w-full shrink-0 h-full flex items-stretch">
                                    {slide}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur shadow-md flex items-center justify-center text-neutral-800 opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 focus:outline-none hidden sm:flex"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur shadow-md flex items-center justify-center text-neutral-800 opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 focus:outline-none hidden sm:flex"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-4 sm:mt-5">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                                    currentSlide === index 
                                        ? "bg-red-600 w-8" 
                                        : "bg-red-200 hover:bg-red-400 w-2.5"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
