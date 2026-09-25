import { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    MoreVertical, Plus, Search, ServerCog, Activity, CheckCircle, XCircle, Edit, Trash2
} from 'lucide-react';
import { createLucideIcon } from 'lucide-react';

interface Service {
    id_layanan: number;
    nama_layanan: string;
    deskripsi: string;
    kategori: string;
    icon: string;
    status: string;
    created_at: string;
    updated_at: string;
    permohonan_count?: number;
}

// Helper for dynamic icons if needed
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // If the name is valid lucide icon, use it. Otherwise fallback.
    // For safety, we use ServerCog as fallback.
    const iconName = name || 'ServerCog';
    // Hacky way to get the icon component if we have to, but since we import all, let's just do:
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.ServerCog;
    return <IconComponent className={className} />;
};


export default function ServicesIndex({ services, filters, summary }: any) {
    const [search, setSearch] = useState(filters.search || '');
    
    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nama_layanan: '',
        deskripsi: '',
        kategori: '',
        icon: '',
        status: 'Aktif',
    });

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/services', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/services', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const openCreate = () => {
        reset();
        setIsCreateOpen(true);
    };

    const openEdit = (service: Service) => {
        setSelectedService(service);
        setData({
            nama_layanan: service.nama_layanan,
            deskripsi: service.deskripsi || '',
            kategori: service.kategori || '',
            icon: service.icon || '',
            status: service.status,
        });
        setIsEditOpen(true);
    };

    const openDelete = (service: Service) => {
        setSelectedService(service);
        setIsDeleteOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/services', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedService) {
            put(`/admin/services/${selectedService.id_layanan}`, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedService) {
            destroy(`/admin/services/${selectedService.id_layanan}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                },
            });
        }
    };

    const toggleStatus = (service: Service) => {
        const newStatus = service.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        router.put(`/admin/services/${service.id_layanan}`, {
            nama_layanan: service.nama_layanan,
            deskripsi: service.deskripsi,
            kategori: service.kategori,
            icon: service.icon,
            status: newStatus
        }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Manajemen Layanan" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Manajemen Layanan</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Kelola layanan publik yang tersedia pada TORA BELO KPU Kota Palu.</p>
                    </div>
                    <Button className="bg-kpu-primary hover:bg-[#991b1b] text-white shadow-sm dark:shadow-none dark:shadow-none rounded-lg" onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Layanan
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none transition-all duration-200 rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-muted/80">
                                    <ServerCog className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-3xl font-bold text-foreground tracking-tight">{summary.total}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Total Layanan</span>
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
                                <span className="text-3xl font-bold text-emerald-600 tracking-tight">{summary.aktif}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Layanan Aktif</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none hover:shadow-md dark:hover:shadow-none dark:hover:shadow-none transition-all duration-200 rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-rose-50/80">
                                    <XCircle className="h-5 w-5 text-rose-600" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-3xl font-bold text-foreground tracking-tight">{summary.nonaktif}</span>
                                <span className="text-[14px] font-medium text-muted-foreground">Layanan Nonaktif</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardHeader className="pb-4 pt-5 px-5 border-b border-border/80 bg-card">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                                <Input 
                                    placeholder="Cari layanan..." 
                                    className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-kpu-primary/20"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="all" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Semua Status</SelectItem>
                                        <SelectItem value="Aktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50/80">
                                <TableRow className="border-b border-border/80 hover:bg-muted/50/50">
                                    <TableHead className="text-muted-foreground font-semibold h-11">Layanan</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11 hidden md:table-cell">Deskripsi</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11">Status</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11 text-center">Pengajuan</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold h-11 hidden lg:table-cell">Diperbarui</TableHead>
                                    <TableHead className="w-[50px] h-11"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.data.length > 0 ? (
                                    services.data.map((service: Service) => (
                                        <TableRow key={service.id_layanan} className="hover:bg-muted/50/50 border-b border-border/80 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                                        <DynamicIcon name={service.icon} className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{service.nama_layanan}</div>
                                                        <div className="text-sm text-muted-foreground block md:hidden line-clamp-1">{service.deskripsi}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="text-sm text-muted-foreground max-w-md line-clamp-2">{service.deskripsi}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={service.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-100 text-rose-700 hover:bg-rose-100'}>
                                                    {service.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-foreground/80">
                                                {service.permohonan_count || 0}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                                                {new Date(service.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground/80 hover:bg-muted">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border">
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-foreground/80" onClick={() => openEdit(service)}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit Layanan
                                                        </DropdownMenuItem>
                                                        {service.status === 'Aktif' ? (
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-amber-600 focus:text-amber-700" onClick={() => toggleStatus(service)}>
                                                                <XCircle className="w-4 h-4 mr-2" /> Nonaktifkan
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-emerald-600 focus:text-emerald-700" onClick={() => toggleStatus(service)}>
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Aktifkan
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-rose-600 focus:text-rose-700" onClick={() => openDelete(service)}>
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
                                                <ServerCog className="w-12 h-12 mb-4 text-muted-foreground/50" />
                                                <p className="text-lg font-medium text-foreground">Belum ada layanan</p>
                                                <p className="text-sm mt-1 mb-4">Belum ada layanan yang tersedia atau pencarian tidak ditemukan.</p>
                                                <Button variant="outline" className="bg-card border-border text-foreground/80 hover:bg-muted/50" onClick={openCreate}>
                                                    <Plus className="w-4 h-4 mr-2" /> Tambah Layanan Baru
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination Controls Here (Placeholder logic using Laravel's standard pagination if links exist) */}
                {services.links && services.links.length > 3 && (
                    <div className="flex justify-center mt-2 pb-6">
                        <div className="flex flex-wrap gap-1">
                            {services.links.map((link: any, i: number) => (
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
                <DialogContent className="bg-card border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Tambah Layanan Baru</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Masukkan informasi layanan publik baru yang akan tersedia di portal TORA BELO.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_layanan" className="text-foreground/80">Nama Layanan</Label>
                            <Input 
                                id="nama_layanan" 
                                value={data.nama_layanan} 
                                onChange={e => setData('nama_layanan', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                required
                            />
                            {errors.nama_layanan && <p className="text-sm text-rose-500">{errors.nama_layanan}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi" className="text-foreground/80">Deskripsi</Label>
                            <Textarea 
                                id="deskripsi" 
                                value={data.deskripsi} 
                                onChange={e => setData('deskripsi', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 resize-none"
                                rows={3}
                            />
                            {errors.deskripsi && <p className="text-sm text-rose-500">{errors.deskripsi}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="icon" className="text-foreground/80">Icon (Lucide)</Label>
                                <Input 
                                    id="icon" 
                                    value={data.icon} 
                                    onChange={e => setData('icon', e.target.value)} 
                                    className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                    placeholder="Contoh: FileText"
                                />
                                {errors.icon && <p className="text-sm text-rose-500">{errors.icon}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-foreground/80">Status</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger className="bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="Aktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-border">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border">
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-kpu-primary text-white hover:bg-[#991b1b]">
                                {processing ? 'Menyimpan...' : 'Simpan Layanan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Layanan</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui informasi layanan publik.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_nama_layanan" className="text-foreground/80">Nama Layanan</Label>
                            <Input 
                                id="edit_nama_layanan" 
                                value={data.nama_layanan} 
                                onChange={e => setData('nama_layanan', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                required
                            />
                            {errors.nama_layanan && <p className="text-sm text-rose-500">{errors.nama_layanan}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_deskripsi" className="text-foreground/80">Deskripsi</Label>
                            <Textarea 
                                id="edit_deskripsi" 
                                value={data.deskripsi} 
                                onChange={e => setData('deskripsi', e.target.value)} 
                                className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20 resize-none"
                                rows={3}
                            />
                            {errors.deskripsi && <p className="text-sm text-rose-500">{errors.deskripsi}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_icon" className="text-foreground/80">Icon (Lucide)</Label>
                                <Input 
                                    id="edit_icon" 
                                    value={data.icon} 
                                    onChange={e => setData('icon', e.target.value)} 
                                    className="bg-card border-border text-foreground focus-visible:ring-kpu-primary/20"
                                />
                                {errors.icon && <p className="text-sm text-rose-500">{errors.icon}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_status" className="text-foreground/80">Status</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger className="bg-card border-border text-foreground focus:ring-kpu-primary/20">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="Aktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif" className="focus:bg-muted focus:text-foreground data-[state=checked]:bg-kpu-primary/10 data-[state=checked]:text-kpu-primary">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-border">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="bg-card text-foreground/80 hover:bg-muted/50 border-border">
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-kpu-primary text-white hover:bg-[#991b1b]">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center">
                            <Trash2 className="w-5 h-5 text-rose-600 mr-2" /> Hapus Layanan
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-2">
                            Anda yakin ingin menghapus layanan <strong>{selectedService?.nama_layanan}</strong>?
                            Layanan yang sudah dihapus tidak dapat dikembalikan.
                            <br/><br/>
                            <em className="text-muted-foreground/70 text-xs">*Gagal dihapus jika sudah memiliki riwayat pengajuan. Disarankan untuk menonaktifkannya saja.</em>
                        </DialogDescription>
                    </DialogHeader>
                    {(errors as any).error && (
                        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-md border border-rose-100">
                            {(errors as any).error}
                        </div>
                    )}
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

        </>
    );
}

ServicesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/area',
        },
        {
            title: 'Manajemen Layanan',
            href: '/admin/services',
        },
    ],
};
