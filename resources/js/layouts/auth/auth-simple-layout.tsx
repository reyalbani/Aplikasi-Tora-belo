import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
            {/* Premium background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[100px]" />
                <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>
            
            <div className="w-full max-w-[460px] animate-fade-in relative z-10 flex flex-col">
                {/* Navigasi Kembali ke Portal Publik */}
                <div className="mb-4 sm:mb-5 self-start">
                    <Link 
                        href="/" 
                        className="group inline-flex items-center px-3 py-2 -ml-3 rounded-[8px] text-[14px] font-medium text-slate-500 transition-colors duration-200 hover:bg-slate-200/60 hover:text-slate-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Kembali ke Portal Publik
                    </Link>
                </div>

                {/* Login Card */}
                <div className="rounded-[24px] bg-white/80 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex-1">
                    <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
                        <img 
                            src="/images/logo-kpu.png" 
                            alt="Logo KPU Kota Palu" 
                            className="mb-5 sm:mb-6 h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
                        />
                        <h1 className="font-['Kalam'] text-3xl sm:text-4xl text-slate-900 tracking-wide relative inline-block mb-3 pr-2">
                            TORA BELO
                            <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-red-600" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0,5 Q50,9 100,2" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </h1>
                        <h2 className="text-[12px] sm:text-[13px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                            KPU Kota Palu
                        </h2>
                        
                        {(title || description) && (
                            <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                                {title && (
                                    <h3 className="text-xl font-bold tracking-tight text-slate-800">
                                        {title}
                                    </h3>
                                )}
                                {description && (
                                    <p className="mt-2.5 text-[14px] leading-relaxed text-slate-500 max-w-[320px] mx-auto">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-[13px] text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                </div>
            </div>
        </div>
    );
}
