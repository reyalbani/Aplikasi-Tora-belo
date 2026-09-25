const fs = require('fs');
let code = fs.readFileSync('resources/js/components/app-sidebar.tsx', 'utf8');

const startMarker = "const mainNavGroups: NavGroup[] = [";
const endMarker = "    return (";

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `    const isPetugas = page.url.startsWith('/petugas');
    const isAdmin = page.url.startsWith('/admin');

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
                    title: 'Manajemen Layanan',
                    href: '/admin/services',
                    icon: ServerCog,
                },
                {
                    title: 'Manajemen Informasi',
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
                { title: 'Layanan PPID', href: '/petugas/ppid', icon: ServerCog, isActive: page.url.startsWith('/petugas/ppid') },
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

    const mainNavGroups = isPetugas ? petugasNavGroups : adminNavGroups;

`;

    const newCode = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('resources/js/components/app-sidebar.tsx', newCode);
    console.log("updated");
} else {
    console.log("markers not found");
}
