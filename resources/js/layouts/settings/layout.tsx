import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { User, ShieldCheck, Palette } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Tampilan',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#f8fafc]">
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-slate-900">
                    Pengaturan
                </h1>
                <p className="text-[15px] text-slate-500 max-w-2xl leading-relaxed">
                    Kelola profil, keamanan akun, dan preferensi TORA BELO Anda.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex flex-col gap-1.5" aria-label="Settings">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = isCurrentOrParentUrl(item.href);
                            return (
                                <Link 
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14.5px] font-medium transition-all duration-200 min-h-[44px]",
                                        isActive 
                                            ? "bg-kpu-primary/10 text-slate-900 shadow-[inset_2px_0_0_0_#d91b22]" 
                                            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className={cn(
                                            "h-[18px] w-[18px] transition-colors",
                                            isActive ? "text-kpu-primary stroke-[2.5px]" : "text-slate-400"
                                        )} />
                                    )}
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <div className="flex-1 max-w-4xl">
                    <div className="flex flex-col gap-8 pb-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
