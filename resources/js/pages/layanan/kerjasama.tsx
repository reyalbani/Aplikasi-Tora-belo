import { Head, Link } from '@inertiajs/react';
import { Activity, AlertCircle, ArrowLeft, BookOpen, Building2, Calendar, CheckCircle2, Clock, Copy, ExternalLink, File, FileSignature, FileText, Info, Mail, MapPin, PhoneCall, UploadCloud, User, Users } from 'lucide-react';


import { Button } from '@/components/ui/button';
import { useState, useRef, FormEvent } from 'react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';
import { ServiceInfoLayout } from '@/components/layanan/ServiceInfoLayout';

interface Props {
    layanan: {
        id_layanan: number;
        nama_layanan: string;
        deskripsi: string;
        icon: string;
    };
    bukuTamu?: {
        nama?: string;
        email?: string;
        no_hp?: string;
        instansi?: string;
    } | null;
}

export default function Kerjasama({ layanan, bukuTamu }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ kode_tiket: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    
    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama: bukuTamu?.nama || '',
        instansi: bukuTamu?.instansi || '',
        jabatan: '',
        no_hp: bukuTamu?.no_hp || '',
        email: bukuTamu?.email || '',
        jenis_lembaga: '',
        
        judul_kerjasama: '',
        latar_belakang: '',
        maksud_tujuan: '',
        ruang_lingkup: '',
        rencana_kegiatan: '',
        jangka_waktu: '',
        keterangan_tambahan: '',
        
        dokumen_surat: null as File | null,
        dokumen_proposal: null as File | null,
        dokumen_legalitas: null as File | null,
        dokumen_draft: null as File | null,
        dokumen_pendukung: null as File | null,
        
        pernyataan: false,
    });

    const suratInputRef = useRef<HTMLInputElement>(null);
    const proposalInputRef = useRef<HTMLInputElement>(null);
    const legalitasInputRef = useRef<HTMLInputElement>(null);
    const draftInputRef = useRef<HTMLInputElement>(null);
    const pendukungInputRef = useRef<HTMLInputElement>(null);

    const updateData = (field: keyof typeof data, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (serverErrors[field]) {
            setServerErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }
    };

    const handleFileChange = (field: keyof typeof data, ref: React.RefObject<HTMLInputElement | null>, maxMb = 5) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > maxMb * 1024 * 1024) {
                alert(`Ukuran file maksimal ${maxMb}MB.`);
                if (ref.current) ref.current.value = '';
                return;
            }
            updateData(field, file);
        }
    };

    const removeFile = (field: keyof typeof data, ref: React.RefObject<HTMLInputElement | null>, e: React.MouseEvent) => {
        e.stopPropagation();
        updateData(field, null);
        if (ref.current) ref.current.value = '';
    };

    const nextStep = () => {
        let isValid = true;
        if (step === 1) {
            if (!data.nama.trim() || !data.instansi.trim() || !data.jabatan.trim() || !data.no_hp.trim() || !data.email.trim() || !data.jenis_lembaga) {
                isValid = false;
            }
        } else if (step === 2) {
            if (!data.judul_kerjasama.trim() || !data.latar_belakang.trim() || !data.maksud_tujuan.trim() || !data.ruang_lingkup.trim() || !data.rencana_kegiatan.trim() || !data.jangka_waktu.trim()) {
                isValid = false;
            }
        } else if (step === 3) {
            if (!data.dokumen_surat || !data.dokumen_proposal || !data.dokumen_legalitas) {
                isValid = false;
            }
        }

        if (isValid) {
            setStep(s => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('Mohon lengkapi semua field wajib (*) sebelum melanjutkan.');
        }
    };

    const prevStep = () => {
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!data.pernyataan) {
            alert('Anda harus menyetujui pernyataan kebenaran data.');
            return;
        }
        
        setIsSubmitting(true);
        setServerErrors({});
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && key !== 'pernyataan') {
                formData.append(key, value as any);
            }
        });
        
        const getXsrfToken = () => {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
            return '';
        };

        try {
            const response = await fetch('/layanan/kerjasama', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': getXsrfToken()
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                setSuccessData({ kode_tiket: result.kode_tiket });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw { response: { data: result } };
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const formattedErrors: Record<string, string> = {};
                Object.keys(error.response.data.errors).forEach(key => {
                    formattedErrors[key] = error.response.data.errors[key][0];
                });
                setServerErrors(formattedErrors);
            } else if (error.response?.data?.message) {
                setServerErrors({ _global: error.response.data.message });
            } else {
                setServerErrors({ _global: 'Terjadi kesalahan jaringan atau sistem saat mengirim permohonan.' });
            }
            // Go back to the step with error
            if (error.response?.data?.errors) {
                const errKeys = Object.keys(error.response.data.errors);
                if (errKeys.some(k => ['nama', 'instansi', 'jabatan', 'no_hp', 'email', 'jenis_lembaga'].includes(k))) setStep(1);
                else if (errKeys.some(k => ['judul_kerjasama', 'latar_belakang', 'maksud_tujuan', 'ruang_lingkup', 'rencana_kegiatan', 'jangka_waktu'].includes(k))) setStep(2);
                else setStep(3);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (successData?.kode_tiket) {
            navigator.clipboard.writeText(successData.kode_tiket);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const inputClasses = (error: string | undefined) => 
        `w-full rounded-xl border ${
            error 
                ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-neutral-200/90 bg-card hover:border-neutral-300 focus:border-kpu-primary focus:ring-kpu-primary/15'
        } px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 transition-all duration-200 shadow-xs`;

    const getLegalitasRequirement = () => {
        switch (data.jenis_lembaga) {
            case 'Instansi Pemerintah':
            case 'TNI/Polri':
                return 'Surat Tugas / SK Jabatan Penanggung Jawab';
            case 'Perguruan Tinggi':
                return 'Izin Operasional/Akreditasi dan SK Pengangkatan Rektor/Ketua/Direktur';
            case 'Ormas/NGO/Lembaga Masyarakat':
                return 'Akta Pendirian/Badan Hukum, SKT Kesbangpol, Struktur Organisasi';
            case 'BUMN/BUMD':
            case 'Swasta':
                return 'SIUP/NIB, NPWP Perusahaan, Akta Pendirian Notaris';
            default:
                return 'Dokumen Legalitas Resmi Lembaga Anda';
        }
    };

    // ----------------------------------------------------
    // SUCCESS VIEW
    // ----------------------------------------------------
    if (successData) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Head title={`${layanan.nama_layanan} - TORA BELO`} />
                <ServiceHeader title={layanan.nama_layanan} backUrl="/" />
                <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
                    <div className="bg-card rounded-[24px] p-8 md:p-14 shadow-sm dark:shadow-none border border-neutral-200/60 text-center relative overflow-hidden mt-4 animate-fade-in">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-green-50/80 to-transparent pointer-events-none"></div>
                        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Permohonan Kerjasama Berhasil Dikirim!</h2>
                        <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
                            Permohonan kerjasama Anda telah berhasil dicatat pada sistem TORA BELO dan sedang menunggu verifikasi awal oleh Petugas KPU Kota Palu.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-8 max-w-md mx-auto mb-10 shadow-sm dark:shadow-none relative">
                            <p className="text-xs sm:text-sm text-neutral-500 mb-2 font-bold uppercase tracking-wider">KODE TIKET ANDA</p>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <p className="text-4xl sm:text-5xl font-extrabold text-kpu-primary tracking-widest">{successData.kode_tiket}</p>
                            </div>
                            <Button 
                                type="button" 
                                onClick={copyToClipboard} 
                                variant="outline" 
                                className="rounded-xl px-6 h-10 text-neutral-700 hover:bg-neutral-100 font-semibold text-sm transition-all cursor-pointer"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Kode Berhasil Disalin' : 'Salin Kode Tiket'}
                            </Button>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-6 font-medium px-4">Gunakan kode ini untuk memantau status perkembangan layanan melalui menu Cek Status TORA BELO.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Lacak Permohonan →</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl px-8 w-full sm:w-auto h-12 text-neutral-700 font-semibold border-neutral-200">
                                <Link href="/">Kembali ke Portal Publik</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={`${layanan.nama_layanan} - TORA BELO`} />

            <ServiceHeader 
                title={layanan.nama_layanan} 
                backUrl={!showForm ? "/" : undefined}
                onBack={showForm ? () => setShowForm(false) : undefined} 
            />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                
                {/* Header Info & Action Box */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
                                    {layanan.nama_layanan}
                                </h1>
                                <span className="bg-red-50 text-kpu-primary border border-red-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Layanan Kerjasama Antar Lembaga
                                </span>
                            </div>
                            <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed mt-1">
                                {layanan.deskripsi || "Fasilitasi kerjasama resmi antara KPU Kota Palu dengan Instansi Pemerintah, Perguruan Tinggi, Swasta, dan Lembaga Masyarakat."}
                            </p>
                        </div>
                    </div>

                    {!showForm && (
                        <button 
                            type="button"
                            onClick={() => {
                                setShowForm(true);
                                setStep(1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 w-full sm:w-auto cursor-pointer"
                        >
                            <FileSignature className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                            <span>Ajukan Permohonan Kerjasama</span>
                        </button>
                    )}
                </div>

                {!showForm ? (
                    // ----------------------------------------------------
                    // INFORMASI LAYANAN KERJASAMA
                    // ----------------------------------------------------
                    <ServiceInfoLayout
                        miniCards={[
                            {
                                title: "Pemohon",
                                content: "Instansi Pemerintah, TNI/Polri, Perguruan Tinggi, Ormas/NGO, BUMN/BUMD, Swasta",
                                icon: <Users className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Waktu Penyelesaian",
                                content: <><span className="text-sm font-semibold text-neutral-900 leading-snug">Sesuai Tahapan</span><br/><span className="text-xs text-neutral-500 font-normal">Detail pada Alur Layanan</span></>,
                                icon: <Clock className="w-5 h-5" />,
                                colorClass: "amber"
                            },
                            {
                                title: "Biaya Layanan",
                                content: <><span className="text-lg font-black text-green-600 leading-none">GRATIS</span><br/><span className="text-xs text-neutral-500 font-normal mt-1 block">Rp 0 (Tidak dipungut biaya)</span></>,
                                icon: <CheckCircle2 className="w-5 h-5" />,
                                colorClass: "green"
                            }
                        ]}
                        requirementsContent={
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-neutral-50/50 rounded-2xl p-5 border border-neutral-100">
                                    <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">A</div>
                                        Persyaratan Administratif
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Surat Permohonan/Penawaran Kerjasama resmi yang ditujukan kepada Ketua KPU Kota Palu.",
                                            "Proposal Kerjasama (memuat Latar belakang, Maksud dan tujuan, Bentuk/ruang lingkup kerjasama, Rencana kegiatan, dan Jangka waktu).",
                                            "Dokumen legalitas pemohon/mitra sesuai jenis lembaga.",
                                            "Draft MoU dan/atau PKS awal jika sudah tersedia (opsional)."
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-[13px] sm:text-sm text-neutral-700 leading-relaxed">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-neutral-50/50 rounded-2xl p-5 border border-neutral-100">
                                    <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs">B</div>
                                        Persyaratan Substantif
                                    </h4>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 mb-3 font-medium">Permohonan harus memenuhi kriteria:</p>
                                    <ul className="space-y-2.5">
                                        {[
                                            "Sesuai dengan peraturan perundang-undangan.",
                                            "Menjaga asas kemandirian dan netralitas.",
                                            "Menjaga independensi penyelenggara Pemilu.",
                                            "Tidak mengandung unsur politik praktis & konflik kepentingan.",
                                            "Tidak memiliki afiliasi dengan peserta Pemilu/Pilkada."
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-[13px] sm:text-sm text-neutral-700 leading-relaxed">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        }
                        procedures={[
                            {
                                title: "PENGAJUAN & VERIFIKASI AWAL",
                                desc: "Pemohon mengajukan permohonan melalui TORA BELO atau menyerahkan langsung. Petugas melakukan verifikasi kelengkapan berkas."
                            },
                            {
                                title: "TELAAH & KAJIAN",
                                desc: "Divisi Hukum dan SDM melakukan kajian substantif dan legal drafting terhadap permohonan dan draf kerjasama."
                            },
                            {
                                title: "PEMBAHASAN BERSAMA",
                                desc: "KPU Kota Palu dan Pihak Pemohon melakukan rapat koordinasi untuk finalisasi ruang lingkup dan draf kesepahaman."
                            },
                            {
                                title: "PENANDATANGANAN",
                                desc: "Penandatanganan Nota Kesepahaman (MoU) atau Perjanjian Kerja Sama (PKS) oleh kedua belah pihak."
                            }
                        ]}
                        timeContent={
                            <ul className="space-y-2.5">
                                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5"></div><span><strong>Kajian Awal:</strong> Maks 3 hari kerja sejak diterima.</span></li>
                                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5"></div><span><strong>Pembahasan:</strong> Sesuai kesepakatan para pihak.</span></li>
                                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5"></div><span><strong>Penyelesaian Draf:</strong> Maks 7 hari kerja pasca pembahasan.</span></li>
                            </ul>
                        }
                        productsContent={
                            <ul className="space-y-2.5">
                                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5"></div><span>Nota Kesepahaman (MoU)</span></li>
                                <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5"></div><span>Perjanjian Kerja Sama (PKS)</span></li>
                            </ul>
                        }
                    />
                ) : (
                    // ----------------------------------------------------
                    // FORM PENGISIAN KERJASAMA
                    // ----------------------------------------------------
                    <div className="space-y-6 mt-6 animate-fade-in">
                        {/* Header Info of Form */}
                        <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                                    <FileSignature className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1 leading-tight tracking-tight">
                                        Formulir Permohonan Kerjasama
                                    </h1>
                                    <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                        Lengkapi data pemohon, detail kerjasama, dan dokumen pendukung sesuai jenis lembaga Anda.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {Object.keys(serverErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[18px] flex flex-col gap-2 shadow-xs">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                                    <p className="text-sm font-bold">Pengajuan belum dapat dikirim. Mohon periksa kembali data berikut:</p>
                                </div>
                                <ul className="list-disc pl-9 text-xs sm:text-sm space-y-1">
                                    {Object.entries(serverErrors).map(([key, err]) => (
                                        <li key={key}><span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {err as string}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden">
                            {/* Stepper Header */}
                            <div className="flex border-b border-neutral-100 bg-neutral-50/50">
                                {[
                                    { num: 1, label: 'Data Pemohon', icon: User },
                                    { num: 2, label: 'Detail Kerjasama', icon: FileText },
                                    { num: 3, label: 'Dokumen', icon: UploadCloud },
                                    { num: 4, label: 'Review', icon: CheckCircle2 }
                                ].map((item) => {
                                    const isActive = step === item.num;
                                    const isPassed = step > item.num;
                                    return (
                                        <div key={item.num} className={`flex-1 p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-colors ${isActive ? 'bg-card border-b-2 border-kpu-primary text-kpu-primary' : isPassed ? 'text-neutral-600' : 'text-neutral-400'}`}>
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-sm font-bold shrink-0 ${isActive ? 'bg-kpu-primary text-white shadow-xs' : isPassed ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-100 text-neutral-400'}`}>
                                                {isPassed ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : item.num}
                                            </div>
                                            <span className={`text-[11px] sm:text-sm font-semibold text-center sm:text-left ${isActive ? 'text-kpu-primary' : 'hidden sm:block'}`}>{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={submit} className="p-5 sm:p-8 md:p-10">
                                {/* STEP 1: Data Pemohon */}
                                <div className={step === 1 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Identitas Pemohon</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Masukkan informasi penanggung jawab dan lembaga/instansi pemohon.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Nama Pemohon / Penanggung Jawab <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.nama} 
                                                    onChange={e => updateData('nama', e.target.value)}
                                                    className={inputClasses(serverErrors.nama)} 
                                                    placeholder="Nama lengkap penanggung jawab"
                                                />
                                                {serverErrors.nama && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nama}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Instansi / Organisasi <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.instansi} 
                                                    onChange={e => updateData('instansi', e.target.value)}
                                                    className={inputClasses(serverErrors.instansi)} 
                                                    placeholder="Nama instansi atau organisasi"
                                                />
                                                {serverErrors.instansi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.instansi}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Jabatan <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.jabatan} 
                                                    onChange={e => updateData('jabatan', e.target.value)}
                                                    className={inputClasses(serverErrors.jabatan)} 
                                                    placeholder="Jabatan pemohon di instansi"
                                                />
                                                {serverErrors.jabatan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jabatan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Jenis Lembaga <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={data.jenis_lembaga} 
                                                    onChange={e => updateData('jenis_lembaga', e.target.value)}
                                                    className={inputClasses(serverErrors.jenis_lembaga)}
                                                >
                                                    <option value="" disabled>Pilih jenis lembaga...</option>
                                                    <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                                                    <option value="TNI/Polri">TNI/Polri</option>
                                                    <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                                                    <option value="Ormas/NGO/Lembaga Masyarakat">Ormas / NGO / Lembaga Masyarakat</option>
                                                    <option value="BUMN/BUMD">BUMN / BUMD</option>
                                                    <option value="Swasta">Swasta</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                                {serverErrors.jenis_lembaga && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jenis_lembaga}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Nomor HP / WhatsApp <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.no_hp} 
                                                    onChange={e => updateData('no_hp', e.target.value)}
                                                    className={inputClasses(serverErrors.no_hp)} 
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                                {serverErrors.no_hp && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.no_hp}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Email Aktif <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email" 
                                                    value={data.email} 
                                                    onChange={e => updateData('email', e.target.value)}
                                                    className={inputClasses(serverErrors.email)} 
                                                    placeholder="email@contoh.com"
                                                />
                                                {serverErrors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.email}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                                        <button 
                                            type="button" 
                                            onClick={nextStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 cursor-pointer"
                                        >
                                            <span>Lanjut ke Detail</span>
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>

                                {/* STEP 2: Detail Kerjasama */}
                                <div className={step === 2 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Detail Kerjasama</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Berikan rincian maksud, tujuan, serta ruang lingkup kerjasama yang diusulkan.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nama / Judul Kerjasama <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.judul_kerjasama} 
                                                onChange={e => updateData('judul_kerjasama', e.target.value)}
                                                className={inputClasses(serverErrors.judul_kerjasama)} 
                                                placeholder="Contoh: Kerjasama Pendidikan Politik Mahasiswa"
                                            />
                                            {serverErrors.judul_kerjasama && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.judul_kerjasama}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Latar Belakang <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={data.latar_belakang} 
                                                onChange={e => updateData('latar_belakang', e.target.value)}
                                                rows={3} 
                                                className={`${inputClasses(serverErrors.latar_belakang)} resize-none leading-relaxed`} 
                                                placeholder="Jelaskan secara singkat latar belakang mengapa kerjasama ini diajukan..."
                                            ></textarea>
                                            {serverErrors.latar_belakang && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.latar_belakang}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Maksud dan Tujuan <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.maksud_tujuan} 
                                                    onChange={e => updateData('maksud_tujuan', e.target.value)}
                                                    rows={3} 
                                                    className={`${inputClasses(serverErrors.maksud_tujuan)} resize-none leading-relaxed`} 
                                                    placeholder="Tujuan spesifik yang ingin dicapai..."
                                                ></textarea>
                                                {serverErrors.maksud_tujuan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.maksud_tujuan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Bentuk / Ruang Lingkup <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.ruang_lingkup} 
                                                    onChange={e => updateData('ruang_lingkup', e.target.value)}
                                                    rows={3} 
                                                    className={`${inputClasses(serverErrors.ruang_lingkup)} resize-none leading-relaxed`} 
                                                    placeholder="Batasan atau cakupan dari kerjasama..."
                                                ></textarea>
                                                {serverErrors.ruang_lingkup && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.ruang_lingkup}</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Rencana Kegiatan <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.rencana_kegiatan} 
                                                    onChange={e => updateData('rencana_kegiatan', e.target.value)}
                                                    rows={2} 
                                                    className={`${inputClasses(serverErrors.rencana_kegiatan)} resize-none leading-relaxed`} 
                                                    placeholder="Garis besar pelaksanaan..."
                                                ></textarea>
                                                {serverErrors.rencana_kegiatan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.rencana_kegiatan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Jangka Waktu Kerjasama <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.jangka_waktu} 
                                                    onChange={e => updateData('jangka_waktu', e.target.value)}
                                                    className={inputClasses(serverErrors.jangka_waktu)} 
                                                    placeholder="Contoh: 1 Tahun, Sepanjang Tahapan Pilkada 2024"
                                                />
                                                {serverErrors.jangka_waktu && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jangka_waktu}</p>}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Keterangan Tambahan <span className="text-xs text-neutral-400 font-normal">(Opsional)</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.keterangan_tambahan} 
                                                onChange={e => updateData('keterangan_tambahan', e.target.value)}
                                                className={inputClasses(serverErrors.keterangan_tambahan)} 
                                                placeholder="Informasi relevan lainnya..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                                        <button 
                                            type="button" 
                                            onClick={prevStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 h-12 border border-neutral-300 text-neutral-700 bg-card hover:bg-neutral-50 font-bold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={nextStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 cursor-pointer"
                                        >
                                            <span>Lanjut ke Dokumen</span>
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>

                                {/* STEP 3: Dokumen */}
                                <div className={step === 3 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Unggah Dokumen</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Lengkapi dokumen resmi yang disyaratkan untuk kerjasama.</p>
                                        
                                        {data.jenis_lembaga && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                                                <span className="font-semibold">Syarat legalitas untuk {data.jenis_lembaga}:</span><br/>
                                                {getLegalitasRequirement()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                Surat Permohonan / Penawaran Kerjasama <span className="text-red-500">*</span>
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                                                    data.dokumen_surat 
                                                        ? 'border-green-400 bg-green-50/50' 
                                                        : serverErrors.dokumen_surat 
                                                            ? 'border-red-400 bg-red-50/50' 
                                                            : 'border-neutral-300 hover:border-kpu-primary hover:bg-neutral-50/80 cursor-pointer bg-card'
                                                }`}
                                                onClick={() => !data.dokumen_surat && suratInputRef.current?.click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={suratInputRef} 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png" 
                                                    onChange={handleFileChange('dokumen_surat', suratInputRef)} 
                                                />
                                                {data.dokumen_surat ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-3">
                                                            <File className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-bold text-neutral-900">{data.dokumen_surat.name}</p>
                                                        <p className="text-xs text-neutral-600 mt-1">{(data.dokumen_surat.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        <Button 
                                                            type="button" variant="outline" size="sm" 
                                                            className="mt-4 rounded-lg h-8 text-xs bg-card cursor-pointer" 
                                                            onClick={(e) => removeFile('dokumen_surat', suratInputRef, e)}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-14 h-14 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center mb-4">
                                                            <UploadCloud className="w-7 h-7" />
                                                        </div>
                                                        <p className="text-sm font-bold text-neutral-800 mb-1">Upload Surat Permohonan</p>
                                                        <p className="text-xs text-neutral-500">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                            {serverErrors.dokumen_surat && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_surat}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                Proposal Kerjasama <span className="text-red-500">*</span>
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                                    data.dokumen_proposal 
                                                        ? 'border-green-400 bg-green-50/50' 
                                                        : serverErrors.dokumen_proposal
                                                            ? 'border-red-400 bg-red-50/50'
                                                            : 'border-neutral-300 hover:border-kpu-primary hover:bg-neutral-50/80 cursor-pointer bg-card'
                                                }`}
                                                onClick={() => !data.dokumen_proposal && proposalInputRef.current?.click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={proposalInputRef} 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png" 
                                                    onChange={handleFileChange('dokumen_proposal', proposalInputRef)} 
                                                />
                                                {data.dokumen_proposal ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                                                            <File className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-neutral-900">{data.dokumen_proposal.name}</p>
                                                        <Button 
                                                            type="button" variant="outline" size="sm" 
                                                            className="mt-3 rounded-lg h-8 text-xs cursor-pointer" 
                                                            onClick={(e) => removeFile('dokumen_proposal', proposalInputRef, e)}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                                                        <p className="text-[13px] font-bold text-neutral-800 mb-1">Upload Proposal Kerjasama</p>
                                                        <p className="text-xs text-neutral-500">Maks. 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                            {serverErrors.dokumen_proposal && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_proposal}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                Dokumen Legalitas Pemohon <span className="text-red-500">*</span>
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                                    data.dokumen_legalitas 
                                                        ? 'border-green-400 bg-green-50/50' 
                                                        : serverErrors.dokumen_legalitas
                                                            ? 'border-red-400 bg-red-50/50'
                                                            : 'border-neutral-300 hover:border-kpu-primary hover:bg-neutral-50/80 cursor-pointer bg-card'
                                                }`}
                                                onClick={() => !data.dokumen_legalitas && legalitasInputRef.current?.click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={legalitasInputRef} 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png,.zip,.rar" 
                                                    onChange={handleFileChange('dokumen_legalitas', legalitasInputRef, 10)} 
                                                />
                                                {data.dokumen_legalitas ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                                                            <File className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-neutral-900">{data.dokumen_legalitas.name}</p>
                                                        <Button 
                                                            type="button" variant="outline" size="sm" 
                                                            className="mt-3 rounded-lg h-8 text-xs cursor-pointer" 
                                                            onClick={(e) => removeFile('dokumen_legalitas', legalitasInputRef, e)}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                                                        <p className="text-[13px] font-bold text-neutral-800 mb-1">Upload Dokumen Legalitas (Bisa dalam format ZIP/RAR)</p>
                                                        <p className="text-xs text-neutral-500">Maks. 10MB</p>
                                                    </div>
                                                )}
                                            </div>
                                            {serverErrors.dokumen_legalitas && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_legalitas}</p>}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                    Draft MoU / PKS Awal <span className="text-xs text-neutral-400 font-normal">(Opsional)</span>
                                                </label>
                                                <div 
                                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                                        data.dokumen_draft 
                                                            ? 'border-green-400 bg-green-50/50' 
                                                            : 'border-neutral-300 hover:border-kpu-primary hover:bg-neutral-50/80 cursor-pointer bg-card'
                                                    }`}
                                                    onClick={() => !data.dokumen_draft && draftInputRef.current?.click()}
                                                >
                                                    <input 
                                                        type="file" 
                                                        ref={draftInputRef} 
                                                        className="hidden" 
                                                        accept=".pdf,.doc,.docx" 
                                                        onChange={handleFileChange('dokumen_draft', draftInputRef)} 
                                                    />
                                                    {data.dokumen_draft ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                                                                <File className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-sm font-bold text-neutral-900 truncate w-full">{data.dokumen_draft.name}</p>
                                                            <Button 
                                                                type="button" variant="outline" size="sm" 
                                                                className="mt-3 rounded-lg h-8 text-xs cursor-pointer" 
                                                                onClick={(e) => removeFile('dokumen_draft', draftInputRef, e)}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                                                            <p className="text-[13px] font-bold text-neutral-800 mb-1">Upload Draft MoU/PKS</p>
                                                            <p className="text-xs text-neutral-500">Maks. 5MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                    Dokumen Pendukung Lain <span className="text-xs text-neutral-400 font-normal">(Opsional)</span>
                                                </label>
                                                <div 
                                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                                        data.dokumen_pendukung 
                                                            ? 'border-green-400 bg-green-50/50' 
                                                            : 'border-neutral-300 hover:border-kpu-primary hover:bg-neutral-50/80 cursor-pointer bg-card'
                                                    }`}
                                                    onClick={() => !data.dokumen_pendukung && pendukungInputRef.current?.click()}
                                                >
                                                    <input 
                                                        type="file" 
                                                        ref={pendukungInputRef} 
                                                        className="hidden" 
                                                        accept=".pdf,.jpg,.jpeg,.png,.zip,.rar" 
                                                        onChange={handleFileChange('dokumen_pendukung', pendukungInputRef, 10)} 
                                                    />
                                                    {data.dokumen_pendukung ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                                                                <File className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-sm font-bold text-neutral-900 truncate w-full">{data.dokumen_pendukung.name}</p>
                                                            <Button 
                                                                type="button" variant="outline" size="sm" 
                                                                className="mt-3 rounded-lg h-8 text-xs cursor-pointer" 
                                                                onClick={(e) => removeFile('dokumen_pendukung', pendukungInputRef, e)}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                                                            <p className="text-[13px] font-bold text-neutral-800 mb-1">Upload Dokumen Lain</p>
                                                            <p className="text-xs text-neutral-500">Maks. 10MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                                        <button 
                                            type="button" 
                                            onClick={prevStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 h-12 border border-neutral-300 text-neutral-700 bg-card hover:bg-neutral-50 font-bold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={nextStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 cursor-pointer"
                                        >
                                            <span>Lanjut ke Review</span>
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>

                                {/* STEP 4: Review & Submit */}
                                <div className={step === 4 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Konfirmasi Permohonan</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Periksa kembali data Anda sebelum mengirimkan permohonan.</p>
                                    </div>

                                    <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 mb-6 space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-3">Data Pemohon</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-[13px]">
                                                <div><span className="text-neutral-500 block mb-0.5">Nama Lengkap</span><span className="font-semibold text-neutral-900">{data.nama || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Instansi / Organisasi</span><span className="font-semibold text-neutral-900">{data.instansi || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Jabatan</span><span className="font-semibold text-neutral-900">{data.jabatan || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Jenis Lembaga</span><span className="font-semibold text-neutral-900">{data.jenis_lembaga || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Nomor HP/WA</span><span className="font-semibold text-neutral-900">{data.no_hp || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Email</span><span className="font-semibold text-neutral-900">{data.email || '-'}</span></div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-3">Detail Kerjasama</h4>
                                            <div className="grid grid-cols-1 gap-y-3 text-[13px]">
                                                <div><span className="text-neutral-500 block mb-0.5">Nama/Judul Kerjasama</span><span className="font-semibold text-neutral-900">{data.judul_kerjasama || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Maksud & Tujuan</span><span className="font-semibold text-neutral-900">{data.maksud_tujuan || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Ruang Lingkup</span><span className="font-semibold text-neutral-900">{data.ruang_lingkup || '-'}</span></div>
                                                <div><span className="text-neutral-500 block mb-0.5">Jangka Waktu</span><span className="font-semibold text-neutral-900">{data.jangka_waktu || '-'}</span></div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-3">Dokumen Terlampir</h4>
                                            <ul className="space-y-2 text-[13px]">
                                                {data.dokumen_surat && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span className="font-medium">Surat Permohonan</span></li>}
                                                {data.dokumen_proposal && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span className="font-medium">Proposal Kerjasama</span></li>}
                                                {data.dokumen_legalitas && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span className="font-medium">Dokumen Legalitas</span></li>}
                                                {data.dokumen_draft && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span className="font-medium">Draft MoU/PKS</span></li>}
                                                {data.dokumen_pendukung && <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> <span className="font-medium">Dokumen Pendukung Lain</span></li>}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 mb-6">
                                        <div className="mt-0.5 shrink-0">
                                            <div className="relative flex items-center justify-center w-5 h-5">
                                                <input
                                                    type="checkbox"
                                                    id="pernyataan"
                                                    checked={data.pernyataan}
                                                    onChange={e => updateData('pernyataan', e.target.checked)}
                                                    className="peer appearance-none w-5 h-5 border-2 border-blue-300 rounded-[6px] checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all cursor-pointer"
                                                />
                                                <CheckCircle2 className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                            </div>
                                        </div>
                                        <label htmlFor="pernyataan" className="text-[13px] sm:text-sm text-blue-900 leading-relaxed cursor-pointer select-none">
                                            Saya menyatakan bahwa data dan dokumen yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                                        </label>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                                        <button 
                                            type="button" 
                                            onClick={prevStep}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 h-12 border border-neutral-300 text-neutral-700 bg-card hover:bg-neutral-50 font-bold text-sm shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali Edit</span>
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Memproses...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Kirim Permohonan</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
} 

