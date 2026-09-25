export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5 transition-all duration-200">
            <div className="flex shrink-0 items-center justify-center">
                <img 
                    src="/images/logo-kpu.png" 
                    alt="Logo KPU Kota Palu" 
                    className="h-8 w-auto object-contain drop-shadow-sm group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-auto"
                />
            </div>
            <div className="grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[16px] font-bold leading-tight text-white tracking-tight">
                    TORA BELO
                </span>
                <span className="truncate text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                    KPU Kota Palu
                </span>
            </div>
        </div>
    );
}
