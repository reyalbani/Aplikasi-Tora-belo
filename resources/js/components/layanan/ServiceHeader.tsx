import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface ServiceHeaderProps {
    title: string;
    backUrl?: string;
    onBack?: () => void;
}

export function ServiceHeader({ title, backUrl, onBack }: ServiceHeaderProps) {
    const defaultBackUrl = !backUrl && !onBack ? "/" : backUrl;

    const btnClassMobile = "inline-flex items-center justify-center w-8 h-8 sm:hidden text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 rounded-lg shrink-0 ml-2";
    const btnClassDesktop = "hidden sm:inline-flex items-center text-[13px] font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-4 py-2.5 rounded-xl shrink-0 ml-4";

    return (
        <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3 sm:py-0 sm:h-[72px] flex flex-col sm:flex-row sm:items-center justify-between max-w-5xl gap-1 sm:gap-0">
                {/* Mobile Top Row / Desktop Left Side */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-[34px] sm:h-[42px] w-auto object-contain shrink-0" />
                        
                        <div className="flex flex-col shrink-0">
                            <span className="font-extrabold text-[15px] sm:text-[17px] leading-tight text-neutral-900 tracking-tight">TORA BELO</span>
                            <span className="text-[9px] sm:text-[10px] font-medium text-neutral-500 uppercase tracking-wider">KPU Kota Palu</span>
                        </div>
                    </div>

                    {/* Back Button Mobile */}
                    <div className="sm:hidden shrink-0">
                        {onBack ? (
                            <button onClick={onBack} className={btnClassMobile}>
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link href={defaultBackUrl!} className={btnClassMobile}>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Row / Desktop Right Side */}
                <div className="flex items-center w-full sm:w-auto mt-1 sm:mt-0 pl-[46px] sm:pl-0">
                    <span className="text-neutral-300 mx-2 hidden sm:inline-block shrink-0">|</span>
                    
                    <span className="text-neutral-600 font-bold text-[13px] sm:text-[15px] truncate">{title}</span>

                    {/* Back Button Desktop */}
                    {onBack ? (
                        <button onClick={onBack} className={btnClassDesktop}>
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            <span>Kembali</span>
                        </button>
                    ) : (
                        <Link href={defaultBackUrl!} className={btnClassDesktop}>
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            <span>Kembali</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
