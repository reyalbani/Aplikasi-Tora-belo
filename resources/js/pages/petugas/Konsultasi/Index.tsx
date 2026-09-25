import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCcw, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';

export default function Index({ permohonan, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(window.location.pathname, { search, status }, { preserveState: true, preserveScroll: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Baru': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Baru</Badge>;
            case 'Menunggu Verifikasi': return <Badge variant="outline" className="text-amber-600 border-amber-600">Verifikasi</Badge>;
            case 'Diproses': return <Badge variant="default" className="bg-kpu-primary hover:bg-kpu-primary/90">Diproses</Badge>;
            case 'Menunggu Kelengkapan': return <Badge variant="outline" className="text-amber-600 border-amber-600">Menunggu Lengkap</Badge>;
            case 'Selesai': return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Selesai</Badge>;
            case 'Ditolak': return <Badge variant="destructive">Ditolak</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Konsultasi - Petugas" />
            
            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-[#f8fafc]">
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Konsultasi</h1>
                    <p className="text-sm text-slate-500">
                        Kelola dan tindak lanjuti permohonan layanan Konsultasi.
                    </p>
                </div>

                <Card className="shadow-sm border-border">
                    <CardHeader className="bg-white border-b border-border pb-4">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    type="text" 
                                    placeholder="Cari kode tiket atau pemohon..." 
                                    className="pl-9 bg-slate-50"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <select 
                                    className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Baru">Baru</option>
                                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Menunggu Kelengkapan">Menunggu Kelengkapan</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                                <Button type="submit" className="bg-kpu-primary hover:bg-kpu-primary/90 text-white shrink-0">
                                    <Filter className="h-4 w-4 mr-2" /> Filter
                                </Button>
                                <Button type="button" variant="outline" onClick={handleReset} className="shrink-0">
                                    <RefreshCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-600 py-4 px-6">No. Tiket</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Tanggal</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Pemohon</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600 px-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permohonan.data.length > 0 ? permohonan.data.map((item: any) => (
                                    <TableRow key={item.id_permohonan} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium text-slate-900 px-6">{item.kode_tiket}</TableCell>
                                        <TableCell className="text-slate-600">{formatDate(item.created_at)}</TableCell>
                                        <TableCell className="text-slate-600">{item.masyarakat?.user?.name || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right px-6">
                                            <Button variant="ghost" size="sm" asChild className="text-kpu-primary hover:text-white hover:bg-kpu-primary">
                                                <Link href={`${window.location.pathname}/${item.id_permohonan}`}>
                                                    Lihat Detail
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Filter className="h-6 w-6" />
                                                </div>
                                                <p className="font-medium text-slate-900 mt-2">Tidak ada data permohonan</p>
                                                <p className="text-sm">Silakan ubah filter atau kata kunci pencarian.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                {/* Pagination */}
                {permohonan.links && permohonan.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-1">
                            {permohonan.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-sm rounded-md border ${link.active ? 'bg-kpu-primary text-white border-kpu-primary' : 'bg-white text-slate-700 hover:bg-slate-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: any) => <AppLayout breadcrumbs={[{ title: 'Konsultasi', href: '#' }]}>{page}</AppLayout>;
