import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileQuestion, ShieldAlert, ServerCrash } from 'lucide-react';

export default function ErrorPage({ status }: { status: number }) {
    const getErrorContent = () => {
        switch (status) {
            case 403:
                return {
                    title: 'Akses Ditolak',
                    description: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
                    icon: ShieldAlert,
                };
            case 404:
                return {
                    title: 'Halaman Tidak Ditemukan',
                    description: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.',
                    icon: FileQuestion,
                };
            case 500:
                return {
                    title: 'Kesalahan Server',
                    description: 'Maaf, terjadi kesalahan pada server kami.',
                    icon: ServerCrash,
                };
            case 503:
                return {
                    title: 'Layanan Tidak Tersedia',
                    description: 'Maaf, layanan saat ini sedang tidak tersedia. Silakan coba lagi nanti.',
                    icon: ServerCrash,
                };
            default:
                return {
                    title: 'Terjadi Kesalahan',
                    description: 'Maaf, terjadi kesalahan yang tidak terduga.',
                    icon: AlertCircle,
                };
        }
    };

    const content = getErrorContent();
    const Icon = content.icon;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
            <Head title={content.title} />
            <div className="max-w-md w-full bg-white rounded-[16px] shadow-sm border border-border p-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{content.title}</h1>
                <p className="text-slate-500 mb-8">{content.description}</p>
                
                <Button asChild className="w-full bg-kpu-primary hover:bg-kpu-primary/90 text-white rounded-[8px]">
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        </div>
    );
}
