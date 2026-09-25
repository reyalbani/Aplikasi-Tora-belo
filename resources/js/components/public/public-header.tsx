import { Link, usePage } from '@inertiajs/react';
import { LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function PublicHeader() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            
            // Simple active section detection
            const sections = ['beranda', 'layanan', 'cek-status', 'informasi'];
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If section is within viewport
                    if (rect.top <= 120 && rect.bottom >= 120) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLinkClass = (section: string) => {
        const isActive = activeSection === section;
        return `relative text-[14px] font-medium transition-colors duration-250 flex items-center h-full ${isActive ? 'text-white' : 'text-neutral-300 hover:text-white'} group`;
    };

    const getIndicatorClass = (section: string) => {
        const isActive = activeSection === section;
        return `absolute bottom-[24px] left-0 right-0 h-[2px] bg-kpu-primary transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} origin-left rounded-t-sm`;
    };

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-neutral-950/85 backdrop-blur-md shadow-sm border-b border-white/5 py-0' : 'bg-gradient-to-b from-black/60 to-transparent border-b border-transparent py-1 sm:py-2'}`}>
            <div className="container mx-auto flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group relative z-50">
                    <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-[42px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                    <div className="flex flex-col">
                        <span className="font-['Kalam'] text-[20px] leading-none text-white tracking-wide relative inline-block pr-1 mb-0.5">
                            TORA BELO
                            <svg className="absolute -bottom-0.5 left-0 w-full h-1.5 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                        <span className="text-[10px] font-medium text-neutral-300 group-hover:text-neutral-200 transition-colors uppercase tracking-wider">KPU Kota Palu</span>
                    </div>
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 h-full">
                    <a href="#beranda" className={getLinkClass('beranda')}>
                        Beranda
                        <span className={getIndicatorClass('beranda')}></span>
                    </a>
                    <a href="#layanan" className={getLinkClass('layanan')}>
                        Layanan
                        <span className={getIndicatorClass('layanan')}></span>
                    </a>
                    <a href="#cek-status" className={getLinkClass('cek-status')}>
                        Cek Status
                        <span className={getIndicatorClass('cek-status')}></span>
                    </a>
                    <a href="#informasi" className={getLinkClass('informasi')}>
                        Informasi
                        <span className={getIndicatorClass('informasi')}></span>
                    </a>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {auth?.user ? (
                        <Button asChild variant="default" className="bg-kpu-primary hover:bg-kpu-primary-light text-white rounded-[10px] px-5 h-[38px] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-250 font-medium text-[13px] cursor-pointer border border-transparent hover:border-white/10">
                            <Link href="/dashboard">
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild variant="default" className="bg-kpu-primary hover:bg-kpu-primary-light text-white rounded-[10px] px-5 h-[38px] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-250 font-medium text-[13px] cursor-pointer flex items-center gap-2 border border-transparent hover:border-white/10">
                            <Link href="/login">
                                <LogIn className="h-[15px] w-[15px]" />
                                <span>Masuk</span>
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center relative z-50">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -mr-2 text-white hover:text-neutral-200 transition-colors focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div 
                className={`md:hidden absolute top-0 left-0 right-0 w-full bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden pt-[72px] ${isMobileMenuOpen ? 'max-h-[100vh] opacity-100 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
                <div className="container mx-auto px-4 py-5">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center gap-4">
                        <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-16 w-auto object-contain" />
                        <div className="text-center">
                            <div className="font-['Kalam'] text-2xl text-white tracking-wide relative inline-block px-1">
                                TORA BELO
                                <svg className="absolute -bottom-1 left-0 w-full h-2 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="mt-2 text-[10px] font-bold text-kpu-primary uppercase tracking-widest">KPU Kota Palu</div>
                        </div>
                        <div className="w-full pt-3 mt-1 border-t border-white/10 flex flex-col gap-2">
                            {auth?.user ? (
                                <Button asChild variant="default" className="w-full bg-kpu-primary hover:bg-kpu-primary-light text-white rounded-[12px] h-[46px] shadow-md active:scale-[0.98] transition-all duration-250 font-semibold text-[15px] cursor-pointer">
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild variant="default" className="w-full bg-kpu-primary hover:bg-kpu-primary-light text-white rounded-[12px] h-[46px] shadow-md active:scale-[0.98] transition-all duration-250 font-semibold text-[15px] cursor-pointer flex items-center justify-center gap-2">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <LogIn className="h-[18px] w-[18px]" />
                                        <span>Masuk</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
