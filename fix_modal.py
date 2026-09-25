import re

with open('resources/js/Pages/pimpinan/Permohonan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports = """import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Eye, BookOpenCheck, Loader2, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';"""

content = re.sub(r'import React.*lucide-react\';', imports, content, flags=re.DOTALL)

# Add State to PermohonanLayanan
state_vars = """export default function PermohonanLayanan({ permohonan, layananList, filters }: any) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [detailError, setDetailError] = useState<string | null>(null);

    const openDetail = async (id: number) => {
        setIsDetailOpen(true);
        setIsLoading(true);
        setDetailData(null);
        setDetailError(null);
        
        try {
            const response = await axios.get(`/pimpinan/permohonan/${id}/api`);
            setDetailData(response.data.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setDetailError('Permohonan tidak ditemukan.');
            } else {
                setDetailError('Gagal memuat detail permohonan.');
            }
        } finally {
            setIsLoading(false);
        }
    };"""

content = re.sub(r'export default function PermohonanLayanan\([^)]+\) \{', state_vars, content)


# Modify Detail button
button_old = """                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                                                    <Link href={`/pimpinan/permohonan/${item.id_permohonan}`}>
                                                        <Eye className="w-4 h-4"/> Detail
                                                    </Link>
                                                </Button>
                                            </TableCell>"""

button_new = """                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => openDetail(item.id_permohonan)}>
                                                    <Eye className="w-4 h-4"/> Detail
                                                </Button>
                                            </TableCell>"""

content = content.replace(button_old, button_new)


# Add Modal JSX before the closing <> tag of return
modal_jsx = """
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                        <DialogTitle>Detail Permohonan</DialogTitle>
                        <DialogDescription>
                            {detailData ? `Tiket #${detailData.kode_tiket}` : 'Memuat informasi tiket...'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="px-6 py-4">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p>Memuat detail permohonan...</p>
                            </div>
                        )}
                        
                        {!isLoading && detailError && (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                                <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
                                <p className="text-destructive font-medium">{detailError}</p>
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="mt-4">Tutup</Button>
                            </div>
                        )}
                        
                        {!isLoading && !detailError && detailData && (
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Nomor Tiket</p>
                                        <p className="text-sm font-semibold">{detailData.kode_tiket}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Layanan</p>
                                        <p className="text-sm">{detailData.layanan?.nama_layanan || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Tanggal Masuk</p>
                                        <p className="text-sm">{new Date(detailData.created_at).toLocaleString('id-ID')} WITA</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Status Saat Ini</p>
                                        <Badge variant="secondary" className={
                                            detailData.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                            detailData.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                            detailData.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }>
                                            {detailData.status}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><User className="w-4 h-4"/> Data Pemohon</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nama Lengkap</p>
                                            <p className="text-sm">{detailData.masyarakat?.nama_lengkap || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">NIK</p>
                                            <p className="text-sm">{detailData.masyarakat?.nik || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nomor HP</p>
                                            <p className="text-sm">{detailData.masyarakat?.no_hp || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Email</p>
                                            <p className="text-sm">{detailData.masyarakat?.user?.email || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><FileText className="w-4 h-4"/> Isi Permohonan</h4>
                                    <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                                        {typeof detailData.isi_permohonan === 'string' && detailData.isi_permohonan.startsWith('{') 
                                            ? Object.entries(JSON.parse(detailData.isi_permohonan)).map(([k, v]) => (
                                                <div key={k} className="mb-2 last:mb-0">
                                                    <span className="font-medium block mb-0.5 capitalize">{k.replace(/_/g, ' ')}:</span>
                                                    <span>{String(v)}</span>
                                                </div>
                                            ))
                                            : (detailData.isi_permohonan || 'Tidak ada isi permohonan')
                                        }
                                    </div>
                                </div>
                                
                                {detailData.dokumen_permohonan && detailData.dokumen_permohonan.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3">Dokumen Lampiran</h4>
                                        <div className="flex flex-col gap-2">
                                            {detailData.dokumen_permohonan.map((dok: any) => (
                                                <a key={dok.id_dokumen} href={`/storage/${dok.file_path}`} target="_blank" rel="noreferrer" className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                                    <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{dok.nama_dokumen || 'Dokumen Lampiran'}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-3"><CheckCircle2 className="w-4 h-4"/> Riwayat Status</h4>
                                    <div className="space-y-4">
                                        {detailData.status_permohonan?.length > 0 ? (
                                            detailData.status_permohonan.map((s: any, i: number) => (
                                                <div key={s.id_status} className="flex gap-3">
                                                    <div className="mt-1 relative flex-none">
                                                        <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                                        {i !== detailData.status_permohonan.length - 1 && (
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
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="px-6 py-4 border-t bg-muted/50 flex justify-end sticky bottom-0 z-10">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>"""

content = content.replace('        </>\n    );\n}', modal_jsx + '\n    );\n}')

with open('resources/js/Pages/pimpinan/Permohonan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
