import { Head } from '@inertiajs/react';
import { PublicHeader } from '@/components/public/public-header';
import { HeroSection } from '@/components/public/hero-section';
import { ServicesSection } from '@/components/public/services-section';
import { TrackStatusSection } from '@/components/public/track-status-section';
import { ServiceSteps } from '@/components/public/service-steps';
import { PublicStatisticsSection } from '@/components/public/public-statistics-section';
import { PublicFooter } from '@/components/public/public-footer';
import { MobileBottomNav } from '@/components/public/mobile-bottom-nav';
import { InformationSection } from '@/components/public/information-section';

interface Service {
    id_layanan: number;
    nama_layanan: string;
    deskripsi: string;
    icon: string;
}

interface InformasiData {
    id_informasi: number;
    judul: string;
    kategori: string;
    isi: string;
    gambar: string | null;
    tanggal: string;
    slug?: string;
}

export default function Welcome({ services, informasi = [] }: { services: Service[], informasi?: InformasiData[] }) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-50 scroll-smooth">
            <Head title="TORA BELO - KPU Kota Palu" />

            <PublicHeader />

            <main className="flex-1 w-full relative">
                <HeroSection />
                
                <div className="bg-card pb-8 rounded-b-[2rem] sm:rounded-none relative z-10 shadow-sm dark:shadow-none sm:shadow-none">
                    <ServicesSection services={services} />
                </div>
                
                <InformationSection data={informasi} />
                
                <div className="bg-card">
                    <PublicStatisticsSection />
                </div>

                <TrackStatusSection />
                <ServiceSteps />
                
            </main>

            <PublicFooter />
            <MobileBottomNav />
        </div>
    );
}



