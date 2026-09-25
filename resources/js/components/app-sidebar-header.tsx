import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Bell, Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<any>().props;
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Real-time clock (Asia/Makassar is UTC+8)
    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date | null) => {
        if (!date) return '--:--';
        return new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date) + ' WITA';
    };

    const formatTimeMobile = (date: Date | null) => {
        if (!date) return '--:--';
        return new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Makassar',
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    const userRole = auth?.user?.role?.nama_role || (auth?.user as any)?.role_name || '';
    const isAdmin = userRole === 'Admin';

    // Simulate real-time notifications fetch
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isAdmin) return;
            try {
                // If endpoint exists, we can fetch real notifications
                const response = await fetch('/admin/notifications/unread', {
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unread_count || 0);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s polling
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async () => {
        if (!isAdmin) return;
        try {
            await fetch('/admin/notifications/mark-read', { 
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 md:px-6 transition-[width,height] ease-linear">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-accent" />
                <div className="hidden sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="sm:hidden font-semibold text-foreground text-[15px]">
                    Dashboard
                </div>
            </div>
            
            {auth?.user && (
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Real-time Clock */}
                    <div className="hidden md:flex flex-col items-end justify-center mr-1 text-right">
                        <span className="text-[13px] font-bold text-foreground tracking-tight">{formatTime(currentTime)}</span>
                        <span className="text-[11px] font-medium text-muted-foreground">{formatDate(currentTime)}</span>
                    </div>
                    <div className="md:hidden flex items-center justify-center mr-1">
                        <span className="text-[12px] font-bold text-foreground">{formatTimeMobile(currentTime)}</span>
                    </div>

                    <div className="h-5 w-px bg-border hidden sm:block mx-1"></div>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Buka notifikasi">
                                <Bell className="h-[18px] w-[18px]" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-kpu-primary text-[9px] font-bold text-white border-2 border-background">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 rounded-xl p-0 overflow-hidden" align="end" sideOffset={8}>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                                <span className="font-semibold text-[14px] text-foreground">Notifikasi</span>
                                <button onClick={markAsRead} className="text-[12px] font-medium text-kpu-primary hover:text-kpu-primary-dark transition-colors">
                                    Tandai semua dibaca
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto bg-background">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <div key={idx} className={`flex flex-col gap-1 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${notif.is_read ? 'opacity-60' : 'bg-primary/5'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-kpu-primary"></div>
                                                <span className="text-[13px] font-semibold text-foreground">{notif.title}</span>
                                            </div>
                                            <p className="text-[13px] text-muted-foreground pl-4">{notif.message}</p>
                                            <span className="text-[11px] text-muted-foreground/80 pl-4 mt-0.5">{notif.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <span className="text-[13px] font-medium text-foreground">Tidak ada notifikasi baru</span>
                                        <span className="text-[12px] text-muted-foreground max-w-[200px]">Semua aktivitas penting akan muncul di sini.</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-border bg-background">
                                <button className="w-full py-1.5 text-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Lihat semua notifikasi
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <div className="h-5 w-px bg-border mx-1 hidden sm:block"></div>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 rounded-[8px] p-1.5 hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <div className="hidden flex-col items-end text-sm sm:flex mr-1">
                                    <span className="font-semibold text-foreground text-[13px] leading-tight">{auth.user.name}</span>
                                    <span className="text-[11px] font-medium text-muted-foreground">{auth.user.role?.nama_role || auth.user.role_name || 'Admin'}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-kpu-primary/10 flex items-center justify-center text-kpu-primary font-bold text-[13px] border border-kpu-primary/20">
                                    {auth.user.name?.charAt(0).toUpperCase()}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-xl" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </header>
    );
}
