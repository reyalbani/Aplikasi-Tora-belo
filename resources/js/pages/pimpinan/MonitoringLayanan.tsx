import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, Activity, ServerCog } from 'lucide-react';

export default function MonitoringLayanan({ layanan, lastUpdated }: any) {
    return (
        <>
            <Head title="Monitoring Layanan" />
            <div className="flex flex-col gap-6 lg:gap-8 max-w-[1400px] w-full mx-auto pb-10 px-4 md:px-6 lg:px-8 mt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Monitoring Layanan</h1>
                        <p className="text-[15px] text-muted-foreground max-w-2xl">
                            Pantau status dan aktivitas seluruh layanan publik TORA BELO secara langsung.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ServerCog className="h-5 w-5" /> Daftar Layanan</CardTitle>
                        <CardDescription>Status layanan aktual dari database</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Nama Layanan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Total Permohonan</TableHead>
                                        <TableHead>Permohonan Terbaru</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {layanan?.length > 0 ? layanan.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="pl-6 font-medium">
                                                {item.nama}
                                                {item.deskripsi && <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.deskripsi}</div>}
                                            </TableCell>
                                            <TableCell>
                                                {item.status === 'Aktif' ? (
                                                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> Aktif</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600"><XCircle className="w-3 h-3 mr-1"/> Tidak Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">{item.total_permohonan}</TableCell>
                                            <TableCell>
                                                {item.terbaru ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{item.tiket_terbaru}</span>
                                                        <span className="text-xs text-muted-foreground">{item.terbaru}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Belum ada permohonan</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Belum ada data layanan</TableCell>
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

MonitoringLayanan.layout = {
    breadcrumbs: [
        {
            title: 'Monitoring Layanan',
            href: '/pimpinan/monitoring-layanan',
        },
    ],
};
