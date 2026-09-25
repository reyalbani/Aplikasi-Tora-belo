import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActivitySquare, User, Terminal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Aktivitas({ activities, filters, modules }: any) {
    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get('/pimpinan/aktivitas', Object.fromEntries(formData), { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/pimpinan/aktivitas', { ...filters, [key]: value, page: 1 }, { preserveState: true });
    };

    return (
        <>
            <Head title="Aktivitas & Riwayat Sistem" />
            <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-10 px-4 md:px-6 mt-6">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[28px] font-bold tracking-tight text-foreground">Riwayat Aktivitas</h1>
                    <p className="text-[15px] text-muted-foreground">
                        Pantau seluruh aktivitas pengguna dan sistem secara detail.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2 text-lg"><ActivitySquare className="h-5 w-5" /> Log Sistem</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <form onSubmit={handleFilter} className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="text" name="search" placeholder="Cari aktivitas/user..." defaultValue={filters?.search} className="pl-9" />
                            </form>
                            <Input 
                                type="date" 
                                name="tanggal" 
                                defaultValue={filters?.tanggal} 
                                className="w-full sm:w-40" 
                                onChange={(e) => handleFilterChange('tanggal', e.target.value)} 
                            />
                            <Select defaultValue={filters?.modul || 'semua'} onValueChange={(v) => handleFilterChange('modul', v)}>
                                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Semua Modul" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Modul</SelectItem>
                                    {modules?.map((m: any, i: number) => (
                                        <SelectItem key={i} value={m || '-'}>{m || 'Tanpa Modul'}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 w-[180px]">Waktu</TableHead>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Aktivitas</TableHead>
                                        <TableHead>Modul</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activities?.data?.length > 0 ? activities.data.map((log: any) => (
                                        <TableRow key={log.id_log}>
                                            <TableCell className="pl-6 font-medium whitespace-nowrap text-sm">
                                                {log.waktu ? new Date(log.waktu).toLocaleString('id-ID') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {log.user ? (
                                                        <>
                                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                <User className="h-3 w-3 text-primary" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium leading-none">{log.user.name}</span>
                                                                <span className="text-[11px] text-muted-foreground mt-1">{log.role || log.user.role?.nama_role || 'User'}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                                <Terminal className="h-3 w-3 text-slate-500" />
                                                            </div>
                                                            <span className="text-sm font-medium">Sistem</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{log.aktivitas}</TableCell>
                                            <TableCell className="text-sm">
                                                {log.module ? (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{log.module}</span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {log.description || '-'}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Belum ada data aktivitas</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {activities?.links && activities.total > activities.per_page && (
                            <div className="p-4 border-t flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {activities.from || 0} - {activities.to || 0} dari {activities.total} data
                                </div>
                                <div className="flex gap-1">
                                    {activities.links.map((link: any, i: number) => (
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
        </>
    );
}

Aktivitas.layout = {
    breadcrumbs: [
        {
            title: 'Aktivitas / Riwayat',
            href: '/pimpinan/aktivitas',
        },
    ],
};
