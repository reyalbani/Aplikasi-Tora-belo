import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { MobileBottomNav } from '@/components/public/mobile-bottom-nav';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface InformasiData {
    id_informasi: number;
    judul: string;
    kategori: string;
    isi: string;
    gambar: string | null;
    tanggal: string;
    slug: string;
}

export default function InformationDetail({ informasi }: { informasi: InformasiData }) {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50 scroll-smooth">
            <Head title={`${informasi.judul} - KPU Kota Palu`} />

            <PublicHeader />

            <main className="flex-1 w-full pt-[72px] lg:pt-[80px]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
                    {/* Back Button */}
                    <Link href="/#informasi" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Kembali ke Beranda
                    </Link>

                    {/* Article Header */}
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-100 rounded-full">
                                {informasi.kategori}
                            </span>
                            <span className="flex items-center text-sm text-neutral-500">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <time dateTime={informasi.tanggal}>
                                    {formatDate(informasi.tanggal)}
                                </time>
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 leading-tight">
                            {informasi.judul}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    {informasi.gambar && (
                        <div className="w-full aspect-video md:aspect-[2/1] bg-neutral-100 rounded-2xl sm:rounded-[32px] overflow-hidden mb-12 shadow-sm relative">
                            <img 
                                src={`/storage/${informasi.gambar}`} 
                                alt={informasi.judul}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl sm:rounded-[32px]"></div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-a:text-red-600 hover:prose-a:text-red-700 prose-img:rounded-xl">
                        <div dangerouslySetInnerHTML={{ __html: informasi.isi }} />
                    </div>
                </div>
            </main>

            <PublicFooter />
            <MobileBottomNav />
        </div>
    );
}
