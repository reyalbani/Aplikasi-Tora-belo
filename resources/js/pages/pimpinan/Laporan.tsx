import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileBarChart, FileSpreadsheet, FileText, Search, TrendingUp, PieChart as PieChartIcon, CheckCircle2, Clock, FileWarning, Inbox, FileText as FileTextIcon, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

export default function Laporan({ ringkasan, rekapLayanan, layananList, filters, trendChartData, statusChartData }: any) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        router.get('/pimpinan/laporan', Object.fromEntries(formData), { 
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (filters.period) params.append('period', filters.period);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.layanan) params.append('layanan', filters.layanan);
        return params.toString();
    };

    const handleExportExcel = () => {
        window.open(`/pimpinan/export/excel?${buildQueryString()}`, '_blank');
    };

    const handleExportPdf = () => {
        window.open(`/pimpinan/export/pdf?${buildQueryString()}`, '_blank');
    };

    const getPercentage = (value: number) => {
        if (!ringkasan?.total || ringkasan.total === 0) return '0%';
        return ((value / ringkasan.total) * 100).toFixed(1) + '%';
    };

    return (
        <>
            <Head title="Laporan & Rekapitulasi" />
            <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto pb-10 px-4 md:px-6 mt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Laporan & Rekapitulasi</h1>
                        <p className="text-[15px] text-muted-foreground">
                            Ringkasan dan rekapitulasi data layanan berdasarkan periode yang dipilih.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleExportExcel} variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700">
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                        </Button>
                        <Button onClick={handleExportPdf} variant="outline" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700">
                            <FileText className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Laporan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="space-y-2 w-full md:w-auto">
                                <Label>Periode</Label>
                                <Select name="period" defaultValue={filters.period || 'bulan'}>
                                    <SelectTrigger className="w-full md:w-[150px]"><SelectValue placeholder="Pilih Periode" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hari">Hari Ini</SelectItem>
                                        <SelectItem value="minggu">Minggu Ini</SelectItem>
                                        <SelectItem value="bulan">Bulan Ini</SelectItem>
                                        <SelectItem value="tahun">Tahun Ini</SelectItem>
                                        <SelectItem value="custom">Custom Tanggal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {filters.period === 'custom' && (
                                <>
                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label>Dari Tanggal</Label>
                                        <Input type="date" name="start_date" defaultValue={filters.start_date} required />
                                    </div>
                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label>Sampai Tanggal</Label>
                                        <Input type="date" name="end_date" defaultValue={filters.end_date} required />
                                    </div>
                                </>
                            )}
                            
                            <div className="space-y-2 w-full md:w-auto flex-1">
                                <Label>Layanan</Label>
                                <Select name="layanan" defaultValue={filters.layanan || 'semua'}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Semua Layanan" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="semua">Semua Layanan</SelectItem>
                                        {layananList?.map((l: any) => (
                                            <SelectItem key={l.id_layanan} value={l.id_layanan.toString()}>{l.nama_layanan}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <Button type="submit" className="w-full md:w-auto gap-2" disabled={isLoading}>
                                <Search className="w-4 h-4" /> {isLoading ? 'Memuat...' : 'Tampilkan'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <Card className="flex flex-col justify-between">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <FileTextIcon className="w-8 h-8 mb-3 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Total</span>
                            <span className="text-4xl font-black">{ringkasan?.total || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">100% dari permohonan</span>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-between border-b-4 border-b-blue-500">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <Inbox className="w-8 h-8 mb-3 text-blue-500" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Baru</span>
                            <span className="text-4xl font-black text-blue-600">{ringkasan?.baru || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">{getPercentage(ringkasan?.baru || 0)} dari total</span>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-between border-b-4 border-b-amber-500">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <Clock className="w-8 h-8 mb-3 text-amber-500" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Diproses</span>
                            <span className="text-4xl font-black text-amber-600">{ringkasan?.diproses || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">{getPercentage(ringkasan?.diproses || 0)} dari total</span>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-between border-b-4 border-b-orange-500">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <FileWarning className="w-8 h-8 mb-3 text-orange-500" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Tertunda</span>
                            <span className="text-4xl font-black text-orange-600">{ringkasan?.tertunda || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">{getPercentage(ringkasan?.tertunda || 0)} dari total</span>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-between border-b-4 border-b-emerald-500">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <CheckCircle2 className="w-8 h-8 mb-3 text-emerald-500" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Selesai</span>
                            <span className="text-4xl font-black text-emerald-600">{ringkasan?.selesai || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">{getPercentage(ringkasan?.selesai || 0)} dari total</span>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-between border-b-4 border-b-red-500">
                        <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                            <XCircle className="w-8 h-8 mb-3 text-red-500" />
                            <span className="text-sm font-medium text-muted-foreground uppercase mb-2">Ditolak</span>
                            <span className="text-4xl font-black text-red-600">{ringkasan?.ditolak || 0}</span>
                            <span className="text-xs text-muted-foreground mt-2">{getPercentage(ringkasan?.ditolak || 0)} dari total</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Tren Permohonan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {trendChartData && trendChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendChartData}>
                                            <defs>
                                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="label" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Total Permohonan" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">Tidak ada data untuk periode ini</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><PieChartIcon className="h-5 w-5" /> Distribusi Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {statusChartData && statusChartData.some((d: any) => d.value > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusChartData.filter((d: any) => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {statusChartData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ color: '#1f2937' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">Tidak ada data untuk periode ini</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><FileBarChart className="h-5 w-5" /> Rekapitulasi Per Layanan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="pl-6 w-12">No</TableHead>
                                        <TableHead>Nama Layanan</TableHead>
                                        <TableHead className="text-center">Baru</TableHead>
                                        <TableHead className="text-center">Diproses</TableHead>
                                        <TableHead className="text-center">Tertunda</TableHead>
                                        <TableHead className="text-center">Selesai</TableHead>
                                        <TableHead className="text-center">Ditolak</TableHead>
                                        <TableHead className="text-center font-bold text-black">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rekapLayanan?.length > 0 ? rekapLayanan.map((row: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="pl-6">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{row.layanan}</TableCell>
                                            <TableCell className="text-center">{row.baru}</TableCell>
                                            <TableCell className="text-center">{row.diproses}</TableCell>
                                            <TableCell className="text-center">{row.tertunda}</TableCell>
                                            <TableCell className="text-center text-emerald-600 font-medium">{row.selesai}</TableCell>
                                            <TableCell className="text-center text-red-600 font-medium">{row.ditolak}</TableCell>
                                            <TableCell className="text-center font-bold">{row.total}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">Tidak ada data rekapitulasi pada periode ini.</TableCell>
                                        </TableRow>
                                    )}
                                    {rekapLayanan?.length > 0 && (
                                        <TableRow className="bg-muted/50 font-bold hover:bg-muted/50">
                                            <TableCell colSpan={2} className="pl-6 text-right">TOTAL KESELURUHAN</TableCell>
                                            <TableCell className="text-center">{ringkasan?.baru || 0}</TableCell>
                                            <TableCell className="text-center">{ringkasan?.diproses || 0}</TableCell>
                                            <TableCell className="text-center">{ringkasan?.tertunda || 0}</TableCell>
                                            <TableCell className="text-center text-emerald-600">{ringkasan?.selesai || 0}</TableCell>
                                            <TableCell className="text-center text-red-600">{ringkasan?.ditolak || 0}</TableCell>
                                            <TableCell className="text-center text-lg">{ringkasan?.total || 0}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Laporan.layout = {
    breadcrumbs: [
        {
            title: 'Laporan & Rekapitulasi',
            href: '/pimpinan/laporan',
        },
    ],
};
