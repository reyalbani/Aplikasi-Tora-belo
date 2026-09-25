import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Activity, FileText, CheckCircle, Clock, XCircle, Users, Layers, BookOpen, MessageSquareHeart
} from 'lucide-react';

interface StatsProps {
    totalPermohonan: number;
    permohonanBaru: number;
    sedangDiproses: number;
    selesai: number;
    ditolak: number;
    totalLayanan: number;
    totalPengguna: number;
    totalBukuTamu: number;
    totalRespondenSKM: number;
}

export default function MonitoringIndex({ stats, statistikLayanan, trenWaktu, aktivitasTerbaru, filter }: any) {
    const [currentFilter, setCurrentFilter] = useState(filter);

    const handleFilterChange = (value: string) => {
        setCurrentFilter(value);
        router.get('/admin/monitoring', { filter: value }, {
            preserveState: true,
            replace: true
        });
    };

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['stats', 'statistikLayanan', 'trenWaktu', 'aktivitasTerbaru'] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Placeholder for charts since recharts might not be installed, using a simpler visual representation
    const maxTren = Math.max(...trenWaktu.map((t: any) => t.total), 1);
    const maxLayanan = Math.max(...statistikLayanan.map((l: any) => l.value), 1);

    return (
        <>
            <Head title="Monitoring & Laporan" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Monitoring & Laporan</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Pantau aktivitas sistem, statistik permohonan, dan laporan kinerja secara real-time.</p>
                    </div>
                    <div className="w-full sm:w-[200px]">
                        <Select value={currentFilter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="bg-card border-border">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Waktu</SelectItem>
                                <SelectItem value="today">Hari Ini</SelectItem>
                                <SelectItem value="month">Bulan Ini</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
                                    <FileText className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{stats.totalPermohonan}</span>
                                <span className="text-[13px] font-medium text-muted-foreground">Total Permohonan</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                                    <Activity className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{stats.permohonanBaru}</span>
                                <span className="text-[13px] font-medium text-muted-foreground">Permohonan Baru</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-50 text-amber-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{stats.sedangDiproses}</span>
                                <span className="text-[13px] font-medium text-muted-foreground">Sedang Diproses</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight">{stats.selesai}</span>
                                <span className="text-[13px] font-medium text-muted-foreground">Selesai</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-rose-50 text-rose-600">
                                    <XCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-rose-600 tracking-tight">{stats.ditolak}</span>
                                <span className="text-[13px] font-medium text-muted-foreground">Ditolak</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts & Trends */}
                    <Card className="lg:col-span-2 bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px] overflow-hidden">
                        <CardHeader className="border-b border-border">
                            <CardTitle>Tren Permohonan (7 Hari Terakhir)</CardTitle>
                            <CardDescription>Grafik jumlah permohonan yang masuk per hari</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-4">
                                {trenWaktu.map((t: any, idx: number) => {
                                    const heightPercent = (t.total / maxTren) * 100;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                                            <div className="w-full flex justify-center relative">
                                                <div 
                                                    className="w-full max-w-[40px] bg-[#b91c1c] rounded-t-md transition-all duration-300 group-hover:bg-[#991b1b]" 
                                                    style={{ height: `${heightPercent === 0 ? 2 : heightPercent}%`, minHeight: '4px' }}
                                                ></div>
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {t.total}
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground hidden sm:block">{t.name}</span>
                                            <span className="text-xs text-muted-foreground sm:hidden">{t.name.split(' ')[0]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Pengguna</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.totalPengguna}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Layanan</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.totalLayanan}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Buku Tamu</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.totalBukuTamu}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <MessageSquareHeart className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Responden SKM</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.totalRespondenSKM}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Statistik per Layanan */}
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardHeader className="border-b border-border">
                            <CardTitle>Statistik per Layanan</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {statistikLayanan.length > 0 ? (
                                    statistikLayanan.map((l: any, idx: number) => {
                                        const widthPercent = (l.value / maxLayanan) * 100;
                                        return (
                                            <div key={idx} className="p-4 sm:p-5 flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-foreground/80">{l.name}</span>
                                                    <span className="font-bold text-foreground">{l.value}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${widthPercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>Belum ada data statistik layanan.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terbaru */}
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardHeader className="border-b border-border">
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {aktivitasTerbaru.length > 0 ? (
                                    aktivitasTerbaru.map((act: any, idx: number) => (
                                        <div key={idx} className="p-4 sm:p-5 flex gap-4 items-start">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-muted/50 flex items-center justify-center border border-border">
                                                {act.status === 'Selesai' ? (
                                                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                                                ) : act.status === 'Ditolak' ? (
                                                    <XCircle className="h-5 w-5 text-rose-500" />
                                                ) : act.status === 'Menunggu' ? (
                                                    <Activity className="h-5 w-5 text-blue-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-[14px] text-foreground">{act.title}</span>
                                                <p className="text-[13px] text-muted-foreground leading-relaxed">{act.description}</p>
                                                <span className="text-[11px] font-medium text-muted-foreground/70 mt-1">{act.time}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>Belum ada aktivitas tercatat.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

MonitoringIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/area',
        },
        {
            title: 'Monitoring & Laporan',
            href: '/admin/monitoring',
        },
    ],
};
