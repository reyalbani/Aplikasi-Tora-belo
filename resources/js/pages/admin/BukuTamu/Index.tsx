import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Search, Users, Activity, CheckCircle, FileText, Calendar, Eye 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface BukuTamuItem {
    id_buku_tamu: number;
    nama: string;
    instansi: string | null;
    keperluan: string | null;
    tanggal: string;
    layanan: { nama_layanan: string } | null;
    nomor_whatsapp: string | null;
    email: string | null;
}

export default function BukuTamuIndex({ bukuTamu, filters, statistics, rekapLayanan, layanans }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedItem, setSelectedItem] = useState<BukuTamuItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/buku-tamu', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/buku-tamu', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true });
    };

    const openDetail = (item: BukuTamuItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    return (
        <>
            <Head title="Data Buku Tamu" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Data Buku Tamu</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Kelola dan pantau data kunjungan masyarakat pada seluruh layanan TORA BELO.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Kunjungan</p>
                                <Users className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Kunjungan Hari Ini</p>
                                <Activity className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.hari_ini}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Kunjungan Bulan Ini</p>
                                <Calendar className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.bulan_ini}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Layanan Digunakan</p>
                                <FileText className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.layanan_digunakan}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card rounded-[12px] sm:rounded-[16px] lg:col-span-3">
                        <CardHeader className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                                    <Input
                                        placeholder="Cari pengunjung..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 h-10 w-full bg-muted/50 border-border focus:bg-card transition-colors rounded-lg"
                                    />
                                </div>
                                <Select value={filters.layanan_id || 'all'} onValueChange={(value) => handleFilterChange('layanan_id', value)}>
                                    <SelectTrigger className="w-full sm:w-[200px] h-10 bg-muted/50 border-border">
                                        <SelectValue placeholder="Semua Layanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Layanan</SelectItem>
                                        {layanans.map((l: any) => (
                                            <SelectItem key={l.id_layanan} value={l.id_layanan.toString()}>{l.nama_layanan}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.periode || 'all'} onValueChange={(value) => handleFilterChange('periode', value)}>
                                    <SelectTrigger className="w-full sm:w-[150px] h-10 bg-muted/50 border-border">
                                        <SelectValue placeholder="Semua Waktu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Waktu</SelectItem>
                                        <SelectItem value="hari_ini">Hari Ini</SelectItem>
                                        <SelectItem value="minggu_ini">Minggu Ini</SelectItem>
                                        <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Mobile View */}
                            <div className="block md:hidden">
                                {bukuTamu.data.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {bukuTamu.data.map((item: BukuTamuItem, index: number) => (
                                            <div key={item.id_buku_tamu} className="p-4 flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-foreground">{item.nama}</p>
                                                        <p className="text-sm text-muted-foreground">{item.instansi || '-'}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-muted text-foreground/80 font-medium rounded-md whitespace-nowrap">
                                                        {new Date(item.tanggal).toLocaleDateString('id-ID', )}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Layanan</p>
                                                    <p className="text-sm text-foreground">{item.layanan?.nama_layanan || '-'}</p>
                                                </div>
                                                <div className="flex items-center mt-3">
                                                    <Button variant="outline" size="sm" onClick={() => openDetail(item)} className="w-full text-blue-600 bg-card border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none active:bg-blue-100 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none dark:shadow-none">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Lihat Detail
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>Belum ada data Buku Tamu</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border bg-muted/50/50">
                                            <TableHead className="w-[50px] font-semibold text-muted-foreground">No</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Nama Pengunjung</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Instansi / Asal</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Layanan</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Tanggal</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Waktu</TableHead>
                                            <TableHead className="text-right font-semibold text-muted-foreground">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bukuTamu.data.length > 0 ? (
                                            bukuTamu.data.map((item: BukuTamuItem, index: number) => {
                                                const date = new Date(item.tanggal);
                                                return (
                                                    <TableRow key={item.id_buku_tamu} className="group hover:bg-muted/50/80 border-border transition-colors">
                                                        <TableCell className="text-muted-foreground">
                                                            {bukuTamu.from + index}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium text-foreground">{item.nama}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-muted-foreground">{item.instansi || '-'}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-muted/50 text-foreground/80 border-border font-normal">
                                                                {item.layanan?.nama_layanan || '-'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="outline" size="sm" onClick={() => openDetail(item)} className="text-blue-600 bg-card border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none active:bg-blue-100 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none dark:shadow-none">
                                                                <Eye className="w-4 h-4 mr-2 hidden lg:inline-block" />
                                                                Lihat Detail
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    Belum ada data Buku Tamu
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {bukuTamu.links && bukuTamu.links.length > 3 && (
                                <div className="p-4 border-t border-border flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground hidden sm:block">
                                        Menampilkan <span className="font-medium text-foreground">{bukuTamu.from}</span> sampai <span className="font-medium text-foreground">{bukuTamu.to}</span> dari <span className="font-medium text-foreground">{bukuTamu.total}</span> data
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {bukuTamu.links.map((link: any, index: number) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                className={`${!link.url ? 'opacity-50 cursor-not-allowed' : ''} ${link.active ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-muted-foreground bg-card hover:bg-muted/50 border-border'}`}
                                                disabled={!link.url}
                                                onClick={() => handlePageChange(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rekap per Layanan */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card rounded-[12px] sm:rounded-[16px]">
                            <CardHeader className="p-6 border-b border-border pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">Rekap per Layanan</CardTitle>
                                <CardDescription>Total kunjungan setiap layanan.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {rekapLayanan.length > 0 ? (
                                        rekapLayanan.map((layanan: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">{layanan.nama}</span>
                                                <Badge variant="secondary" className="bg-muted text-foreground">
                                                    {layanan.jumlah}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center">Belum ada data rekap.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Detail */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card dark:bg-card border-border dark:border-border shadow-lg [&>button]:text-muted-foreground dark:[&>button]:text-muted-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-foreground dark:text-foreground">Detail Buku Tamu</DialogTitle>
                        <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
                            Informasi lengkap kunjungan tamu.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Nama</div>
                                <div className="col-span-2 text-sm text-foreground">{selectedItem.nama}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Instansi / Asal</div>
                                <div className="col-span-2 text-sm text-foreground">{selectedItem.instansi || '-'}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Layanan</div>
                                <div className="col-span-2 text-sm text-foreground">{selectedItem.layanan?.nama_layanan || '-'}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Tanggal & Waktu</div>
                                <div className="col-span-2 text-sm text-foreground">
                                    {new Date(selectedItem.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            {(selectedItem.nomor_whatsapp || selectedItem.email) && (
                                <>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="font-semibold text-sm text-muted-foreground">WhatsApp</div>
                                        <div className="col-span-2 text-sm text-foreground">{selectedItem.nomor_whatsapp || '-'}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="font-semibold text-sm text-muted-foreground">Email</div>
                                        <div className="col-span-2 text-sm text-foreground">{selectedItem.email || '-'}</div>
                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-semibold text-sm text-muted-foreground">Keperluan</div>
                                <div className="col-span-2 text-sm text-foreground bg-muted/50 p-3 rounded-md border border-border">
                                    {selectedItem.keperluan || '-'}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDetailOpen(false)} className="bg-card dark:bg-card text-foreground/80 dark:text-foreground/80 border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50 hover:text-foreground dark:hover:text-foreground">
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

BukuTamuIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/area',
        },
        {
            title: 'Layanan',
            href: '#',
        },
        {
            title: 'Buku Tamu',
            href: '/admin/buku-tamu',
        },
    ],
};
