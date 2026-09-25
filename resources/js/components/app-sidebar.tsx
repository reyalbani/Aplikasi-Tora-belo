import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    ServerCog, 
    BookOpenCheck, 
    MessageSquareHeart, 
    Newspaper, 
    PieChart, 
    ActivitySquare, 
    Settings 
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavGroup } from '@/types';

export function AppSidebar() {
    const page = usePage<any>();
    const userRole = page.props.auth?.user?.role?.nama_role || (page.props.auth?.user as any)?.role_name || '';
    
    const isPetugas = userRole === 'Petugas';
    const isAdmin = userRole === 'Admin' || userRole === ''; // Default admin if empty for safety
    const isPimpinan = userRole === 'Pimpinan';

    const dashboardUrl = isPetugas ? '/petugas/area' : (isPimpinan ? '/pimpinan/area' : '/admin/area');

    const adminNavGroups: NavGroup[] = [
        {
            title: 'Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboardUrl,
                    icon: LayoutDashboard,
                    isActive: page.url === dashboardUrl || page.url.includes('/area'),
                },
            ]
        },
        {
            title: 'Manajemen',
            items: [
                {
                    title: 'Manajemen Pengguna',
                    href: '/admin/users',
                    icon: Users,
                    isActive: page.url.startsWith('/admin/users'),
                },
                {
                    title: 'Permohonan Akun',
                    href: '/admin/account-requests',
                    icon: Users,
                    isActive: page.url.startsWith('/admin/account-requests'),
                },
                {
                    title: 'Manajemen Layanan',
                    href: '/admin/services',
                    icon: ServerCog,
                },
                {
                    title: 'Informasi & Pengumuman',
                    href: '/admin/information',
                    icon: Newspaper,
                },
            ]
        },
        {
            title: 'Pelayanan',
            items: [
                {
                    title: 'Data Buku Tamu',
                    href: '/admin/buku-tamu',
                    icon: BookOpenCheck,
                    isActive: page.url.startsWith('/admin/buku-tamu'),
                },
                {
                    title: 'Survey Kepuasan / SKM',
                    href: '/admin/skm',
                    icon: MessageSquareHeart,
                    isActive: page.url.startsWith('/admin/skm'),
                },
            ]
        },
        {
            title: 'Monitoring',
            items: [
                {
                    title: 'Monitoring & Laporan',
                    href: '/admin/monitoring',
                    icon: PieChart,
                    isActive: page.url.startsWith('/admin/monitoring'),
                },
                {
                    title: 'Aktivitas / Log Sistem',
                    href: '/admin/activity-logs',
                    icon: ActivitySquare,
                    isActive: page.url.startsWith('/admin/activity-logs'),
                },
            ]
        },
        {
            title: 'Sistem',
            items: [
                {
                    title: 'Pengaturan',
                    href: '/admin/settings',
                    icon: Settings,
                    isActive: page.url.startsWith('/admin/settings'),
                },
            ]
        }
    ];

    const petugasNavGroups: NavGroup[] = [
        {
            title: 'Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboardUrl,
                    icon: LayoutDashboard,
                    isActive: page.url === dashboardUrl || page.url.includes('/area'),
                },
            ]
        },
        {
            title: 'Layanan Utama',
            items: [
                { title: 'Pejabat Pengelola Informasi dan Dokumentasi', href: '/petugas/ppid', icon: ServerCog, isActive: page.url.startsWith('/petugas/ppid') },
                { title: 'Pendidikan Pemilih', href: '/petugas/pendidikan-pemilih', icon: ServerCog, isActive: page.url.startsWith('/petugas/pendidikan-pemilih') },
                { title: 'Pengaduan Masyarakat', href: '/petugas/pengaduan-masyarakat', icon: ServerCog, isActive: page.url.startsWith('/petugas/pengaduan-masyarakat') },
                { title: 'Kerja Sama', href: '/petugas/kerja-sama', icon: ServerCog, isActive: page.url.startsWith('/petugas/kerja-sama') },
                { title: 'Pemutakhiran Data Pemilih', href: '/petugas/mutarlih', icon: ServerCog, isActive: page.url.startsWith('/petugas/mutarlih') },
                { title: 'Pemutakhiran Data Parpol', href: '/petugas/muparpol', icon: ServerCog, isActive: page.url.startsWith('/petugas/muparpol') },
            ]
        },
        {
            title: 'Layanan Tambahan',
            items: [
                { title: 'Pengantaran Surat', href: '/petugas/pengantaran-surat', icon: BookOpenCheck, isActive: page.url.startsWith('/petugas/pengantaran-surat') },
                { title: 'Konsultasi', href: '/petugas/konsultasi', icon: BookOpenCheck, isActive: page.url.startsWith('/petugas/konsultasi') },
                { title: 'Pengaduan Pelayanan', href: '/petugas/pengaduan-pelayanan', icon: BookOpenCheck, isActive: page.url.startsWith('/petugas/pengaduan-pelayanan') },
            ]
        }
    ];

    const pimpinanNavGroups: NavGroup[] = [
        {
            title: 'Eksekutif',
            items: [
                {
                    title: 'Dashboard Pimpinan',
                    href: '/pimpinan/area',
                    icon: LayoutDashboard,
                    isActive: page.url === '/pimpinan/area' || page.url.includes('/area'),
                },
                {
                    title: 'Monitoring Layanan',
                    href: '/pimpinan/monitoring-layanan',
                    icon: ServerCog,
                    isActive: page.url.startsWith('/pimpinan/monitoring-layanan'),
                },
            ]
        },
        {
            title: 'Laporan & Riwayat',
            items: [
                {
                    title: 'Permohonan Layanan',
                    href: '/pimpinan/permohonan',
                    icon: BookOpenCheck,
                    isActive: page.url.startsWith('/pimpinan/permohonan'),
                },
                {
                    title: 'Laporan / Rekapitulasi',
                    href: '/pimpinan/laporan',
                    icon: PieChart,
                    isActive: page.url.startsWith('/pimpinan/laporan'),
                },
                {
                    title: 'Aktivitas / Riwayat',
                    href: '/pimpinan/aktivitas',
                    icon: ActivitySquare,
                    isActive: page.url.startsWith('/pimpinan/aktivitas'),
                },
            ]
        }
    ];

    const mainNavGroups = isPetugas ? petugasNavGroups : (isPimpinan ? pimpinanNavGroups : adminNavGroups);

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-800 bg-black text-white">
            <SidebarHeader className="border-b border-slate-800/80 pb-4 pt-4 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50 rounded-[10px]">
                            <Link href={dashboardUrl} prefetch className="flex items-center gap-3 w-full px-1">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-1 py-5">
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-800/80 p-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
