import React from 'react';
import { Head } from '@inertiajs/react';
import { ExternalLink, Info, FileText, CheckCircle2, List, Activity, ChevronRight } from 'lucide-react';
import { ServiceHeader } from '@/Components/layanan/ServiceHeader';

interface Props {
    layanan: {
        id_layanan: number;
        nama_layanan: string;
        deskripsi: string;
        icon: string;
    };
}

export default function PPIDInfo({ layanan }: Props) {
    const steps = [
        { num: '01', text: 'Kunjungi layanan PPID KPU Kota Palu' },
        { num: '02', text: 'Pilih/akses layanan permohonan informasi publik' },
        { num: '03', text: 'Isi data pemohon dan informasi yang dibutuhkan' },
        { num: '04', text: 'Ajukan permohonan informasi' },
        { num: '05', text: 'Simpan atau catat bukti/kode permohonan yang diberikan' },
        { num: '06', text: 'Pantau proses permohonan melalui layanan PPID KPU Kota Palu' },
    ];

    const processSteps = [
        'Pengajuan Permohonan',
        'Verifikasi Permohonan',
        'Proses Permintaan Informasi',
        'Pemberian Informasi / Tanggapan'
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title="Informasi dan Tata Cara Layanan PPID - TORA BELO" />

            {/* Header with Back Button */}
            <ServiceHeader 
                title="Informasi Layanan PPID" 
                backUrl="/"
            />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                
                {/* Header Title Box */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60 flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 bg-red-50 text-kpu-primary rounded-2xl flex items-center justify-center mb-2 border border-red-100 shadow-sm">
                        <Info className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                        Informasi dan Tata Cara Layanan PPID
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-2xl">
                        Pejabat Pengelola Informasi dan Dokumentasi (PPID) KPU Kota Palu
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BAGIAN 1: APA ITU PPID? */}
                    <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-6 h-6 text-kpu-primary" />
                            <h3 className="text-lg font-bold text-neutral-900">APA ITU PPID?</h3>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            PPID (Pejabat Pengelola Informasi dan Dokumentasi) merupakan pejabat yang bertanggung jawab dalam pengelolaan dan pelayanan informasi publik di lingkungan KPU Kota Palu.
                        </p>
                    </div>

                    {/* BAGIAN 2: LAYANAN INFORMASI PPID */}
                    <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-6 h-6 text-kpu-primary" />
                            <h3 className="text-lg font-bold text-neutral-900">LAYANAN INFORMASI PPID</h3>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Masyarakat dapat mengajukan permohonan informasi publik terkait kepemiluan dan kelembagaan secara mudah, transparan, dan akuntabel melalui layanan PPID KPU Kota Palu.
                        </p>
                    </div>
                </div>

                {/* BAGIAN 3: TATA CARA PERMOHONAN INFORMASI */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                    <div className="flex items-center gap-3 mb-6">
                        <List className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">TATA CARA PERMOHONAN INFORMASI</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                <span className="text-xl font-black text-red-200">{step.num}</span>
                                <span className="text-sm font-medium text-neutral-700 pt-1">{step.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PERSYARATAN */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">PERSYARATAN PERMOHONAN INFORMASI</h3>
                    </div>
                    <ul className="list-disc pl-5 space-y-3 text-sm text-neutral-700">
                        <li>Identitas pemohon (KTP/SIM/Paspor atau identitas resmi lainnya).</li>
                        <li>Data kontak yang dapat dihubungi (Email atau Nomor HP/WhatsApp).</li>
                        <li>Rincian informasi yang dimohon secara jelas dan spesifik.</li>
                        <li>Tujuan penggunaan informasi apabila diperlukan dalam proses permohonan.</li>
                    </ul>
                </div>

                {/* PROSES PELAYANAN */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-6 h-6 text-kpu-primary" />
                        <h3 className="text-lg font-bold text-neutral-900">PROSES PELAYANAN PPID</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
                        {processSteps.map((step, idx) => (
                            <React.Fragment key={idx}>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="w-8 h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-700">{step}</span>
                                </div>
                                {idx < processSteps.length - 1 && (
                                    <div className="hidden sm:block text-neutral-300">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                                {idx < processSteps.length - 1 && (
                                    <div className="sm:hidden pl-4 py-1 text-neutral-300">
                                        <div className="w-0.5 h-6 bg-neutral-200 ml-[3px]"></div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* CTA BOX */}
                <div className="bg-kpu-primary/5 rounded-[24px] p-8 sm:p-10 border border-kpu-primary/20 text-center flex flex-col items-center mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                        Siap Mengajukan Permohonan Informasi?
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 mb-8 max-w-lg">
                        Untuk mengajukan permohonan informasi, silakan lanjutkan ke layanan PPID resmi KPU Kota Palu.
                    </p>
                    <a 
                        href="https://palukotappid.kpu.go.id/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-8 h-14 bg-kpu-primary hover:bg-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
                    >
                        AJUKAN PERMOHONAN PPID
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>

            </main>

            {/* Footer */}
            <footer className="py-6 text-center border-t border-neutral-100 bg-white mt-auto">
                <p className="text-[13px] text-neutral-500 font-medium">
                    &copy; 2026 KPU Kota Palu. Hak Cipta Dilindungi.
                </p>
            </footer>
        </div>
    );
}
