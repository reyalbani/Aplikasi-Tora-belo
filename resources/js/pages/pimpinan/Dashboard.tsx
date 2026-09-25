import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Activity, BarChart3, PieChart as PieChartIcon, Users, MessageSquareHeart, ChevronLeft, ChevronRight, RotateCcw, Calendar, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard({ 
    dashboardStats = { total: 0, diproses: 0, selesai: 0, baru: 0, tertunda: 0, ditolak: 0, totalLayanan: 0, layananAktif: 0, layananNonAktif: 0 }, 
    serviceStats = [], 
    recentActivities = [], 
    attentionItems = [], 
    trendChartData = [],
    statusChartData = [],
    totalPeriodeAktif = 0,
    ringkasanLayanan = [],
    filters = {},
    lastUpdated = ''
}: any) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Local filter state
    const [period, setPeriod] = useState(filters.period || '12m');
    const [date, setDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'semua');

    // Trigger update
    const applyFilters = (newFilters: any) => {
        setIsLoading(true);
        router.get('/pimpinan/area', newFilters, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
        });
    };

    const handlePeriodChange = (val: string) => {
        setPeriod(val);
        // Reset date to today when switching periods, except for custom
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
        
        applyFilters({ period: val, date: today, start_date: startDate, end_date: endDate, status: statusFilter });
    };

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
        applyFilters({ period, date, start_date: startDate, end_date: endDate, status: val });
    };

    const handleDateNav = (direction: number) => {
        const d = new Date(date);
        if (period === 'hari') {
            d.setDate(d.getDate() + direction);
        } else if (period === 'minggu') {
            d.setDate(d.getDate() + (direction * 7));
        } else if (period === 'bulan') {
            d.setMonth(d.getMonth() + direction);
        }
        
        // Convert to YYYY-MM-DD
        // Ensure local timezone doesn't mess up the date string (use simple padding)
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const newDate = `${yyyy}-${mm}-${dd}`;
        
        setDate(newDate);
        applyFilters({ period, date: newDate, start_date: startDate, end_date: endDate, status: statusFilter });
    };

    const handleResetDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const newDate = `${yyyy}-${mm}-${dd}`;
        
        setDate(newDate);
        applyFilters({ period, date: newDate, start_date: startDate, end_date: endDate, status: statusFilter });
    };

    const handleCustomApply = () => {
        if (!startDate || !endDate) return;
        applyFilters({ period: 'custom', date, start_date: startDate, end_date: endDate, status: statusFilter });
    };

    const handleResetAll = () => {
        setPeriod('12m');
        setStatusFilter('semua');
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
        setStartDate('');
        setEndDate('');
        
        applyFilters({ period: '12m', date: today, status: 'semua' });
    };

    // Helper to format the displayed date range title
    const getPeriodDisplayTitle = () => {
        if (period === 'hari') {
            return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } else if (period === 'minggu') {
            // Rough approximation for title
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const startWeek = new Date(d.setDate(diff));
            const endWeek = new Date(startWeek);
            endWeek.setDate(endWeek.getDate() + 6);
            return `${startWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${endWeek.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        } else if (period === 'bulan') {
            return new Date(date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        } else if (period === '3m') {
            return '3 Bulan Terakhir';
        } else if (period === '6m') {
            return '6 Bulan Terakhir';
        } else if (period === '12m') {
            return '12 Bulan Terakhir';
        } else if (period === 'custom') {
            return `${startDate} s.d ${endDate}`;
        }
        return '';
    };

    return (
        <>
            <Head title="Dashboard Pimpinan" />
            <div className="flex flex-col gap-6 lg:gap-8 max-w-[1400px] w-full mx-auto pb-10 px-4 md:px-6 lg:px-8 mt-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Dashboard Eksekutif Pimpinan</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl">
                            Pantau secara langsung seluruh aktivitas permohonan layanan publik TORA BELO KPU Kota Palu.
                        </p>
                    </div>
                </div>

                {/* Stats Cards (Global All-Time State) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden group hover:border-kpu-primary/30 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-[12px] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all">
                                    <FileText className="h-6 w-6" strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-muted-foreground tracking-wide uppercase">Total Permohonan (Global)</span>
                                    <span className="text-3xl font-black text-foreground mt-1">{dashboardStats.total}</span>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 text-slate-100/50 group-hover:text-blue-50/50 group-hover:scale-110 transition-all duration-500 z-0 rotate-12">
                                <FileText className="w-32 h-32" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 rounded-[16px]">
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-muted-foreground tracking-wide uppercase">Sedang Diproses (Saat ini)</span>
                                    <span className="text-3xl font-black text-foreground mt-1">{dashboardStats.diproses}</span>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 text-slate-100/50 group-hover:text-amber-50/50 group-hover:scale-110 transition-all duration-500 z-0 rotate-12">
                                <RotateCcw className="w-32 h-32" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 rounded-[16px]">
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-muted-foreground tracking-wide uppercase">Selesai (Global)</span>
                                    <span className="text-3xl font-black text-foreground mt-1">{dashboardStats.selesai}</span>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 text-slate-100/50 group-hover:text-emerald-50/50 group-hover:scale-110 transition-all duration-500 z-0 rotate-12">
                                <CheckCircle2 className="w-32 h-32" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 rounded-[16px]">
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-semibold text-muted-foreground tracking-wide uppercase">Perlu Tindak Lanjut</span>
                                    <span className="text-3xl font-black text-foreground mt-1">{dashboardStats.tertunda}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column (Charts & Services) */}
                    <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                        {/* Interactive Charts Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h2 className="text-[18px] font-semibold text-foreground">Statistik Permohonan</h2>
                                    <p className="text-sm text-muted-foreground">Pantau lalu lintas dan status pelayanan.</p>
                                </div>
                            </div>

                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                <CardHeader className="border-b border-border/30 bg-muted/10 pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Filters */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Select value={period} onValueChange={handlePeriodChange}>
                                                <SelectTrigger className="w-[130px] h-9 text-xs bg-card">
                                                    <SelectValue placeholder="Periode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hari">Hari</SelectItem>
                                                    <SelectItem value="minggu">Minggu</SelectItem>
                                                    <SelectItem value="bulan">Bulan</SelectItem>
                                                    <SelectItem value="3m">3 Bulan Terakhir</SelectItem>
                                                    <SelectItem value="6m">6 Bulan Terakhir</SelectItem>
                                                    <SelectItem value="12m">12 Bulan Terakhir</SelectItem>
                                                    <SelectItem value="custom">Custom Range</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                                <SelectTrigger className="w-[140px] h-9 text-xs bg-card">
                                                    <SelectValue placeholder="Semua Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="semua">Semua Status</SelectItem>
                                                    <SelectItem value="Baru">Baru</SelectItem>
                                                    <SelectItem value="Diproses">Diproses</SelectItem>
                                                    <SelectItem value="Tertunda">Tertunda</SelectItem>
                                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            
                                            <Button variant="ghost" size="sm" onClick={handleResetAll} className="h-9 px-2 text-muted-foreground hover:text-foreground">
                                                <RotateCcw className="w-4 h-4 mr-1.5" />
                                                <span className="text-xs">Reset</span>
                                            </Button>
                                        </div>

                                        {/* Date Navigation */}
                                        {['hari', 'minggu', 'bulan'].includes(period) && (
                                            <div className="flex items-center gap-1 bg-card border border-border/50 rounded-md p-1 shadow-sm">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDateNav(-1)}>
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium" onClick={handleResetDate}>
                                                    {period === 'hari' ? 'Hari Ini' : period === 'minggu' ? 'Minggu Ini' : 'Bulan Ini'}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDateNav(1)}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}

                                        {/* Custom Range */}
                                        {period === 'custom' && (
                                            <div className="flex items-center gap-2">
                                                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 text-xs w-[130px]" />
                                                <span className="text-muted-foreground text-xs">-</span>
                                                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 text-xs w-[130px]" />
                                                <Button size="sm" onClick={handleCustomApply} className="h-9 bg-kpu-primary text-white hover:bg-kpu-primary/90">
                                                    Terapkan
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-kpu-primary" />
                                                Tren Permohonan
                                            </h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {getPeriodDisplayTitle()}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Periode Ini</span>
                                            <span className="text-2xl font-black text-foreground">{totalPeriodeAktif}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="h-[280px] w-full relative">
                                        {isLoading && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg">
                                                <Loader2 className="w-8 h-8 text-kpu-primary animate-spin mb-2" />
                                                <span className="text-sm font-medium text-foreground">Memuat data...</span>
                                            </div>
                                        )}
                                        
                                        {!isLoading && totalPeriodeAktif === 0 ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg">
                                                <FileText className="w-10 h-10 text-muted-foreground/30 mb-2" />
                                                Belum ada permohonan pada periode ini.
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#d2323a" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#d2323a" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                                    <RechartsTooltip 
                                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        labelFormatter={(value, payload) => {
                                                            if (payload && payload.length > 0 && payload[0].payload.full_date) {
                                                                return payload[0].payload.full_date;
                                                            }
                                                            return value;
                                                        }}
                                                    />
                                                    <Area type="monotone" dataKey="total" name="Jumlah" stroke="#d2323a" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Monitoring Layanan */}
                        {/* ... (Same as before) ... */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h2 className="text-[18px] font-semibold text-foreground">Monitoring Layanan</h2>
                                    <p className="text-sm text-muted-foreground">Status terkini seluruh layanan publik TORA BELO.</p>
                                </div>
                            </div>
                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                {serviceStats.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-muted/30">
                                                <TableRow className="hover:bg-transparent border-border/50">
                                                    <TableHead className="font-semibold text-foreground">Layanan</TableHead>
                                                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {serviceStats?.map((svc: any) => (
                                                    <TableRow key={svc.id} className="border-border/50 hover:bg-muted/20">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                                    <FileText className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[14px] font-semibold text-foreground">{svc.nama}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {svc.status === 'Aktif' ? (
                                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                                                    Aktif
                                                                </Badge>
                                                            ) : svc.status === 'Pemeliharaan' ? (
                                                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                                                    Pemeliharaan
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                                                    Tidak Aktif
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <CardContent className="p-8 text-center text-muted-foreground">Belum ada layanan yang terdaftar.</CardContent>
                                )}
                            </Card>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 lg:gap-8 pt-1">
                        
                        {/* Donut Chart */}
                        <div className="flex flex-col gap-4">
                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <PieChartIcon className="w-5 h-5 text-blue-500" />
                                        Status Global
                                    </CardTitle>
                                    <CardDescription>Distribusi seluruh permohonan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[220px] w-full mt-4 relative">
                                        {dashboardStats.total_permohonan > 0 ? (
                                            <>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={statusChartData}
                                                            cx="50%"
                                                            cy="45%"
                                                            innerRadius={55}
                                                            outerRadius={75}
                                                            paddingAngle={2}
                                                            dataKey="value"
                                                        >
                                                            {statusChartData?.map((entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))}
                                                        </Pie>
                                                        <RechartsTooltip 
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                                                        />
                                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }}/>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Total</span>
                                                    <span className="text-xl font-black">{dashboardStats.total_permohonan}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Belum ada data.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ringkasan Layanan */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[18px] font-semibold text-foreground px-1">Ringkasan Layanan</h2>
                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                <CardContent className="p-5 flex flex-col gap-4">
                                    {ringkasanLayanan?.length > 0 ? ringkasanLayanan.map((l: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-medium text-foreground truncate max-w-[200px]" title={l.nama}>{l.nama}</span>
                                                <span className="font-bold text-muted-foreground">{l.total}</span>
                                            </div>
                                            {l.persentase !== null && (
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-kpu-primary h-full rounded-full" style={{ width: `${l.persentase}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="text-center text-muted-foreground text-sm">Belum ada layanan.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Perlu Tindak Lanjut */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[18px] font-semibold text-foreground px-1">Perlu Tindak Lanjut</h2>
                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                {attentionItems?.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {attentionItems.map((item: any, idx: number) => (
                                            <div key={idx} className="p-4 hover:bg-muted/50 transition-colors flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[13px] font-bold text-foreground">{item.layanan} {item.kode ? `#${item.kode}` : ''}</span>
                                                    <span className="text-[11px] text-muted-foreground/70">{item.time}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                                                        <span className="text-[13px] text-muted-foreground">{item.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[160px]">
                                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-500">
                                            <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[15px] font-semibold text-foreground">Semua pekerjaan terkendali</h3>
                                        <p className="text-[14px] text-muted-foreground mt-1.5 max-w-[200px] leading-relaxed">
                                            Tidak ada pekerjaan yang membutuhkan tindak lanjut saat ini.
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </div>

                        {/* Aktivitas Terbaru */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[18px] font-semibold text-foreground px-1">Aktivitas Terbaru</h2>
                            <Card className="bg-card border-border/50 shadow-sm rounded-[16px] overflow-hidden">
                                {recentActivities?.length > 0 ? (
                                    <div className="p-5 flex flex-col gap-5">
                                        {recentActivities.map((activity: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 relative">
                                                {idx !== recentActivities.length - 1 && (
                                                    <div className="absolute left-4 top-8 bottom-[-20px] w-px bg-muted"></div>
                                                )}
                                                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 border border-border text-muted-foreground/70">
                                                    <Activity className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="flex flex-col gap-0.5 pt-1">
                                                    <span className="text-[14px] font-medium text-foreground">{activity.title}</span>
                                                    <span className="text-[13px] text-muted-foreground">Oleh {activity.actor}</span>
                                                    <span className="text-[11px] text-muted-foreground/70 mt-0.5">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[160px]">
                                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground/70 border border-border">
                                            <Activity className="h-5 w-5" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-[15px] font-semibold text-foreground">Belum ada aktivitas</h3>
                                        <p className="text-[14px] text-muted-foreground mt-1 max-w-[250px] leading-relaxed">
                                            Log pergerakan dokumen dan sistem akan muncul di sini.
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/area', // Fixed href to actual Admin dashboard route
        },
    ],
};
