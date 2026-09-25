import { Head } from '@inertiajs/react';
import { Activity, AlertCircle, Building2, CheckCircle2, Clock, ExternalLink, FileText, Mail, MapPin, PhoneCall, Users } from 'lucide-react';

import { ServiceHeader } from '@/components/layanan/ServiceHeader';
import { ServiceInfoLayout } from '@/components/layanan/ServiceInfoLayout';


interface LayananProps {
    layanan: {
        id_layanan: number;
        nama_layanan: string;
        deskripsi: string;
    };
}

export default function Show({ layanan }: LayananProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={`${layanan.nama_layanan} - TORA BELO`} />
            
            <ServiceHeader title={layanan.nama_layanan} backUrl="/" />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                <ServiceInfoLayout
                    miniCards={[
                        {
                            title: "Pemohon",
                            content: "Masyarakat Umum",
                            icon: <Users className="w-5 h-5" />,
                            colorClass: "blue"
                        },
                        {
                            title: "Waktu Penyelesaian",
                            content: <><span className="text-sm font-semibold text-neutral-900 leading-snug">Sesuai Ketentuan</span></>,
                            icon: <Clock className="w-5 h-5" />,
                            colorClass: "amber"
                        },
                        {
                            title: "Biaya Layanan",
                            content: <><span className="text-lg font-black text-green-600 leading-none">GRATIS</span></>,
                            icon: <CheckCircle2 className="w-5 h-5" />,
                            colorClass: "green"
                        }
                    ]}
                    requirementsContent={
                        <div className="bg-neutral-50/50 rounded-2xl p-5 border border-neutral-100">
                            <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed">
                                {layanan.deskripsi || "Silakan hubungi petugas KPU Kota Palu untuk informasi persyaratan lebih lanjut mengenai layanan ini."}
                            </p>
                        </div>
                    }
                    procedures={[
                        { title: "PENGAJUAN", desc: "Pemohon menghubungi atau mendatangi kantor KPU Kota Palu." },
                        { title: "PROSES PELAYANAN", desc: "Petugas memberikan pelayanan sesuai dengan standar operasional prosedur yang berlaku." },
                        { title: "SELESAI", desc: "Layanan diselesaikan dan produk layanan diserahkan kepada pemohon." }
                    ]}
                    timeContent={
                        <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
                            Waktu penyelesaian disesuaikan dengan jenis permohonan dan standar pelayanan operasional KPU Kota Palu.
                        </p>
                    }
                    productsContent={
                        <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
                            Produk/Jasa pelayanan sesuai dengan ketentuan layanan {layanan.nama_layanan}.
                        </p>
                    }
                />
            </main>
        </div>
    );
}




