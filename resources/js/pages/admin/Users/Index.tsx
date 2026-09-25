import { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
    MoreVertical, Plus, Search, Shield, User as UserIcon, Users, Activity, Key, CheckCircle, XCircle, Eye, Edit, Save, ShieldAlert, Clock, ArrowUp, ArrowDown, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role: { id_role: number, nama_role: string } | null;
    id_role: number;
    status: string;
    created_at: string;
}

export default function UsersIndex({ users, roles, filters, summary }: any) {
    const { props } = usePage<any>();
    
    const [search, setSearch] = useState(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [confirmActionType, setConfirmActionType] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form Hooks
    const formAdd = useForm({
        name: '',
        email: '',
        id_role: '',
        status: 'Aktif',
        password: '',
        password_confirmation: ''
    });

    const formEdit = useForm({
        name: '',
        email: '',
        id_role: '',
        status: 'Aktif'
    });

    const formResetPass = useForm({
        password: '',
        password_confirmation: ''
    });

    // Handle Flash Messages
    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setIsResetPassModalOpen(false);
            setIsConfirmActionModalOpen(false);
            formAdd.reset();
            formEdit.reset();
            formResetPass.reset();
        }
        if (props.errors?.error) {
            toast.error(props.errors.error);
        }
        if (props.errors?.status) {
            toast.error(props.errors.status);
        }
    }, [props.flash, props.errors]);

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/admin/users', { ...filters, search, page: 1 }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/users', { ...filters, [key]: value === 'all' ? '' : value, page: 1 }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const currentField = filters.sortField;
        const currentDirection = filters.sortDirection;
        let newDirection = 'asc';
        
        if (currentField === field && currentDirection === 'asc') {
            newDirection = 'desc';
        }
        
        router.get('/admin/users', { ...filters, sortField: field, sortDirection: newDirection }, { preserveState: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true });
    };

    // Actions
    const openAddModal = () => {
        formAdd.reset();
        formAdd.clearErrors();
        setIsAddModalOpen(true);
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        formAdd.post('/admin/users', {
            preserveScroll: true
        });
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        formEdit.setData({
            name: user.name,
            email: user.email,
            id_role: user.id_role ? user.id_role.toString() : '',
            status: user.status
        });
        formEdit.clearErrors();
        setIsEditModalOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            formEdit.put(`/admin/users/${selectedUser.id}`, {
                preserveScroll: true
            });
        }
    };

    const openResetPassModal = (user: User) => {
        setSelectedUser(user);
        formResetPass.reset();
        formResetPass.clearErrors();
        setIsResetPassModalOpen(true);
    };

    const submitResetPass = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            formResetPass.post(`/admin/users/${selectedUser.id}/reset-password`, {
                preserveScroll: true
            });
        }
    };

    const openConfirmActionModal = (user: User, action: 'activate' | 'deactivate' | 'delete') => {
        setSelectedUser(user);
        setConfirmActionType(action);
        setIsConfirmActionModalOpen(true);
    };

    const submitConfirmAction = () => {
        if (!selectedUser) return;
        
        if (confirmActionType === 'activate' || confirmActionType === 'deactivate') {
            const newStatus = confirmActionType === 'activate' ? 'Aktif' : 'Nonaktif';
            router.post(`/admin/users/${selectedUser.id}/status`, { status: newStatus }, { preserveScroll: true });
        } else if (confirmActionType === 'delete') {
            router.delete(`/admin/users/${selectedUser.id}`, { preserveScroll: true });
        }
    };

    const openDetailModal = (user: User) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    // Sort Icon Helper
    const renderSortIcon = (field: string) => {
        if (filters.sortField !== field) return <span className="ml-1 text-muted-foreground/50">↕</span>;
        return filters.sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 inline ml-1" /> : <ArrowDown className="w-3 h-3 inline ml-1" />;
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Manajemen Pengguna</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">Kelola akun, peran, dan hak akses pengguna TORA BELO KPU Kota Palu.</p>
                    </div>
                    <Button onClick={openAddModal} className="bg-[#b91c1c] hover:bg-[#991b1b] text-white shadow-sm dark:shadow-none dark:shadow-none rounded-lg w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pengguna
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-6">
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-muted">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{summary.total}</span>
                                <span className="text-[13px] lg:text-[14px] font-medium text-muted-foreground">Total Pengguna</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50">
                                    <Shield className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{summary.admin}</span>
                                <span className="text-[13px] lg:text-[14px] font-medium text-muted-foreground">Administrator</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-50">
                                    <Activity className="h-5 w-5 text-sky-600" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{summary.petugas}</span>
                                <span className="text-[13px] lg:text-[14px] font-medium text-muted-foreground">Petugas</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-50">
                                    <UserIcon className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">{summary.pimpinan}</span>
                                <span className="text-[13px] lg:text-[14px] font-medium text-muted-foreground">Pimpinan</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px]">
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight">{summary.aktif}</span>
                                <span className="text-[13px] lg:text-[14px] font-medium text-muted-foreground">Pengguna Aktif</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none dark:shadow-none rounded-[12px] sm:rounded-[16px] overflow-hidden">
                    <CardHeader className="p-4 sm:p-5 border-b border-border/80 bg-card">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                                <Input 
                                    placeholder="Cari nama atau email..." 
                                    className="pl-9 bg-card border-border text-foreground h-10 w-full rounded-lg focus-visible:ring-[#b91c1c]/20"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                <Select value={filters.role || 'all'} onValueChange={(v) => handleFilterChange('role', v)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-card border-border h-10 rounded-lg">
                                        <SelectValue placeholder="Semua Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Role</SelectItem>
                                        {roles.map((r: any) => (
                                            <SelectItem key={r.id_role} value={r.nama_role}>{r.nama_role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
                                    <SelectTrigger className="w-full sm:w-[150px] bg-card border-border h-10 rounded-lg">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Mobile View - Card List */}
                        <div className="block lg:hidden">
                            {users.data.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {users.data.map((user: User) => (
                                        <div key={user.id} className="p-4 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => openDetailModal(user)}>
                                                            <Eye className="w-4 h-4 mr-2 text-muted-foreground" /> Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                            <Edit className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openResetPassModal(user)}>
                                                            <Key className="w-4 h-4 mr-2 text-amber-500" /> Reset Password
                                                        </DropdownMenuItem>
                                                        {user.status === 'Aktif' ? (
                                                            <DropdownMenuItem onClick={() => openConfirmActionModal(user, 'deactivate')} className="text-rose-600 focus:text-rose-700">
                                                                <XCircle className="w-4 h-4 mr-2" /> Nonaktifkan
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => openConfirmActionModal(user, 'activate')} className="text-emerald-600 focus:text-emerald-700">
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Aktifkan
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex gap-2 items-center mt-1">
                                                <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/50">
                                                    {user.role?.nama_role || 'Tidak ada'}
                                                </Badge>
                                                <span className="text-muted-foreground/50">•</span>
                                                <Badge className={user.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}>
                                                    {user.status}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                Dibuat: {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    <div className="flex justify-center mb-3">
                                        <Users className="w-12 h-12 text-slate-200" />
                                    </div>
                                    <p className="font-medium text-foreground/80">Belum ada pengguna</p>
                                    <p className="text-sm mt-1">Coba sesuaikan pencarian atau filter Anda.</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader className="bg-muted/50/80">
                                    <TableRow className="border-b border-border hover:bg-muted/50/50">
                                        <TableHead className="text-muted-foreground font-semibold h-12 cursor-pointer select-none" onClick={() => handleSort('name')}>
                                            Pengguna {renderSortIcon('name')}
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12">Role</TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12 cursor-pointer select-none" onClick={() => handleSort('status')}>
                                            Status {renderSortIcon('status')}
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-semibold h-12 cursor-pointer select-none" onClick={() => handleSort('created_at')}>
                                            Dibuat {renderSortIcon('created_at')}
                                        </TableHead>
                                        <TableHead className="w-[80px] h-12 text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length > 0 ? (
                                        users.data.map((user: User) => (
                                            <TableRow key={user.id} className="hover:bg-muted/50/80 border-b border-border transition-colors group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-foreground group-hover:text-indigo-600 transition-colors">{user.name}</div>
                                                            <div className="text-[13px] text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal text-muted-foreground bg-card">
                                                        {user.role?.nama_role || 'Tidak ada'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={user.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200' : 'bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200'}>
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-[14px]">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/70 hover:text-muted-foreground">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                                                            <DropdownMenuItem onClick={() => openDetailModal(user)} className="cursor-pointer">
                                                                <Eye className="w-4 h-4 mr-2 text-muted-foreground" /> Lihat Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEditModal(user)} className="cursor-pointer">
                                                                <Edit className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openResetPassModal(user)} className="cursor-pointer">
                                                                <Key className="w-4 h-4 mr-2 text-amber-500" /> Reset Password
                                                            </DropdownMenuItem>
                                                            {user.status === 'Aktif' ? (
                                                                <DropdownMenuItem onClick={() => openConfirmActionModal(user, 'deactivate')} className="cursor-pointer text-rose-600 focus:text-rose-700">
                                                                    <XCircle className="w-4 h-4 mr-2" /> Nonaktifkan
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => openConfirmActionModal(user, 'activate')} className="cursor-pointer text-emerald-600 focus:text-emerald-700">
                                                                    <CheckCircle className="w-4 h-4 mr-2" /> Aktifkan
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Users className="w-12 h-12 text-slate-200 mb-3" />
                                                    <p className="font-medium text-foreground/80">Belum ada pengguna</p>
                                                    <p className="text-sm mt-1">Coba sesuaikan pencarian atau filter Anda.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.links && users.links.length > 3 && (
                            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-[13px] text-muted-foreground w-full text-center sm:text-left">
                                    Menampilkan <span className="font-medium text-foreground">{users.from || 0}</span> sampai <span className="font-medium text-foreground">{users.to || 0}</span> dari <span className="font-medium text-foreground">{users.total}</span> pengguna
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {users.links.map((link: any, index: number) => (
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
                    </CardContent>
                </Card>
            </div>

            {/* Modal Detail User */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detail Pengguna</DialogTitle>
                        <DialogDescription>Informasi lengkap akun pengguna.</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-2xl font-bold border border-border">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                                    <div className="text-[12px] font-medium text-muted-foreground mb-1">Role</div>
                                    <div className="font-medium text-foreground">{selectedUser.role?.nama_role || '-'}</div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                                    <div className="text-[12px] font-medium text-muted-foreground mb-1">Status</div>
                                    <div>
                                        <Badge className={selectedUser.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-rose-50 text-rose-700 hover:bg-rose-50'}>
                                            {selectedUser.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg border border-border col-span-2">
                                    <div className="text-[12px] font-medium text-muted-foreground mb-1">Tanggal Dibuat</div>
                                    <div className="font-medium text-foreground">
                                        {new Date(selectedUser.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Add User */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna</DialogTitle>
                        <DialogDescription>Buat akun pengguna baru untuk mengakses TORA BELO.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" value={formAdd.data.name} onChange={(e) => formAdd.setData('name', e.target.value)} required />
                            {formAdd.errors.name && <p className="text-sm text-red-500">{formAdd.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formAdd.data.email} onChange={(e) => formAdd.setData('email', e.target.value)} required />
                            {formAdd.errors.email && <p className="text-sm text-red-500">{formAdd.errors.email}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="id_role">Role</Label>
                                <Select value={formAdd.data.id_role} onValueChange={(v) => formAdd.setData('id_role', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r: any) => (
                                            <SelectItem key={r.id_role} value={r.id_role.toString()}>{r.nama_role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formAdd.errors.id_role && <p className="text-sm text-red-500">{formAdd.errors.id_role}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formAdd.data.status} onValueChange={(v) => formAdd.setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formAdd.errors.status && <p className="text-sm text-red-500">{formAdd.errors.status}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? 'text' : 'password'} value={formAdd.data.password} onChange={(e) => formAdd.setData('password', e.target.value)} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formAdd.errors.password && <p className="text-sm text-red-500">{formAdd.errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input id="password_confirmation" type={showPassword ? 'text' : 'password'} value={formAdd.data.password_confirmation} onChange={(e) => formAdd.setData('password_confirmation', e.target.value)} required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={formAdd.processing} className="bg-[#b91c1c] hover:bg-[#991b1b] text-white">
                                {formAdd.processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit User */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>Perbarui informasi akun pengguna.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit_name">Nama Lengkap</Label>
                            <Input id="edit_name" value={formEdit.data.name} onChange={(e) => formEdit.setData('name', e.target.value)} required />
                            {formEdit.errors.name && <p className="text-sm text-red-500">{formEdit.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit_email">Email</Label>
                            <Input id="edit_email" type="email" value={formEdit.data.email} onChange={(e) => formEdit.setData('email', e.target.value)} required />
                            {formEdit.errors.email && <p className="text-sm text-red-500">{formEdit.errors.email}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_role">Role</Label>
                                <Select value={formEdit.data.id_role} onValueChange={(v) => formEdit.setData('id_role', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r: any) => (
                                            <SelectItem key={r.id_role} value={r.id_role.toString()}>{r.nama_role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formEdit.errors.id_role && <p className="text-sm text-red-500">{formEdit.errors.id_role}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_status">Status</Label>
                                <Select value={formEdit.data.status} onValueChange={(v) => formEdit.setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formEdit.errors.status && <p className="text-sm text-red-500">{formEdit.errors.status}</p>}
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={formEdit.processing} className="bg-[#b91c1c] hover:bg-[#991b1b] text-white">
                                {formEdit.processing ? 'Menyimpan...' : 'Perbarui Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Reset Password */}
            <Dialog open={isResetPassModalOpen} onOpenChange={setIsResetPassModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Reset password pengguna <strong>{selectedUser?.name}</strong>. Password baru akan menggantikan yang lama.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitResetPass} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset_password">Password Baru</Label>
                            <div className="relative">
                                <Input id="reset_password" type={showPassword ? 'text' : 'password'} value={formResetPass.data.password} onChange={(e) => formResetPass.setData('password', e.target.value)} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formResetPass.errors.password && <p className="text-sm text-red-500">{formResetPass.errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reset_password_confirmation">Konfirmasi Password Baru</Label>
                            <Input id="reset_password_confirmation" type={showPassword ? 'text' : 'password'} value={formResetPass.data.password_confirmation} onChange={(e) => formResetPass.setData('password_confirmation', e.target.value)} required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsResetPassModalOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={formResetPass.processing} className="bg-amber-600 hover:bg-amber-700 text-white">
                                {formResetPass.processing ? 'Menyimpan...' : 'Reset Password'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Confirm Action */}
            <Dialog open={isConfirmActionModalOpen} onOpenChange={setIsConfirmActionModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Tindakan</DialogTitle>
                        <DialogDescription>
                            {confirmActionType === 'activate' && `Aktifkan pengguna ${selectedUser?.name}? Pengguna akan dapat masuk kembali ke TORA BELO.`}
                            {confirmActionType === 'deactivate' && `Nonaktifkan pengguna ${selectedUser?.name}? Pengguna tidak akan dapat masuk ke TORA BELO selama akun dinonaktifkan.`}
                            {confirmActionType === 'delete' && `Hapus pengguna ${selectedUser?.name}? Tindakan ini tidak dapat dibatalkan.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsConfirmActionModalOpen(false)}>Batal</Button>
                        <Button type="button" onClick={submitConfirmAction} className={
                            confirmActionType === 'activate' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                            'bg-rose-600 hover:bg-rose-700 text-white'
                        }>
                            {confirmActionType === 'activate' ? 'Aktifkan' : (confirmActionType === 'deactivate' ? 'Nonaktifkan' : 'Hapus Pengguna')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/area',
        },
        {
            title: 'Manajemen Pengguna',
            href: '/admin/users',
        },
    ],
};
