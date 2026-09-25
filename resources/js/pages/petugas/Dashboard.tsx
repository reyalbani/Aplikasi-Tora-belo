import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle2, AlertCircle, XCircle, ArrowRight, Activity, Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Dashboard({ stats, aggregates, priorityTickets, recentActivities }: any) {
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

    const getServiceSlug = (namaLayanan: string) => {
        const map: Record<string, string> = {
            'Pejabat Pengelola Informasi dan Dokumentasi': 'ppid',
            'Layanan Pendidikan Pemilih': 'pendidikan-pemilih',
            'Layanan Pengaduan Masyarakat': 'pengaduan-masyarakat',
            'Layanan Kerjasama': 'kerja-sama',
            'Layanan Pemutakhiran Data Pemilih': 'mutarlih',
            'Layanan Pemutakhiran Data Partai Politik': 'muparpol',
            'Pengantaran Surat': 'pengantaran-surat',
            'Konsultasi': 'konsultasi',
            'Layanan Pengaduan Pelayanan': 'pengaduan-pelayanan'
        };
        return map[namaLayanan] || 'layanan';
    };

    return (
        <>
            <Head title="Dashboard Petugas - TORA BELO" />
            
            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-[#f8fafc]">
                
                {/* Header */}
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Petugas</h1>
                    <p className="text-sm text-slate-500">
                        Pantau dan tindak lanjuti seluruh permohonan layanan yang menjadi tanggung jawab Anda.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Total</span>
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Baru</span>
                                <Bell className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.baru}</span>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Diproses</span>
                                <Activity className="h-4 w-4 text-kpu-primary" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.diproses}</span>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Tertunda</span>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.menunggu_kelengkapan}</span>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Selesai</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.selesai}</span>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border">
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">Ditolak</span>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{stats.ditolak}</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Prioritas (2 columns) */}
                    <Card className="xl:col-span-2 shadow-sm border-border flex flex-col">
                        <CardHeader className="border-b border-border bg-white pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-900">Perlu Ditindaklanjuti</CardTitle>
                            <CardDescription>Permohonan baru atau yang membutuhkan kelengkapan</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {priorityTickets.length > 0 ? (
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-600">Tiket</TableHead>
                                            <TableHead className="font-semibold text-slate-600">Layanan</TableHead>
                                            <TableHead className="font-semibold text-slate-600">Pemohon</TableHead>
                                            <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-slate-600">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {priorityTickets.map((ticket: any) => (
                                            <TableRow key={ticket.id_permohonan} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-medium text-slate-900">{ticket.kode_tiket}</TableCell>
                                                <TableCell className="text-slate-600">{ticket.layanan?.nama_layanan}</TableCell>
                                                <TableCell className="text-slate-600">{ticket.masyarakat?.user?.name || '-'}</TableCell>
                                                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    {/* In a real app we'd map layout slug to route, assuming show exists */}
                                                    <Button variant="ghost" size="sm" asChild className="text-kpu-primary hover:text-white hover:bg-kpu-primary">
                                                        <Link href={`/petugas/${getServiceSlug(ticket.layanan?.nama_layanan)}/${ticket.id_permohonan}`}>
                                                            Lihat
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-8 text-center flex flex-col items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <p className="font-medium text-slate-900 mt-2">Semua Sudah Ditindaklanjuti</p>
                                    <p className="text-sm text-slate-500">Tidak ada permohonan yang perlu perhatian khusus saat ini.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Aktivitas (1 column) */}
                    <Card className="shadow-sm border-border flex flex-col">
                        <CardHeader className="border-b border-border bg-white pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto bg-slate-50/30">
                            {recentActivities.length > 0 ? (
                                <div className="flex flex-col">
                                    {recentActivities.map((log: any, idx: number) => (
                                        <div key={log.id} className="p-4 border-b border-border last:border-0 flex gap-3 hover:bg-white transition-colors">
                                            <div className="mt-0.5 h-2 w-2 rounded-full bg-kpu-primary shrink-0" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-900 leading-tight">{log.aktivitas}</p>
                                                <p className="text-xs text-slate-500">{log.user?.name} &bull; {formatDate(log.waktu)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-sm text-slate-500">
                                    Belum ada aktivitas
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 9 Services Summary Table */}
                <Card className="shadow-sm border-border">
                    <CardHeader className="border-b border-border bg-white pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">Ringkasan Layanan</CardTitle>
                        <CardDescription>Statistik permohonan untuk setiap jenis layanan</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-600">Layanan</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-600">Total</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-600">Baru</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-600">Diproses</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-600">Tertunda</TableHead>
                                    <TableHead className="text-center font-semibold text-slate-600">Selesai</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {aggregates.map((srv: any, idx: number) => (
                                    <TableRow key={idx} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium text-slate-900">{srv.name}</TableCell>
                                        <TableCell className="text-center font-semibold">{srv.total}</TableCell>
                                        <TableCell className="text-center text-blue-600">{srv.baru}</TableCell>
                                        <TableCell className="text-center text-kpu-primary">{srv.diproses}</TableCell>
                                        <TableCell className="text-center text-amber-600">{srv.tertunda}</TableCell>
                                        <TableCell className="text-center text-emerald-600">{srv.selesai}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}

Dashboard.layout = (page: any) => <AppLayout breadcrumbs={[{ title: 'Dashboard Petugas', href: '/petugas/area' }]}>{page}</AppLayout>;
