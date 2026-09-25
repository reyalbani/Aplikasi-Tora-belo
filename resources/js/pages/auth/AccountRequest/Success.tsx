import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
    request_code: string;
};

export default function Success({ request_code }: Props) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(request_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="Permohonan Berhasil Dikirim" />

            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                
                <h1 className="text-xl font-bold text-foreground mb-2">Permohonan Berhasil Dikirim</h1>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm mb-6">
                    Permohonan akun Anda telah berhasil dikirim dan sedang menunggu verifikasi Admin TORA BELO.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-4">
                    <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Kode Permohonan Anda</p>
                    <div className="text-xl font-mono font-bold text-foreground tracking-wider mb-3">
                        {request_code}
                    </div>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={copyToClipboard}
                        className="w-full text-slate-700 font-medium"
                    >
                        {copied ? <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'TERSALIN' : 'SALIN KODE'}
                    </Button>
                </div>

                <div className="bg-blue-50/50 text-blue-800 text-xs p-3 rounded-lg text-left w-full mb-6 flex gap-2">
                    <div className="shrink-0 mt-0.5">ℹ️</div>
                    <div>Simpan kode permohonan ini untuk memantau proses pengajuan akun Anda.</div>
                </div>

                <div className="w-full space-y-3">
                    <Link 
                        href="/permohonan-akun/status"
                        className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] bg-kpu-primary text-[14px] font-bold text-white shadow-sm hover:bg-kpu-primary-dark transition-all"
                    >
                        CEK STATUS PERMOHONAN
                    </Link>
                    <Link 
                        href="/login"
                        className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] border border-border bg-card text-[14px] font-semibold text-foreground/80 hover:bg-muted/50 transition-all"
                    >
                        KEMBALI KE LOGIN
                    </Link>
                </div>
            </div>
        </>
    );
}

Success.layout = {
    title: 'Sukses',
    description: 'TORA BELO KPU KOTA PALU',
};
