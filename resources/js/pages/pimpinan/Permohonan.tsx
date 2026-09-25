import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Eye, BookOpenCheck, Loader2, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function PermohonanLayanan({ permohonan, layananList, filters }: any) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [detailError, setDetailError] = useState<string | null>(null);

    const openDetail = async (id: number) => {
        setIsDetailOpen(true);
        setIsLoading(true);
        setDetailData(null);
        setDetailError(null);
        
        try {
            const response = await fetch(`/pimpinan/permohonan/${id}/api`, {
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('404');
                }
                throw new Error('Gagal');
            }
            
            const data = await response.json();
            setDetailData(data.data);
        } catch (error: any) {
            if (error.message === '404') {
                setDetailError('Permohonan tidak ditemukan.');
            } else {
                setDetailError('Gagal memuat detail permohonan.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search');
        router.get('/pimpinan/permohonan', { ...filters, search, page: 1 }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/pimpinan/permohonan', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <>
            <Head title="Permohonan Layanan" />
            <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-10 px-4 md:px-6 mt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Permohonan Layanan</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl">
                            Daftar seluruh permohonan layanan publik masuk ke TORA BELO.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2 text-lg"><BookOpenCheck className="h-5 w-5"/> Data Permohonan</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="text" name="search" placeholder="Cari tiket/nama..." defaultValue={filters.search} className="pl-9" />
                            </form>
                            <Select defaultValue={filters.layanan || 'semua'} onValueChange={(v) => handleFilterChange('layanan', v)}>
                                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Layanan" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Layanan</SelectItem>
                                    {layananList?.map((l: any) => (
                                        <SelectItem key={l.id_layanan} value={l.id_layanan.toString()}>{l.nama_layanan}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select defaultValue={filters.status || 'semua'} onValueChange={(v) => handleFilterChange('status', v)}>
                                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Status</SelectItem>
                                    <SelectItem value="Baru">Baru</SelectItem>
                                    <SelectItem value="Diproses">Diproses</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                    <SelectItem value="Menunggu Verifikasi">Menunggu Verifikasi</SelectItem>
                                    <SelectItem value="Menunggu Kelengkapan">Menunggu Kelengkapan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 w-[180px]">No Tiket</TableHead>
                                        <TableHead>Pemohon</TableHead>
                                        <TableHead>Layanan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal Masuk</TableHead>
                                        <TableHead className="text-right pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permohonan?.data?.length > 0 ? permohonan.data.map((item: any) => (
                                        <TableRow key={item.id_permohonan}>
                                            <TableCell className="pl-6 font-medium">{item.kode_tiket}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{item.masyarakat?.nama_lengkap || '-'}</div>
                                                <div className="text-xs text-muted-foreground">{item.masyarakat?.nik || '-'}</div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={item.layanan?.nama_layanan}>
                                                {item.layanan?.nama_layanan || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={
                                                    item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                                    item.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(item.created_at).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => openDetail(item.id_permohonan)}>
                                                    <Eye className="w-4 h-4"/> Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Data permohonan tidak ditemukan</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {permohonan.links && permohonan.total > permohonan.per_page && (
                            <div className="p-4 border-t flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {permohonan.from || 0} - {permohonan.to || 0} dari {permohonan.total} data
                                </div>
                                <div className="flex gap-1">
                                    {permohonan?.links?.map((link: any, i: number) => (
                                        <Button 
                                            key={i} 
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                        <DialogTitle>Detail Permohonan</DialogTitle>
                        <DialogDescription>
                            {detailData ? `Tiket #${detailData.kode_tiket}` : 'Memuat informasi tiket...'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="px-6 py-4">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p>Memuat detail permohonan...</p>
                            </div>
                        )}
                        
                        {!isLoading && detailError && (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                                <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
                                <p className="text-destructive font-medium">{detailError}</p>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="mt-4">Tutup</Button>
                            </div>
                        )}
                        
                        {!isLoading && !detailError && detailData && (
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Nomor Tiket</p>
                                        <p className="text-sm font-semibold">{detailData.kode_tiket}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Layanan</p>
                                        <p className="text-sm">{detailData.layanan?.nama_layanan || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Tanggal Masuk</p>
                                        <p className="text-sm">{new Date(detailData.created_at).toLocaleString('id-ID')} WITA</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Status Saat Ini</p>
                                        <Badge variant="secondary" className={
                                            detailData.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                            detailData.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                            detailData.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }>
                                            {detailData.status}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><User className="w-4 h-4"/> Data Pemohon</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nama Lengkap</p>
                                            <p className="text-sm">{detailData.masyarakat?.nama_lengkap || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">NIK</p>
                                            <p className="text-sm">{detailData.masyarakat?.nik || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nomor HP</p>
                                            <p className="text-sm">{detailData.masyarakat?.no_hp || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Email</p>
                                            <p className="text-sm">{detailData.masyarakat?.user?.email || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><FileText className="w-4 h-4"/> Isi Permohonan</h4>
                                    <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                                        {typeof detailData.isi_permohonan === 'string' && detailData.isi_permohonan.startsWith('{') 
                                            ? Object.entries(JSON.parse(detailData.isi_permohonan)).map(([k, v]) => (
                                                <div key={k} className="mb-2 last:mb-0">
                                                    <span className="font-medium block mb-0.5 capitalize">{k.replace(/_/g, ' ')}:</span>
                                                    <span>{String(v)}</span>
                                                </div>
                                            ))
                                            : (detailData.isi_permohonan || 'Tidak ada isi permohonan')
                                        }
                                    </div>
                                </div>
                                
                                {detailData.dokumen_permohonan && detailData.dokumen_permohonan.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3">Dokumen Lampiran</h4>
                                        <div className="flex flex-col gap-4">
                                            {detailData.dokumen_permohonan.map((dok: any) => {
                                                const lampiranUrl = `/pimpinan/permohonan/${detailData.id_permohonan}/lampiran/${dok.id_dokumen}`;
                                                const fileName = dok.nama_file || dok.nama_dokumen || 'Dokumen Lampiran';
                                                const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
                                                
                                                return (
                                                    <div key={dok.id_dokumen} className="flex flex-col gap-2 p-4 border rounded-md">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                                                                <span className="text-sm font-medium">{fileName}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <a href={lampiranUrl} target="_blank" rel="noreferrer">
                                                                    <Button size="sm" variant="outline">Lihat</Button>
                                                                </a>
                                                                <a href={`${lampiranUrl}?download=1`} download>
                                                                    <Button size="sm">Download</Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        {isImage && (
                                                            <div className="mt-2 flex justify-center bg-muted/30 rounded p-2">
                                                                <img src={lampiranUrl} alt={fileName} className="max-h-64 object-contain rounded border" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><CheckCircle2 className="w-4 h-4"/> Riwayat Status</h4>
                                    <div className="space-y-4">
                                        {detailData.status_permohonan?.length > 0 ? (
                                            detailData.status_permohonan.map((s: any, i: number) => (
                                                <div key={s.id_status} className="flex gap-3">
                                                    <div className="mt-1 relative flex-none">
                                                        <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                                        {i !== detailData.status_permohonan.length - 1 && (
                                                            <div className="absolute top-3 bottom-0 left-1 w-px -ml-px bg-border h-full -mb-4" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{s.status}</span>
                                                        <span className="text-xs text-muted-foreground">{new Date(s.waktu || s.created_at).toLocaleString('id-ID')} WITA</span>
                                                        {s.keterangan && <span className="text-xs mt-1 italic">{s.keterangan}</span>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Belum ada riwayat status.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="px-6 py-4 border-t bg-muted/50 flex justify-end sticky bottom-0 z-10">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

PermohonanLayanan.layout = {
    breadcrumbs: [
        {
            title: 'Permohonan Layanan',
            href: '/pimpinan/permohonan',
        },
    ],
};
