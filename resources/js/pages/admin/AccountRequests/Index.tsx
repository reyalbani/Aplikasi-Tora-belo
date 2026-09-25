import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    requests: any;
    filters: any;
    summary: any;
};

export default function AccountRequestsIndex({ requests, filters, summary }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const rejectForm = useForm({
        rejection_reason: ''
    });

    const handleFilter = (key: string, value: string) => {
        router.get('/admin/account-requests', { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    const onSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFilter('search', search);
        }
    };

    const openDetail = (req: any) => {
        setSelectedRequest(req);
        setIsDetailOpen(true);
    };

    const approve = (req: any) => {
        if (req?.id && confirm(`Setujui permohonan dari ${req.nama_lengkap}?`)) {
            router.post(`/admin/account-requests/${req.id}/approve`, {}, {
                preserveScroll: true,
                onSuccess: () => setIsDetailOpen(false)
            });
        }
    };

    const openReject = (req: any) => {
        setSelectedRequest(req);
        rejectForm.setData('rejection_reason', '');
        rejectForm.clearErrors();
        setIsRejectOpen(true);
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest?.id) return;
        rejectForm.post(`/admin/account-requests/${selectedRequest.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRejectOpen(false);
                setIsDetailOpen(false);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Menunggu</Badge>;
            case 'reviewing': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Diverifikasi</Badge>;
            case 'approved': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Disetujui</Badge>;
            case 'rejected': return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">Ditolak</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Permohonan Akun" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Permohonan Akun</h1>
                        <p className="text-[15px] text-muted-foreground">Kelola pengajuan akun dari publik.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-[10px] bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div></div>
                            <div><span className="text-2xl font-bold">{summary.pending}</span><p className="text-sm text-muted-foreground">Menunggu Verifikasi</p></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-[10px] bg-blue-50 flex items-center justify-center"><Search className="w-5 h-5 text-blue-600" /></div></div>
                            <div><span className="text-2xl font-bold">{summary.reviewing}</span><p className="text-sm text-muted-foreground">Sedang Diverifikasi</p></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-[10px] bg-emerald-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-600" /></div></div>
                            <div><span className="text-2xl font-bold">{summary.approved}</span><p className="text-sm text-muted-foreground">Disetujui</p></div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-[10px] bg-rose-50 flex items-center justify-center"><XCircle className="w-5 h-5 text-rose-600" /></div></div>
                            <div><span className="text-2xl font-bold">{summary.rejected}</span><p className="text-sm text-muted-foreground">Ditolak</p></div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border/50">
                    <CardHeader className="p-4 border-b border-border/80 flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari nama, email, kode..." 
                                className="pl-9 h-10"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={onSearch}
                            />
                        </div>
                        <Select value={filters.status || 'all'} onValueChange={v => handleFilter('status', v === 'all' ? '' : v)}>
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                                <SelectItem value="reviewing">Sedang Diverifikasi</SelectItem>
                                <SelectItem value="approved">Disetujui</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Kode / Nama</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Akses Dimohon</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Tanggal</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12">Status</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground h-12 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.length > 0 ? requests.data.map((req: any, i: number) => (
                                    <TableRow key={req?.id || i}>
                                        <TableCell>
                                            <div className="font-semibold text-foreground">{req.request_code}</div>
                                            <div className="text-sm text-muted-foreground">{req.nama_lengkap}</div>
                                        </TableCell>
                                        <TableCell className="capitalize font-medium">{req.requested_role}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(req.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => openDetail(req)}>
                                                <Eye className="w-4 h-4 mr-2" /> Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Tidak ada permohonan.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Permohonan Akun</DialogTitle>
                        <DialogDescription>Informasi lengkap pengajuan akses sistem.</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Kode Permohonan</Label>
                                    <div className="font-mono font-semibold">{selectedRequest.request_code}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                                    <div className="font-medium">{selectedRequest.nama_lengkap}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">NIK</Label>
                                    <div className="font-medium">{selectedRequest.nik}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">NIP</Label>
                                    <div className="font-medium">{selectedRequest.nip || '-'}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Akses Dimohon</Label>
                                    <div className="font-medium capitalize">{selectedRequest.requested_role}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Jabatan</Label>
                                    <div className="font-medium">{selectedRequest.jabatan || '-'}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Unit / Bagian</Label>
                                    <div className="font-medium">{selectedRequest.unit_bagian || '-'}</div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <Label className="text-xs text-muted-foreground">Alasan Membutuhkan Akses</Label>
                                <div className="mt-1 text-sm bg-muted/50 p-3 rounded-lg border border-border">
                                    {selectedRequest.alasan}
                                </div>
                            </div>

                            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                                <a href={`https://wa.me/${selectedRequest.nomor_whatsapp}`} target="_blank" rel="noreferrer" className="text-sm flex items-center justify-center p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                                    WhatsApp: {selectedRequest.nomor_whatsapp}
                                </a>
                                <a href={`mailto:${selectedRequest.email}`} className="text-sm flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                                    Email: {selectedRequest.email}
                                </a>
                            </div>

                            {selectedRequest.rejection_reason && (
                                <div className="border-t border-border pt-4">
                                    <Label className="text-xs text-muted-foreground">Alasan Penolakan</Label>
                                    <div className="mt-1 text-sm bg-rose-50 text-rose-800 p-3 rounded-lg border border-rose-200">
                                        {selectedRequest.rejection_reason}
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="border-t border-border pt-4 flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                                {['pending', 'reviewing'].includes(selectedRequest.status) && (
                                    <>
                                        <Button type="button" variant="destructive" onClick={() => openReject(selectedRequest)}>Tolak</Button>
                                        <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => approve(selectedRequest)}>Setujui</Button>
                                    </>
                                )}
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Permohonan</DialogTitle>
                        <DialogDescription>Berikan alasan penolakan untuk permohonan ini.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitReject} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Alasan Penolakan <span className="text-red-500">*</span></Label>
                            <Textarea 
                                value={rejectForm.data.rejection_reason} 
                                onChange={e => rejectForm.setData('rejection_reason', e.target.value)} 
                                required
                            />
                            {rejectForm.errors.rejection_reason && <p className="text-red-500 text-sm">{rejectForm.errors.rejection_reason}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)}>Batal</Button>
                            <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                                {rejectForm.processing ? 'Menyimpan...' : 'Tolak Permohonan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AccountRequestsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/area' },
        { title: 'Permohonan Akun', href: '/admin/account-requests' }
    ],
};
