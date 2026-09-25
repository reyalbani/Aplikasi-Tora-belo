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
    Search, Users, Activity, CheckCircle, FileText, Calendar, Eye, MessageSquareHeart, Star, ThumbsUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface SkmItem {
    id: number;
    nama: string;
    email: string | null;
    nomor_hp: string | null;
    tanggal: string;
    jam_survei: string | null;
    nilai_akhir: number;
    saran: string | null;
    permohonan: { 
        kode_tiket: string;
        layanan: { nama_layanan: string } | null;
    } | null;
    jawaban: Array<{
        id: number;
        nilai: number | null;
        jawaban: string | null;
        pertanyaan: {
            pertanyaan: string;
            tipe: string;
        } | null;
    }>;
}

export default function SKMIndex({ skm, filters, statistics, rekapLayanan, layanans }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedItem, setSelectedItem] = useState<SkmItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/skm', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/skm', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true });
    };

    const openDetail = (item: SkmItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    return (
        <>
            <Head title="Survey Kepuasan Masyarakat (SKM)" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Survey Kepuasan Masyarakat (SKM)</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Lihat, kelola, dan analisis hasil penilaian masyarakat terhadap pelayanan.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Responden</p>
                                <Users className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.total_responden}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Survey</p>
                                <FileText className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.total_survey}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Nilai / Indeks SKM</p>
                                <Star className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.nilai_skm}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm dark:shadow-none dark:shadow-none bg-card overflow-hidden rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Rata-rata Kepuasan</p>
                                <ThumbsUp className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-foreground">{statistics.rata_kepuasan}</div>
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
                                        placeholder="Cari responden atau tiket..."
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
                                {skm.data.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {skm.data.map((item: SkmItem, index: number) => (
                                            <div key={item.id} className="p-4 flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-foreground">{item.nama || '-'}</p>
                                                        <p className="text-sm text-muted-foreground">Tiket: {item.permohonan?.kode_tiket || '-'}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-muted text-foreground/80 font-medium rounded-md whitespace-nowrap">
                                                        Nilai: {item.nilai_akhir}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Layanan</p>
                                                    <p className="text-sm text-foreground">{item.permohonan?.layanan?.nama_layanan || '-'}</p>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID', )}</span>
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
                                    <div className="p-12 flex flex-col items-center justify-center text-center">
                                        <MessageSquareHeart className="w-16 h-16 text-slate-200 mb-4" />
                                        <h3 className="text-lg font-medium text-foreground">Belum ada hasil survei</h3>
                                        <p className="text-muted-foreground mt-2 max-w-sm">Data survei kepuasan masyarakat masih kosong.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border bg-muted/50/50">
                                            <TableHead className="w-[50px] font-semibold text-muted-foreground">No</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Responden</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Layanan</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Nomor Tiket</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Tanggal</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Nilai</TableHead>
                                            <TableHead className="text-right font-semibold text-muted-foreground">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {skm.data.length > 0 ? (
                                            skm.data.map((item: SkmItem, index: number) => {
                                                const date = new Date(item.tanggal);
                                                return (
                                                    <TableRow key={item.id} className="group hover:bg-muted/50/80 border-border transition-colors">
                                                        <TableCell className="text-muted-foreground">
                                                            {skm.from + index}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium text-foreground">{item.nama || '-'}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-muted-foreground">{item.permohonan?.layanan?.nama_layanan || '-'}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-muted/50 text-foreground/80 border-border font-normal">
                                                                {item.permohonan?.kode_tiket || '-'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="bg-muted text-foreground/80 font-medium">
                                                                {item.nilai_akhir}
                                                            </Badge>
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
                                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <MessageSquareHeart className="w-12 h-12 text-slate-200 mb-3" />
                                                        <p>Belum ada hasil survei</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {skm.links && skm.links.length > 3 && (
                                <div className="p-4 border-t border-border flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground hidden sm:block">
                                        Menampilkan <span className="font-medium text-foreground">{skm.from}</span> sampai <span className="font-medium text-foreground">{skm.to}</span> dari <span className="font-medium text-foreground">{skm.total}</span> data
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {skm.links.map((link: any, index: number) => (
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
                                <CardDescription>Nilai SKM dan jumlah responden.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {rekapLayanan.length > 0 ? (
                                        rekapLayanan.map((layanan: any, index: number) => (
                                            <div key={index} className="flex flex-col space-y-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                                <span className="text-sm font-medium text-foreground/80">{layanan.nama}</span>
                                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                    <span>{layanan.jumlah} Responden</span>
                                                    <span className="font-semibold text-foreground/80 bg-muted px-2 py-0.5 rounded">Nilai: {layanan.nilai}</span>
                                                </div>
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card dark:bg-card border-border dark:border-border shadow-lg [&>button]:text-muted-foreground dark:[&>button]:text-muted-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-foreground dark:text-foreground">Detail Hasil SKM</DialogTitle>
                        <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
                            Informasi lengkap hasil survei kepuasan masyarakat.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-6 py-4">
                            {/* Info Responden */}
                            <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-3">
                                <h4 className="font-semibold text-sm text-foreground mb-2">Informasi Responden</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="font-medium text-xs text-muted-foreground">Nama</div>
                                        <div className="text-sm text-foreground">{selectedItem.nama || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-xs text-muted-foreground">Nomor HP / WhatsApp</div>
                                        <div className="text-sm text-foreground">{selectedItem.nomor_hp || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-xs text-muted-foreground">Email</div>
                                        <div className="text-sm text-foreground">{selectedItem.email || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Info Pelayanan */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4 border-b border-border pb-2">
                                    <div className="font-semibold text-sm text-muted-foreground">Layanan</div>
                                    <div className="col-span-2 text-sm text-foreground font-medium">{selectedItem.permohonan?.layanan?.nama_layanan || '-'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-border pb-2">
                                    <div className="font-semibold text-sm text-muted-foreground">Nomor Tiket</div>
                                    <div className="col-span-2 text-sm text-foreground">{selectedItem.permohonan?.kode_tiket || '-'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-border pb-2">
                                    <div className="font-semibold text-sm text-muted-foreground">Tanggal Survei</div>
                                    <div className="col-span-2 text-sm text-foreground">
                                        {new Date(selectedItem.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        {selectedItem.jam_survei ? ` ${selectedItem.jam_survei}` : ''}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-border pb-2">
                                    <div className="font-semibold text-sm text-muted-foreground">Nilai Akhir</div>
                                    <div className="col-span-2 text-sm font-bold text-indigo-600">{selectedItem.nilai_akhir}</div>
                                </div>
                            </div>
                            
                            {/* Jawaban */}
                            <div>
                                <h4 className="font-semibold text-sm text-foreground mb-3">Hasil Penilaian Indikator</h4>
                                <div className="space-y-3">
                                    {selectedItem.jawaban && selectedItem.jawaban.length > 0 ? (
                                        selectedItem.jawaban.map((j) => (
                                            <div key={j.id} className="bg-card border border-border p-3 rounded-md shadow-sm dark:shadow-none dark:shadow-none">
                                                <p className="text-sm font-medium text-foreground mb-2">{j.pertanyaan?.pertanyaan || '-'}</p>
                                                {j.pertanyaan?.tipe === 'rating' ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Nilai: {j.nilai}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{j.jawaban || '-'}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Tidak ada data penilaian.</p>
                                    )}
                                </div>
                            </div>

                            {/* Saran */}
                            {selectedItem.saran && (
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground mb-2">Kritik & Saran</h4>
                                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-md text-sm text-foreground italic">
                                        "{selectedItem.saran}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter className="mt-4 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => setIsDetailOpen(false)} className="bg-card dark:bg-card text-foreground/80 dark:text-foreground/80 border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50 hover:text-foreground dark:hover:text-foreground">
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SKMIndex.layout = {
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
            title: 'SKM',
            href: '/admin/skm',
        },
    ],
};
