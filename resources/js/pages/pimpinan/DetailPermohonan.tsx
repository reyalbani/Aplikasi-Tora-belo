import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DetailPermohonan({ permohonan }: any) {
    if (!permohonan) {
        return (
            <>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <AlertCircle className="w-16 h-16 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Data Tidak Ditemukan</h2>
                    <Button variant="outline" asChild>
                        <Link href="/pimpinan/permohonan">Kembali</Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Detail ${permohonan.kode_tiket}`} />
            
            <div className="flex flex-col gap-6 max-w-5xl w-full mx-auto pb-10 px-4 md:px-6 mt-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
                        <Link href="/pimpinan/permohonan">
                            <ArrowLeft className="h-4 w-4"/>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[24px] font-bold tracking-tight">Detail Tiket #{permohonan.kode_tiket}</h1>
                        <p className="text-muted-foreground text-sm">{permohonan.layanan?.nama_layanan}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Data Pemohon</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                                    <p className="text-base">{permohonan.masyarakat?.nama_lengkap || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">NIK</p>
                                    <p className="text-base">{permohonan.masyarakat?.nik || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nomor HP</p>
                                    <p className="text-base">{permohonan.masyarakat?.no_hp || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-base">{permohonan.masyarakat?.user?.email || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Isi Permohonan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted p-4 rounded-md">
                                    {permohonan.isi_permohonan || 'Tidak ada deskripsi permohonan.'}
                                </p>
                                
                                {permohonan.dokumen_permohonan && permohonan.dokumen_permohonan.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-3">Dokumen Lampiran</h4>
                                        <div className="flex flex-col gap-4">
                                            {permohonan.dokumen_permohonan.map((dok: any) => {
                                                const lampiranUrl = `/pimpinan/permohonan/${permohonan.id_permohonan}/lampiran/${dok.id_dokumen}`;
                                                const fileName = dok.nama_file || dok.nama_dokumen || 'Dokumen Lampiran';
                                                const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);

                                                return (
                                                    <div key={dok.id_dokumen} className="flex flex-col gap-2 p-4 border rounded-md">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                                                                <span className="text-sm font-medium">{fileName}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <a href={lampiranUrl} target="_blank" rel="noreferrer">
                                                                    <Button size="sm" variant="outline">Lihat</Button>
                                                                </a>
                                                                <a href={`${lampiranUrl}?download=1`} download>
                                                                    <Button size="sm">Download</Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        {isImage && (
                                                            <div className="mt-2 flex justify-center bg-muted/30 rounded p-2">
                                                                <img src={lampiranUrl} alt={fileName} className="max-h-64 object-contain rounded border" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Status & Riwayat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Status Saat Ini</p>
                                    <Badge variant={
                                        permohonan.status === 'Selesai' ? 'default' : 
                                        permohonan.status === 'Ditolak' ? 'destructive' : 
                                        'secondary'
                                    } className="text-sm px-3 py-1">
                                        {permohonan.status}
                                    </Badge>
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-4">
                                    {permohonan.status_permohonan?.length > 0 ? (
                                        permohonan.status_permohonan.map((s: any, i: number) => (
                                            <div key={s.id_status} className="flex gap-3">
                                                <div className="mt-1 relative flex-none">
                                                    <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                                    {i !== permohonan.status_permohonan.length - 1 && (
                                                        <div className="absolute top-3 bottom-0 left-1 w-px -ml-px bg-border h-full -mb-4" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{s.status}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString('id-ID')}</span>
                                                    {s.keterangan && <span className="text-xs mt-1 italic">{s.keterangan}</span>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Belum ada riwayat status.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

DetailPermohonan.layout = {
    breadcrumbs: [
        { title: 'Permohonan Layanan', href: '/pimpinan/permohonan' },
        { title: 'Detail', href: '#' }
    ],
};
