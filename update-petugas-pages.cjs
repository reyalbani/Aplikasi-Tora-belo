const fs = require('fs');
const path = require('path');

const services = [
    { dir: 'PPID', title: 'Layanan PPID', baseUrl: '/petugas/ppid' },
    { dir: 'PendidikanPemilih', title: 'Pendidikan Pemilih', baseUrl: '/petugas/pendidikan-pemilih' },
    { dir: 'PengaduanMasyarakat', title: 'Pengaduan Masyarakat', baseUrl: '/petugas/pengaduan-masyarakat' },
    { dir: 'KerjaSama', title: 'Kerja Sama', baseUrl: '/petugas/kerja-sama' },
    { dir: 'Mutarlih', title: 'Pemutakhiran Data Pemilih', baseUrl: '/petugas/mutarlih' },
    { dir: 'Muparpol', title: 'Pemutakhiran Data Partai Politik', baseUrl: '/petugas/muparpol' },
    { dir: 'PengantaranSurat', title: 'Pengantaran Surat', baseUrl: '/petugas/pengantaran-surat' },
    { dir: 'Konsultasi', title: 'Konsultasi', baseUrl: '/petugas/konsultasi' },
    { dir: 'PengaduanPelayanan', title: 'Pengaduan Pelayanan', baseUrl: '/petugas/pengaduan-pelayanan' }
];

const getIndexContent = (title) => `import { Head, Link, router } from '@inertiajs/react';
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
        <AppLayout breadcrumbs={[{ title: '${title}', href: window.location.pathname }]}>
            <Head title="${title} - Petugas" />
            
            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-[#f8fafc]">
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">${title}</h1>
                    <p className="text-sm text-slate-500">
                        Kelola dan tindak lanjuti permohonan layanan ${title}.
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
                                                <Link href={\`\${window.location.pathname}/\${item.id_permohonan}\`}>
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
                                    className={\`px-4 py-2 text-sm rounded-md border \${link.active ? 'bg-kpu-primary text-white border-kpu-primary' : 'bg-white text-slate-700 hover:bg-slate-50'} \${!link.url && 'opacity-50 cursor-not-allowed'}\`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
`;

const getShowContent = (title, baseUrl) => `import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Clock, FileText, User, Info, Save, FileUp, ListChecks } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function Show({ permohonan }: any) {
    const { data, setData, post, processing, errors } = useForm({
        status: permohonan.status,
        keterangan: '',
        dokumen_lampiran: null as File | null,
        _method: 'POST'
    });

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

    let isiPermohonan = {};
    try {
        isiPermohonan = JSON.parse(permohonan.isi_permohonan || '{}');
    } catch (e) {}

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(\`${baseUrl}/\${permohonan.id_permohonan}/status\`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status berhasil diperbarui');
                setData('keterangan', '');
                setData('dokumen_lampiran', null);
            },
            onError: () => toast.error('Gagal memperbarui status')
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: '${title}', href: '${baseUrl}' },
            { title: \`Detail \${permohonan.kode_tiket}\`, href: '#' }
        ]}>
            <Head title={\`Detail \${permohonan.kode_tiket} - SIPADU\`} />
            
            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 bg-[#f8fafc]">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" asChild className="rounded-full bg-white">
                            <Link href="${baseUrl}"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                                {permohonan.kode_tiket}
                                {getStatusBadge(permohonan.status)}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Diajukan pada {formatDate(permohonan.created_at)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column: Details */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        
                        {/* Informasi Permohonan Dinamis */}
                        <Card className="shadow-sm border-border bg-white overflow-hidden">
                            <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Info className="h-5 w-5 text-slate-400" /> Informasi Permohonan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border">
                                    {Object.entries(isiPermohonan).length > 0 ? Object.entries(isiPermohonan).map(([key, value]: any, idx) => (
                                        <div key={idx} className="p-4 flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-medium text-slate-900 break-words">{value || '-'}</span>
                                        </div>
                                    )) : (
                                        <div className="p-8 col-span-2 text-center text-slate-500 text-sm">Tidak ada detail khusus.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dokumen Lampiran */}
                        <Card className="shadow-sm border-border bg-white overflow-hidden">
                            <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-slate-400" /> Dokumen Lampiran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {permohonan.dokumen_permohonan?.length > 0 ? (
                                    <div className="divide-y border-border">
                                        {permohonan.dokumen_permohonan.map((doc: any, i: number) => (
                                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-slate-900">{doc.nama_file}</span>
                                                    <span className="text-xs text-slate-500">{doc.jenis_dokumen} &bull; {formatDate(doc.created_at)}</span>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={\`/\${doc.path_file}\`} target="_blank" rel="noopener noreferrer">Unduh</a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500 text-sm">Tidak ada dokumen terlampir.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Actions & Timeline & Applicant */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Aksi Petugas */}
                        <Card className="shadow-sm border-kpu-primary/20 bg-white">
                            <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <ListChecks className="h-5 w-5 text-kpu-primary" /> Tindak Lanjut
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <Label>Ubah Status</Label>
                                        <select 
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="Baru">Baru</option>
                                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                            <option value="Diproses">Diproses</option>
                                            <option value="Menunggu Kelengkapan">Menunggu Kelengkapan</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Ditolak">Ditolak</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Catatan (Opsional)</Label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="Tambahkan catatan tindak lanjut..."
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Upload Dokumen Balasan (Opsional)</Label>
                                        <Input 
                                            type="file" 
                                            onChange={(e) => setData('dokumen_lampiran', e.target.files ? e.target.files[0] : null)}
                                        />
                                        <p className="text-[11px] text-slate-500">Maks. 10MB (PDF/JPG/PNG/DOCX)</p>
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full bg-kpu-primary hover:bg-kpu-primary/90 text-white mt-2">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Informasi Pemohon */}
                        <Card className="shadow-sm border-border bg-white">
                            <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5 text-slate-400" /> Pemohon
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Nama Lengkap</p>
                                    <p className="text-sm font-medium text-slate-900">{permohonan.masyarakat?.user?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                                    <p className="text-sm font-medium text-slate-900">{permohonan.masyarakat?.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">No. Telepon / WhatsApp</p>
                                    <p className="text-sm font-medium text-slate-900">{permohonan.masyarakat?.no_telepon || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">NIK</p>
                                    <p className="text-sm font-medium text-slate-900">{permohonan.masyarakat?.nik || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Riwayat Penanganan */}
                        <Card className="shadow-sm border-border bg-white">
                            <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-slate-400" /> Riwayat Penanganan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 max-h-[400px] overflow-y-auto">
                                <div className="relative border-l-2 border-slate-100 ml-3 flex flex-col gap-6">
                                    {permohonan.status_permohonan?.length > 0 ? permohonan.status_permohonan.map((history: any, idx: number) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute w-3 h-3 bg-kpu-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-slate-900">{history.status}</span>
                                                <span className="text-xs text-slate-500">{formatDate(history.waktu)}</span>
                                                {history.keterangan && (
                                                    <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-md mt-1 border border-slate-100">{history.keterangan}</p>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-sm text-slate-500 ml-4">Belum ada riwayat.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
`;

services.forEach(srv => {
    const dirPath = path.join(__dirname, 'resources', 'js', 'pages', 'petugas', srv.dir);
    
    // Ensure dir exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write Index
    fs.writeFileSync(path.join(dirPath, 'Index.tsx'), getIndexContent(srv.title));
    
    // Write Show
    fs.writeFileSync(path.join(dirPath, 'Show.tsx'), getShowContent(srv.title, srv.baseUrl));
});

console.log('Successfully updated all Petugas services pages!');
