import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

export function PublicFooter() {
    return (
        <footer className="border-t border-neutral-800 bg-neutral-950 pt-12 pb-28 md:pb-12 text-neutral-300 relative z-10">
            <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
                
                {/* Desktop/Tablet Layout */}
                <div className="hidden md:grid grid-cols-4 gap-8 mb-12">
                    {/* KOLOM 1: Logo & Deskripsi */}
                    <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-12 w-12 object-contain" />
                            <div className="flex flex-col">
                                <span className="font-['Kalam'] text-2xl leading-none text-white tracking-wide relative inline-block pr-1 mb-0.5">
                                    TORA BELO
                                    <svg className="absolute -bottom-0.5 left-0 w-full h-1.5 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mt-1">KPU Kota Palu</span>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-[13px] leading-relaxed max-w-xs">
                            Pelayanan publik yang transparan, objektif, responsif, akuntabel, baik, efisien, luwes, dan organisatoris.
                        </p>
                    </div>
                    
                    {/* KOLOM 2: Alamat */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-white font-semibold mb-4 text-[13px] tracking-wider uppercase">Lokasi Kantor</h4>
                        <div className="flex gap-3 text-neutral-400">
                            <MapPin className="h-[18px] w-[18px] shrink-0 text-kpu-primary mt-0.5" />
                            <p className="text-[13px] leading-relaxed">
                                Jl. Balai Kota Selatan, No.6,<br />
                                Tanamodindi, Kec. Mantikulore,<br />
                                Kota Palu, Sulteng
                            </p>
                        </div>
                    </div>

                    {/* KOLOM 3: Kontak (Email & Telepon) */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-white font-semibold mb-4 text-[13px] tracking-wider uppercase">Kontak</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3 text-neutral-400 group">
                                <Mail className="h-[18px] w-[18px] shrink-0 text-kpu-primary" />
                                <a href="mailto:palukota.kpu@gmail.com" className="text-[13px] group-hover:text-white transition-colors duration-250">
                                    palukota.kpu@gmail.com
                                </a>
                            </div>
                            <div className="flex gap-3 text-neutral-400 group">
                                <Phone className="h-[18px] w-[18px] shrink-0 text-kpu-primary" />
                                <a href="tel:0451457271" className="text-[13px] group-hover:text-white transition-colors duration-250">
                                    (0451) 457271
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* KOLOM 4: Navigasi */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-white font-semibold mb-4 text-[13px] tracking-wider uppercase">Navigasi</h4>
                        <nav className="flex flex-col gap-2">
                            {['Beranda', 'Layanan', 'Cek Status', 'Informasi'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[13px] text-neutral-400 hover:text-white transition-colors flex items-center group">
                                    <ChevronRight className="w-3.5 h-3.5 mr-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-kpu-primary" />
                                    {item}
                                </a>
                            ))}
                            <a href="/login" className="text-[13px] text-kpu-primary hover:text-kpu-primary-light transition-colors mt-1 font-medium flex items-center group">
                                <ChevronRight className="w-3.5 h-3.5 mr-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                Login
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Mobile Layout (Restructured exclusively for mobile) */}
                <div className="md:hidden flex flex-col gap-8 mb-8">
                    {/* Branding */}
                    <div className="flex flex-col items-start border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <img src="/images/logo-kpu.png" alt="Logo KPU Kota Palu" className="h-[42px] w-[42px] object-contain" />
                            <div className="flex flex-col">
                                <span className="font-['Kalam'] text-2xl leading-none text-white tracking-wide relative inline-block pr-1 mb-0.5">
                                    TORA BELO
                                    <svg className="absolute -bottom-0.5 left-0 w-full h-1.5 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mt-1">KPU Kota Palu</span>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-[13px] leading-relaxed font-medium">
                            Pelayanan publik yang transparan, objektif, responsif, akuntabel, baik, efisien, luwes, dan organisatoris.
                        </p>
                    </div>

                    {/* Informasi Kontak */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-[16px] p-5 flex flex-col gap-5">
                        <h4 className="text-white font-semibold text-[13px] tracking-wider uppercase">Informasi Kontak</h4>
                        
                        <div className="flex gap-3.5 text-neutral-300">
                            <div className="w-8 h-8 rounded-full bg-kpu-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-4 w-4 text-kpu-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5 pt-0.5">
                                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Alamat Kantor</span>
                                <p className="text-[13px] leading-relaxed">
                                    Jl. Balai Kota Selatan, No.6, Tanamodindi, Kec. Mantikulore, Kota Palu, Sulteng
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3.5 text-neutral-300">
                            <div className="w-8 h-8 rounded-full bg-kpu-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="h-4 w-4 text-kpu-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5 pt-0.5">
                                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Email</span>
                                <a href="mailto:palukota.kpu@gmail.com" className="text-[13px]">
                                    palukota.kpu@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-3.5 text-neutral-300">
                            <div className="w-8 h-8 rounded-full bg-kpu-primary/10 flex items-center justify-center shrink-0">
                                <Phone className="h-4 w-4 text-kpu-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5 pt-0.5">
                                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Telepon</span>
                                <a href="tel:0451457271" className="text-[13px]">
                                    (0451) 457271
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Navigasi 2 Kolom */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold text-[13px] tracking-wider uppercase pl-1">Navigasi</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pl-1">
                            {['Beranda', 'Layanan', 'Cek Status', 'Informasi'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[14px] text-neutral-400 flex items-center py-1 group">
                                    <ChevronRight className="w-3.5 h-3.5 mr-2 text-neutral-600 group-hover:text-kpu-primary transition-colors" />
                                    {item}
                                </a>
                            ))}
                            <a href="/login" className="text-[14px] text-kpu-primary flex items-center py-1 col-span-2 mt-1">
                                <ChevronRight className="w-3.5 h-3.5 mr-2" />
                                Login
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Divider */}
                <div className="border-t border-white/10 pt-6 flex flex-col items-center md:flex-row md:justify-between gap-4">
                    <div className="text-[12px] text-neutral-500 font-medium">
                        &copy; 2026 KPU Kota Palu. Hak Cipta Dilindungi.
                    </div>
                </div>
            </div>
        </footer>
    );
}
