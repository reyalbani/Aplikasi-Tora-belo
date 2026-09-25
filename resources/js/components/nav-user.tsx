import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage<any>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const user = auth.user;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group transition-all duration-200 rounded-[12px] h-auto p-2 bg-slate-800/40 hover:bg-slate-800 text-white data-[state=open]:bg-slate-800 border border-slate-700/50"
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-kpu-primary/20 text-white font-bold text-[13px] border border-kpu-primary/30">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col flex-1 text-left leading-tight">
                                    <span className="truncate text-[14px] font-semibold text-white">{user?.name}</span>
                                    <span className="truncate text-[12px] font-medium text-slate-400">
                                        {user?.role?.nama_role || user?.role_name || 'Admin'}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'top'
                        }
                        sideOffset={12}
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
