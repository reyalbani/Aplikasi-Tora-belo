import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup } from '@/types';

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="flex flex-col gap-3">
            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-3 py-0">
                    <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-bold tracking-widest text-slate-400/80 uppercase">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {group.items.map((item) => {
                            const active = item.isActive !== undefined ? item.isActive : isCurrentUrl(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={`transition-all duration-200 rounded-[10px] h-10 px-3 ${
                                            active 
                                                ? 'bg-kpu-primary/15 text-white font-semibold hover:bg-kpu-primary/20' 
                                                : 'text-slate-300 font-medium hover:bg-slate-800/80 hover:text-white'
                                        }`}
                                    >
                                        <Link href={item.href} prefetch className="flex items-center gap-3">
                                            {item.icon && <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-kpu-primary' : 'text-slate-400'}`} strokeWidth={active ? 2.5 : 2} />}
                                            <span className="text-[14px]">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
