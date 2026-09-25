import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
    Search, Activity, CalendarDays, Users, RefreshCw, LayoutList, AlignLeft, LogIn, LogOut, ShieldAlert,
    UserPlus, FileEdit, Trash2, CheckCircle2, RotateCcw, Monitor, Settings, Eye, Clock, ListFilter
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Log {
    id_log: number;
    id_user: number | null;
    role: string | null;
    action: string | null;
    module: string | null;
    description: string | null;
    aktivitas: string | null;
    subject_type: string | null;
    subject_id: number | null;
    properties: any;
    ip_address: string | null;
    user_agent: string | null;
    waktu: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export default function ActivityLogsIndex({ logs, filters, summary }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/activity-logs', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/activity-logs', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true });
    };

    // Auto-refresh data every 10 seconds (light polling)
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['logs'] });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const resetFilters = () => {
        setSearch('');
        router.get('/admin/activity-logs', {}, { replace: true });
    };

    const openDetail = (log: Log) => {
        setSelectedLog(log);
        setIsDetailOpen(true);
    };

    // Deterministic formatting to avoid Hydration issues
    const formatDateTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Makassar',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(date) + ' WITA';
        } catch {
            return dateStr;
        }
    };

    const getActionIcon = (action: string | null, size = 16) => {
        if (!action) return <Activity size={size} />;
        const act = action.toLowerCase();
        if (act.includes('login')) return <LogIn size={size} className="text-emerald-500" />;
        if (act.includes('logout')) return <LogOut size={size} className="text-muted-foreground" />;
        if (act.includes('create') || act.includes('tambah')) return <UserPlus size={size} className="text-blue-500" />;
        if (act.includes('update') || act.includes('edit')) return <FileEdit size={size} className="text-amber-500" />;
        if (act.includes('delete') || act.includes('hapus')) return <Trash2 size={size} className="text-rose-500" />;
        if (act.includes('status')) return <CheckCircle2 size={size} className="text-indigo-500" />;
        if (act.includes('reset') || act.includes('password')) return <RotateCcw size={size} className="text-orange-500" />;
        if (act.includes('security')) return <ShieldAlert size={size} className="text-red-500" />;
        if (act.includes('setting')) return <Settings size={size} className="text-muted-foreground" />;
        return <Activity size={size} className="text-muted-foreground" />;
    };

    const FilterControls = () => (
        <div className="flex flex-col gap-3">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <Input 
                    placeholder="Cari aktivitas atau pengguna..." 
                    className="pl-9 bg-card border-border text-foreground h-10 w-full rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <Select value={filters.role || 'all'} onValueChange={(v) => handleFilterChange('role', v)}>
                <SelectTrigger className="w-full bg-card border-border h-10 rounded-lg">
                    <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Petugas">Petugas</SelectItem>
                    <SelectItem value="Pimpinan">Pimpinan</SelectItem>
                    <SelectItem value="User">Masyarakat</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.module || 'all'} onValueChange={(v) => handleFilterChange('module', v)}>
                <SelectTrigger className="w-full bg-card border-border h-10 rounded-lg">
                    <SelectValue placeholder="Semua Modul" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Modul</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Manajemen Pengguna">Manajemen Pengguna</SelectItem>
                    <SelectItem value="Layanan Publik">Layanan Publik</SelectItem>
                    <SelectItem value="Buku Tamu">Buku Tamu</SelectItem>
                    <SelectItem value="SKM">SKM</SelectItem>
                    <SelectItem value="Pengaturan">Pengaturan</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.date || 'all'} onValueChange={(v) => handleFilterChange('date', v)}>
                <SelectTrigger className="w-full bg-card border-border h-10 rounded-lg">
                    <SelectValue placeholder="Semua Waktu" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                    <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters} className="w-full border-border text-muted-foreground">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset Filter
            </Button>
        </div>
    );

    return (
        <>
            <Head title="Aktivitas / Log Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Aktivitas / Log Sistem</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Pantau seluruh aktivitas pengguna dan perubahan data yang terjadi di dalam sistem TORA BELO.</p>
                    </div>
                    <div className="flex items-center bg-card p-1 rounded-lg border border-border shadow-sm dark:shadow-none dark:shadow-none self-start sm:self-auto">
                        <button 
                            onClick={() => setViewMode('timeline')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                        >
                            <AlignLeft className="w-4 h-4" /> Timeline
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                        >
                            <LayoutList className="w-4 h-4" /> Table
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-4 lg:p-5 flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total Aktivitas</p>
                                <p className="text-xl lg:text-2xl font-bold text-foreground">{summary.total || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-4 lg:p-5 flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Aktivitas Hari Ini</p>
                                <p className="text-xl lg:text-2xl font-bold text-foreground">{summary.today || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-4 lg:p-5 flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Pengguna Aktif (Hari Ini)</p>
                                <p className="text-xl lg:text-2xl font-bold text-foreground">{summary.active_users || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px]">
                        <CardContent className="p-4 lg:p-5 flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Aktivitas Terakhir</p>
                                <p className="text-sm lg:text-md font-bold text-foreground truncate max-w-[120px] lg:max-w-[150px]">{summary.last_activity}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Filter Sidebar Desktop */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px] sticky top-6">
                            <CardHeader className="border-b border-border pb-4">
                                <CardTitle className="text-lg">Filter Log</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <FilterControls />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filter Mobile Sheet */}
                    <div className="lg:hidden w-full">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full bg-card border-border text-foreground/80">
                                    <ListFilter className="w-4 h-4 mr-2" /> Filter & Pencarian
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-[20px] h-[85vh]">
                                <SheetHeader className="border-b border-border pb-4 mb-4">
                                    <SheetTitle>Filter Log Sistem</SheetTitle>
                                </SheetHeader>
                                <FilterControls />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Main Content */}
                    <div className="w-full min-w-0">
                        <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px] overflow-hidden">
                            <CardContent className="p-0">
                                {logs.data.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                            <Activity className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground">Tidak ada aktivitas</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">Belum terdapat aktivitas sistem yang tercatat atau sesuai dengan filter Anda.</p>
                                    </div>
                                ) : (
                                    <>
                                        {viewMode === 'timeline' ? (
                                            <div className="p-6">
                                                <div className="relative border-l-2 border-border ml-3 md:ml-4 space-y-8 pb-4">
                                                    {logs.data.map((log: Log) => (
                                                        <div key={log.id_log} className="relative pl-6 md:pl-8">
                                                            <div className="absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-sm dark:shadow-none dark:shadow-none">
                                                                {getActionIcon(log.action, 14)}
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-foreground text-sm">{log.user?.name || 'Sistem / Guest'}</span>
                                                                    <Badge variant="outline" className="text-[10px] font-normal bg-muted/50 text-muted-foreground h-5 px-1.5">{log.role || 'Guest'}</Badge>
                                                                </div>
                                                                <div className="text-[12px] font-medium text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md inline-block self-start">
                                                                    {formatDateTime(log.waktu)}
                                                                </div>
                                                            </div>
                                                            <div 
                                                                className="bg-muted/50/50 hover:bg-muted/50 border border-border rounded-[10px] p-4 cursor-pointer transition-colors"
                                                                onClick={() => openDetail(log)}
                                                            >
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <span className="font-semibold text-[13px] text-indigo-600">{log.module || 'System'}</span>
                                                                    <span className="text-muted-foreground/50 text-xs">•</span>
                                                                    <span className="text-[13px] text-foreground/80 font-medium">{log.action || 'Action'}</span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mb-3">{log.description || log.aktivitas}</p>
                                                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground/70">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Monitor className="w-3.5 h-3.5" /> IP: {log.ip_address || '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-muted/50/80">
                                                        <TableRow className="border-b border-border hover:bg-muted/50/50">
                                                            <TableHead className="text-muted-foreground font-semibold h-11 whitespace-nowrap min-w-[150px]">Waktu</TableHead>
                                                            <TableHead className="text-muted-foreground font-semibold h-11 whitespace-nowrap">Pengguna</TableHead>
                                                            <TableHead className="text-muted-foreground font-semibold h-11 whitespace-nowrap">Modul</TableHead>
                                                            <TableHead className="text-muted-foreground font-semibold h-11 whitespace-nowrap">Aktivitas</TableHead>
                                                            <TableHead className="w-[80px] h-11 text-center whitespace-nowrap">Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {logs.data.map((log: Log) => (
                                                            <TableRow key={log.id_log} className="hover:bg-muted/50/50 border-b border-border transition-colors">
                                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {formatDateTime(log.waktu)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-foreground text-[13px]">{log.user?.name || 'Sistem / Guest'}</span>
                                                                        <span className="text-[11px] text-muted-foreground">{log.role || '-'}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="font-normal text-indigo-600 bg-indigo-50/50 border-indigo-100">
                                                                        {log.module || '-'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="max-w-[200px] lg:max-w-[300px]">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[13px] font-medium text-foreground">{log.action || '-'}</span>
                                                                        <span className="text-[12px] text-muted-foreground truncate">{log.description || log.aktivitas}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Button variant="ghost" size="sm" onClick={() => openDetail(log)} className="h-8 w-8 p-0 text-muted-foreground/70 hover:text-indigo-600">
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {logs.links && logs.links.length > 3 && (
                                            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/50/30">
                                                <div className="text-[13px] text-muted-foreground w-full text-center sm:text-left">
                                                    Menampilkan <span className="font-medium text-foreground">{logs.from || 0}</span> sampai <span className="font-medium text-foreground">{logs.to || 0}</span> dari <span className="font-medium text-foreground">{logs.total}</span> aktivitas
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {logs.links.map((link: any, index: number) => (
                                                        <Button
                                                            key={index}
                                                            variant={link.active ? "default" : "outline"}
                                                            size="sm"
                                                            className={`${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${link.active ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white border-[#b91c1c]' : 'text-muted-foreground bg-card hover:bg-muted/50 border-border'} h-8 px-3`}
                                                            disabled={!link.url}
                                                            onClick={() => handlePageChange(link.url)}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-card">
                    <div className="px-6 py-5 border-b border-border bg-muted/50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center">
                                {getActionIcon(selectedLog?.action || null, 18)}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-foreground">Detail Aktivitas</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">Log ID: #{selectedLog?.id_log}</DialogDescription>
                            </div>
                        </div>
                    </div>
                    
                    {selectedLog && (
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-6">
                                {/* User Info */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-3">Informasi Pengguna</h4>
                                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Nama</p>
                                                <p className="text-[14px] font-medium text-foreground">{selectedLog.user?.name || 'Sistem / Guest'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Role</p>
                                                <Badge variant="outline" className="font-normal bg-card text-foreground/80">{selectedLog.role || '-'}</Badge>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Email</p>
                                                <p className="text-[13px] text-foreground/80">{selectedLog.user?.email || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Waktu</p>
                                                <p className="text-[13px] text-foreground/80">{formatDateTime(selectedLog.waktu)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Info */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-3">Rincian Aktivitas</h4>
                                    <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Modul</p>
                                                <p className="text-[14px] font-medium text-indigo-600">{selectedLog.module || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] text-muted-foreground mb-1">Aksi</p>
                                                <p className="text-[14px] font-medium text-foreground">{selectedLog.action || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-muted-foreground mb-1">Deskripsi</p>
                                            <p className="text-[14px] text-foreground leading-relaxed">{selectedLog.description || selectedLog.aktivitas}</p>
                                        </div>
                                        
                                        {/* Properties / Changes if available */}
                                        {selectedLog.properties && Object.keys(selectedLog.properties).length > 0 && (
                                            <div className="pt-3 border-t border-border/60 mt-3">
                                                <p className="text-[12px] text-muted-foreground mb-2">Data Terkait / Perubahan:</p>
                                                <div className="bg-card border border-border rounded-lg p-3 overflow-x-auto">
                                                    <pre className="text-[11px] text-foreground/80 font-mono">
                                                        {JSON.stringify(selectedLog.properties, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Network Info */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-3">Informasi Jaringan</h4>
                                    <div className="bg-muted/50 rounded-xl p-4 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[12px] text-muted-foreground mb-1">IP Address</p>
                                            <p className="text-[13px] font-mono text-foreground/80">{selectedLog.ip_address || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-muted-foreground mb-1">Browser / Agent</p>
                                            <p className="text-[12px] text-muted-foreground break-all">{selectedLog.user_agent || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="px-6 py-4 border-t border-border bg-muted/50/50 flex justify-end">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';

ActivityLogsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Admin', href: '/admin/area' },
        { title: 'Aktivitas / Log Sistem', href: '/admin/activity-logs' },
    ]}>
        {page}
    </AppLayout>
);



