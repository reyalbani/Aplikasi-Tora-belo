import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
    permohonan: {
        kode_tiket: string;
        tanggal_pengajuan: string;
        status: string;
        layanan: string;
    };
}

export default function PPIDSuccess({ permohonan }: Props) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(permohonan.kode_tiket);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={`Berhasil - TORA BELO`} />

            {/* STANDALONE TOP BAR */}
            <header className="bg-card border-b border-neutral-200/60 sticky top-0 z-50 shadow-sm dark:shadow-none">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-3">
                        <div className="font-bold text-neutral-800 tracking-tight text-lg">
                            TORA BELO <span className="text-kpu-primary">KPU</span>
                        </div>
                        <div className="hidden sm:block w-px h-5 bg-neutral-300 mx-1"></div>
                        <div className="hidden sm:block text-sm font-semibold text-neutral-600">
                            {permohonan.layanan}
                        </div>
                    </div>
                    <Link 
                        href="/" 
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 shrink-0" />
                        <span className="hidden sm:inline">Kembali ke Portal Publik</span>
                        <span className="sm:hidden">Portal Publik</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
                <div className="bg-card rounded-[24px] p-8 md:p-14 shadow-sm dark:shadow-none border border-neutral-200/60 text-center relative overflow-hidden mt-4">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-green-50/80 to-transparent pointer-events-none"></div>
                    <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                        <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3 tracking-tight">Permohonan Berhasil Dikirim</h2>
                    <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed">
                        Permohonan informasi publik Anda telah berhasil diterima dan tercatat dalam sistem.
                    </p>
                    
                    <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-8 max-w-md mx-auto mb-10 shadow-sm dark:shadow-none relative">
                        <p className="text-sm text-neutral-500 mb-2 font-semibold">Kode Tracker Anda</p>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <p className="text-4xl sm:text-5xl font-bold text-kpu-primary tracking-widest">{permohonan.kode_tiket}</p>
                        </div>
                        <Button 
                            type="button" 
                            onClick={copyToClipboard} 
                            variant="outline" 
                            className="rounded-xl px-6 h-10 text-neutral-700 hover:bg-neutral-100 font-semibold text-sm transition-all"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? 'Kode berhasil disalin!' : 'Salin Kode'}
                        </Button>
                        <p className="text-sm text-neutral-500 mt-6 font-medium px-4">Simpan kode ini untuk memantau perkembangan permohonan Anda.</p>
                    </div>

                    <div className="max-w-md mx-auto mb-10 bg-card border border-neutral-100 rounded-[16px] p-5 text-left shadow-sm dark:shadow-none">
                        <h4 className="text-[13px] font-bold text-neutral-800 mb-3 uppercase tracking-wider">Ringkasan Pengajuan</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-500">Layanan</span>
                                <span className="text-sm font-semibold text-neutral-800">{permohonan.layanan}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-500">Tanggal Pengajuan</span>
                                <span className="text-sm font-semibold text-neutral-800">{permohonan.tanggal_pengajuan}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500">Status Awal</span>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{permohonan.status}</span>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-400 mt-4 leading-relaxed bg-neutral-50 p-3 rounded-lg">
                            Permohonan Anda saat ini sedang menunggu proses verifikasi oleh petugas KPU Kota Palu.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20">
                            <Link href={`/cek-status?tiket=${permohonan.kode_tiket}`}>Cek Status Pengajuan →</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl px-8 w-full sm:w-auto h-12 text-neutral-700 font-semibold border-neutral-200">
                            <Link href="/">Kembali ke Portal Publik</Link>
                        </Button>
                    </div>
                </div>
            </main>
            
            <div className="mt-4 pb-8 text-center">
                <p className="text-xs text-neutral-400 font-medium">
                    &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                </p>
            </div>
        </div>
    );
}



