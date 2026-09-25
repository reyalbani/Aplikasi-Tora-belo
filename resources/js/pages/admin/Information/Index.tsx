import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    MoreVertical, Plus, Search, FileText, CheckCircle, Clock, Edit, Trash2, XCircle
} from 'lucide-react';

interface Admin {
    id_admin: number;
    nama: string;
}

interface Information {
    id_informasi: number;
    id_admin: number;
    judul: string;
    kategori: string;
    ringkasan: string | null;
    isi: string;
    gambar: string | null;
    tanggal: string;
    status: string;
    created_at: string;
    updated_at: string;
    admin?: Admin;
}

export default function InformationIndex({ informations, filters, summary }: any) {
    const [search, setSearch] = useState(filters.search || '');
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<Information | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        judul: '',
        kategori: 'Berita',
        ringkasan: '',
        isi: '',
        gambar: null as File | null,
        _method: 'post',
        tanggal: new Date().toISOString().split('T')[0],
        status: 'Publish',
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/information', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/information', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const openCreate = () => {
        reset();
        setData({
            judul: '',
            kategori: 'Berita',
            ringkasan: '',
            isi: '',
            tanggal: new Date().toISOString().split('T')[0],
            status: 'Publish',
            gambar: null,
            _method: 'post'
        });
        setIsCreateOpen(true);
    };

    const openEdit = (info: Information) => {
        setSelectedInfo(info);
        setData({
            judul: info.judul,
            kategori: info.kategori || 'Berita',
            ringkasan: info.ringkasan || '',
            isi: info.isi,
            gambar: null,
            _method: 'put',
            tanggal: info.tanggal ? new Date(info.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: info.status,
        });
        setIsEditOpen(true);
    };

    const openDelete = (info: Information) => {
        setSelectedInfo(info);
        setIsDeleteOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/information', {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInfo) {
            post(`/admin/information/${selectedInfo.id_informasi}`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsEditOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedInfo) {
            destroy(`/admin/information/${selectedInfo.id_informasi}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                },
            });
        }
    };

    const toggleStatus = (info: Information) => {
        const newStatus = info.status === 'Publish' || info.status === 'Published' ? 'Draft' : 'Publish';
        router.put(`/admin/information/${info.id_informasi}`, {
            judul: info.judul,
            kategori: info.kategori,
            isi: info.isi,
            tanggal: info.tanggal ? new Date(info.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: newStatus
        }, { preserveScroll: true });
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Publish' || status === 'Published') {
            return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Dipublikasikan</Badge>;
        }
        if (status === 'Draft') {
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Draft</Badge>;
        }
        return <Badge className="bg-muted text-foreground/80 hover:bg-muted">{status}</Badge>;
    };

    return (
        <>
            <Head title="Manajemen Informasi" />
            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Manajemen Informasi</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Kelola berita, pengumuman, dan publikasi pada portal TORA BELO.</p>
                    </div>
                    <Button className="bg-kpu-primary hover:bg-[#991b1b] text-white shadow-sm dark:shadow-none dark:shadow-none rounded-lg" onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Informasi
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none transition-all duration-200 rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-muted/80">
                                    <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-3xl font-bold text-foreground tracking-tight">{summary.total}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Total Informasi</span>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none transition-all duration-200 rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50/80">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-3xl font-bold text-emerald-600 tracking-tight">{summary.published}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Dipublikasikan</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none transition-all duration-200 rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-50/80">
                                    <Clock className="h-5 w-5 text-amber-600" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-3xl font-bold text-amber-600 tracking-tight">{summary.draft}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Draft</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardHeader className="pb-4 pt-5 px-5 border-b border-border/80 bg-card">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                                <Input 
                                    placeholder="Cari informasi..." 
                                    className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-kpu-primary/20"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                                <Select value={filters.kategori || 'all'} onValueChange={(v) => handleFilterChange('kategori', v)}>
                                    <SelectTrigger className="w-full sm:w-[160px] bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Semua Kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="all" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Semua Kategori</SelectItem>
                                        <SelectItem value="Berita" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Berita</SelectItem>
                                        <SelectItem value="Pengumuman" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Pengumuman</SelectItem>
                                        <SelectItem value="Informasi Layanan" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Informasi Layanan</SelectItem>
                                        <SelectItem value="Publikasi" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Publikasi</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="all" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Semua Status</SelectItem>
                                        <SelectItem value="Publish" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Published</SelectItem>
                                        <SelectItem value="Draft" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50/80">
                                <TableRow className="border-b border-border/80 hover:bg-muted/50/50">
                                    <TableHead className="text-muted-foreground font-semibold h-11">Judul Informasi</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11">Kategori</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11">Status</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11 hidden md:table-cell">Penulis</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11 hidden lg:table-cell">Tanggal Publikasi</TableHead>
                                    <TableHead className="w-[50px] h-11"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {informations.data.length > 0 ? (
                                    informations.data.map((info: Information) => (
                                        <TableRow key={info.id_informasi} className="hover:bg-muted/50/50 border-b border-border/80 transition-colors">
                                            <TableCell>
                                                <div className="font-medium text-foreground max-w-xs md:max-w-md line-clamp-2">{info.judul}</div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-foreground/80">{info.kategori || 'Berita'}</span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(info.status)}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {info.admin?.nama || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                                                {new Date(info.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground/80 hover:bg-muted">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border">
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-foreground/80" onClick={() => openEdit(info)}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit Informasi
                                                        </DropdownMenuItem>
                                                        {info.status === 'Publish' || info.status === 'Published' ? (
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-amber-600 focus:text-amber-700" onClick={() => toggleStatus(info)}>
                                                                <XCircle className="w-4 h-4 mr-2" /> Jadikan Draft
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-emerald-600 focus:text-emerald-700" onClick={() => toggleStatus(info)}>
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Publikasikan
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-rose-600 focus:text-rose-700" onClick={() => openDelete(info)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <FileText className="w-12 h-12 mb-4 text-muted-foreground/50" />
                                                <p className="text-lg font-medium text-foreground">Belum ada informasi</p>
                                                <p className="text-sm mt-1 mb-4">Silakan tambah berita atau pengumuman baru.</p>
                                                <Button variant="outline" className="bg-card border-border text-foreground/80 hover:bg-muted/50" onClick={openCreate}>
                                                    <Plus className="w-4 h-4 mr-2" /> Tambah Informasi
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {informations.links && informations.links.length > 3 && (
                    <div className="flex justify-center mt-2 pb-6">
                        <div className="flex flex-wrap gap-1">
                            {informations.links.map((link: any, i: number) => (
                                <Button 
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    className={`
                                        ${link.active ? 'bg-kpu-primary text-white hover:bg-[#991b1b] border-kpu-primary' : 'bg-card text-foreground/80 border-border hover:bg-muted/50'} 
                                        ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Tambah Informasi Baru</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Masukkan detail berita atau pengumuman untuk ditampilkan di portal publik.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="judul" className="text-foreground/80">Judul</Label>
                            <Input 
                                id="judul" 
                                value={data.judul} 
                                onChange={e => setData('judul', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                required
                            />
                            {errors.judul && <p className="text-sm text-rose-500">{errors.judul}</p>}
                        </div>
                                                <div className="space-y-2">
                            <Label htmlFor="ringkasan" className="text-foreground/80">Ringkasan (Opsional)</Label>
                            <Textarea 
                                id="ringkasan" 
                                value={data.ringkasan || ''} 
                                onChange={e => setData('ringkasan', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 min-h-[80px]"
                            />
                            {errors.ringkasan && <p className="text-sm text-rose-500">{errors.ringkasan}</p>}
                        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="kategori" className="text-foreground/80">Kategori</Label>
                                <Select value={data.kategori} onValueChange={(v) => setData('kategori', v)}>
                                    <SelectTrigger className="bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="Berita" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Berita</SelectItem>
                                        <SelectItem value="Pengumuman" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Pengumuman</SelectItem>
                                        <SelectItem value="Informasi Layanan" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Informasi Layanan</SelectItem>
                                        <SelectItem value="Publikasi" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Publikasi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.kategori && <p className="text-sm text-rose-500">{errors.kategori}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tanggal" className="text-foreground/80">Tanggal Publikasi</Label>
                                <Input 
                                    id="tanggal" 
                                    type="date"
                                    value={data.tanggal} 
                                    onChange={e => setData('tanggal', e.target.value)} 
                                    className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                    required
                                />
                                {errors.tanggal && <p className="text-sm text-rose-500">{errors.tanggal}</p>}
                            </div>
                        </div>
                                                <div className="space-y-2">
                            <Label htmlFor="gambar" className="text-foreground/80">Gambar / Thumbnail</Label>
                            <Input 
                                id="gambar" 
                                type="file"
                                accept="image/*"
                                onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                            />
                            {errors.gambar && <p className="text-sm text-rose-500">{errors.gambar}</p>}
                        </div>

<div className="space-y-2">
                            <Label htmlFor="isi" className="text-foreground/80">Isi Konten</Label>
                            <Textarea 
                                id="isi" 
                                value={data.isi} 
                                onChange={e => setData('isi', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 min-h-[150px]"
                                required
                            />
                            {errors.isi && <p className="text-sm text-rose-500">{errors.isi}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-foreground/80">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="Publish" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Publish</SelectItem>
                                    <SelectItem value="Draft" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                                                <DialogFooter className="mt-6 pt-4 border-t border-border flex justify-between sm:justify-between items-center w-full">
                            <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(true)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border mr-auto">
                                Preview
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border">
                                    Batal
                                </Button>
                                <Button type="button" variant="outline" disabled={processing} onClick={(e) => { setData('status', 'Draft'); setTimeout(() => e.currentTarget.closest('form')?.requestSubmit(), 100); }} className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                                    Simpan Draft
                                </Button>
                                <Button type="submit" disabled={processing} onClick={() => setData('status', 'Publish')} className="bg-kpu-primary text-white hover:bg-[#991b1b]">
                                    {processing ? 'Menyimpan...' : 'Publikasikan'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Informasi</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui konten berita atau pengumuman.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_judul" className="text-foreground/80">Judul</Label>
                            <Input 
                                id="edit_judul" 
                                value={data.judul} 
                                onChange={e => setData('judul', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                required
                            />
                            {errors.judul && <p className="text-sm text-rose-500">{errors.judul}</p>}
                        </div>
                                                <div className="space-y-2">
                            <Label htmlFor="ringkasan" className="text-foreground/80">Ringkasan (Opsional)</Label>
                            <Textarea 
                                id="ringkasan" 
                                value={data.ringkasan || ''} 
                                onChange={e => setData('ringkasan', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 min-h-[80px]"
                            />
                            {errors.ringkasan && <p className="text-sm text-rose-500">{errors.ringkasan}</p>}
                        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_kategori" className="text-foreground/80">Kategori</Label>
                                <Select value={data.kategori} onValueChange={(v) => setData('kategori', v)}>
                                    <SelectTrigger className="bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="Berita" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Berita</SelectItem>
                                        <SelectItem value="Pengumuman" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Pengumuman</SelectItem>
                                        <SelectItem value="Informasi Layanan" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Informasi Layanan</SelectItem>
                                        <SelectItem value="Publikasi" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Publikasi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.kategori && <p className="text-sm text-rose-500">{errors.kategori}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_tanggal" className="text-foreground/80">Tanggal Publikasi</Label>
                                <Input 
                                    id="edit_tanggal" 
                                    type="date"
                                    value={data.tanggal} 
                                    onChange={e => setData('tanggal', e.target.value)} 
                                    className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                    required
                                />
                                {errors.tanggal && <p className="text-sm text-rose-500">{errors.tanggal}</p>}
                            </div>
                        </div>
                                                <div className="space-y-2">
                            <Label htmlFor="edit_gambar" className="text-foreground/80">Gambar / Thumbnail (Upload baru untuk mengganti)</Label>
                            <Input 
                                id="edit_gambar" 
                                type="file"
                                accept="image/*"
                                onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                            />
                            {errors.gambar && <p className="text-sm text-rose-500">{errors.gambar}</p>}
                        </div>

<div className="space-y-2">
                            <Label htmlFor="edit_isi" className="text-foreground/80">Isi Konten</Label>
                            <Textarea 
                                id="edit_isi" 
                                value={data.isi} 
                                onChange={e => setData('isi', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 min-h-[150px]"
                                required
                            />
                            {errors.isi && <p className="text-sm text-rose-500">{errors.isi}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_status" className="text-foreground/80">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="Publish" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Publish</SelectItem>
                                    <SelectItem value="Draft" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                                                <DialogFooter className="mt-6 pt-4 border-t border-border flex justify-between sm:justify-between items-center w-full">
                            <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(true)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border mr-auto">
                                Preview
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border">
                                    Batal
                                </Button>
                                <Button type="button" variant="outline" disabled={processing} onClick={(e) => { setData('status', 'Draft'); setTimeout(() => e.currentTarget.closest('form')?.requestSubmit(), 100); }} className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                                    Simpan Draft
                                </Button>
                                <Button type="submit" disabled={processing} onClick={() => setData('status', 'Publish')} className="bg-kpu-primary text-white hover:bg-[#991b1b]">
                                    {processing ? 'Menyimpan...' : 'Publikasikan'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center">
                            <Trash2 className="w-5 h-5 text-rose-600 mr-2" /> Hapus Informasi
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-2">
                            Anda yakin ingin menghapus informasi <strong>{selectedInfo?.judul}</strong>?
                            Data yang dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border">
                            Batal
                        </Button>
                        <Button type="button" disabled={processing} onClick={handleDelete} className="bg-rose-600 text-white hover:bg-rose-700 border-none shadow-sm dark:shadow-none dark:shadow-none">
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        
            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="bg-white dark:bg-slate-900 border-none sm:max-w-[800px] max-h-[85vh] overflow-y-auto p-0">
                    <DialogHeader className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
                        <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">Preview Tampilan Publik</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Pratinjau bagaimana informasi ini akan tampil di halaman publik.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-8">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="space-y-4">
                                <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0">
                                    {data.kategori || 'Kategori'}
                                </Badge>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {data.judul || 'Judul Informasi / Pengumuman'}
                                </h1>
                                <div className="flex items-center text-sm text-slate-500 space-x-4">
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal'}
                                    </span>
                                </div>
                            </div>

                            {data.gambar && (
                                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm relative group">
                                    <img 
                                        src={data.gambar instanceof File ? URL.createObjectURL(data.gambar) : (typeof data.gambar === 'string' ? `/storage/${data.gambar}` : '')} 
                                        alt={data.judul}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {data.ringkasan && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium italic">
                                    {data.ringkasan}
                                </div>
                            )}

                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: data.isi || 'Isi informasi...' }} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

</>
    );
}

InformationIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/area',
        },
        {
            title: 'Manajemen Informasi',
            href: '/admin/information',
        },
    ],
};
