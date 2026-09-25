import { Head, Link } from '@inertiajs/react';
import { Activity, AlertCircle, ArrowLeft, BookOpen, Building2, Calendar, CheckCircle2, Clock, Copy, ExternalLink, File, FileText, Info, Layers, Loader2, Mail, MapPin, PhoneCall, Target, UploadCloud, User, Users } from 'lucide-react';


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

export default function PendidikanPemilih({ layanan, bukuTamu }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ kode_tiket: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    
    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama: bukuTamu?.nama || '',
        lembaga: bukuTamu?.instansi || '',
        no_hp: bukuTamu?.no_hp || '',
        email: bukuTamu?.email || '',
        alamat: '',
        
        waktu_kegiatan: '',
        tempat_kegiatan: '',
        jumlah_peserta: '',
        profil_peserta: '',
        topik_materi: '',
        
        bentuk_kegiatan: '',
        
        dokumen_surat: null as File | null,
        dokumen_proposal: null as File | null,
        pernyataan: false,
    });

    const suratInputRef = useRef<HTMLInputElement>(null);
    const proposalInputRef = useRef<HTMLInputElement>(null);

    const procedures = [
        { 
            title: "Pengajuan Permohonan Daring", 
            desc: "Pemohon mengisi formulir permohonan fasilitasi Pendidikan Pemilih secara daring pada portal TORA BELO serta mengunggah surat permohonan resmi dan proposal (jika ada)." 
        },
        { 
            title: "Penerimaan & Verifikasi Berkas", 
            desc: "Petugas Front Office/Subbagian Teknis KPU Kota Palu menerima, memeriksa kelengkapan administratif, dan mencatat permohonan ke dalam sistem." 
        },
        { 
            title: "Disposisi Pimpinan", 
            desc: "Permohonan diteruskan secara berjenjang kepada Ketua/Anggota KPU Kota Palu dan Sekretaris untuk mendapatkan arahan serta disposisi pelaksanaan ke Subbagian Partisipasi, Hubungan Masyarakat dan SDM." 
        },
        { 
            title: "Kajian & Koordinasi Teknis", 
            desc: "Subbagian Parhubmas dan SDM melakukan kajian kesesuaian materi, ketersediaan narasumber/fasilitator, serta penyusunan timeline kegiatan." 
        },
        { 
            title: "Konfirmasi & Persetujuan", 
            desc: "KPU Kota Palu menyampaikan konfirmasi resmi persetujuan jadwal, nama narasumber, dan metode fasilitasi kepada pemohon melalui sistem TORA BELO." 
        },
        { 
            title: "Pelaksanaan Kegiatan", 
            desc: "Pelaksanaan fasilitasi Pendidikan Pemilih sesuai metode yang disepakati (tatap muka, kunjungan Rumah Pintar Pemilu/RPP, KPU Goes to School/Campus, atau webinar)." 
        },
        { 
            title: "Evaluasi & Dokumentasi", 
            desc: "Pengisian Survei Kepuasan Masyarakat (SKM) oleh pemohon/peserta serta pengunggahan dokumentasi hasil kegiatan untuk laporan pertanggungjawaban." 
        }
    ];

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

    const handleFileChange = (field: keyof typeof data, ref: React.RefObject<HTMLInputElement | null>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB.');
                if (ref.current) ref.current.value = '';
                return;
            }
            updateData(field, file);
        }
    };

    const nextStep = () => {
        let isValid = true;
        if (step === 1) {
            if (!data.nama.trim() || !data.lembaga.trim() || !data.no_hp.trim() || !data.email.trim() || !data.alamat.trim()) {
                isValid = false;
            }
        } else if (step === 2) {
            if (!data.waktu_kegiatan.trim() || !data.tempat_kegiatan.trim() || !data.jumlah_peserta || !data.profil_peserta.trim() || !data.topik_materi.trim() || !data.bentuk_kegiatan) {
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
        
        if (!data.dokumen_surat) {
            alert('Surat permohonan resmi wajib diunggah.');
            return;
        }
        
        if (!data.pernyataan) {
            alert('Anda harus menyetujui pernyataan komitmen netralitas kegiatan.');
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
            const response = await fetch('/layanan/pendidikan-pemilih', {
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
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Permohonan Pendidikan Pemilih Berhasil Dikirim!</h2>
                        <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
                            Permohonan fasilitasi kegiatan Anda telah berhasil dicatat pada sistem TORA BELO dan sedang menunggu pemeriksaan berkas oleh Petugas KPU Kota Palu.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-8 max-w-md mx-auto mb-10 shadow-sm dark:shadow-none relative">
                            <p className="text-xs sm:text-sm text-neutral-500 mb-2 font-bold uppercase tracking-wider">KODE TRACKER / TIKET ANDA</p>
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
                                {copied ? 'Kode Berhasil Disalin' : 'Salin Kode Tracker'}
                            </Button>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-6 font-medium px-4">Gunakan kode ini untuk memantau status perkembangan layanan melalui menu Cek Status TORA BELO.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Cek Status Permohonan →</Link>
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
                            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
                                    {layanan.nama_layanan}
                                </h1>
                                <span className="bg-red-50 text-kpu-primary border border-red-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Sosialisasi & Edukasi
                                </span>
                            </div>
                            <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed mt-1">
                                Layanan fasilitasi sosialisasi kepemiluan, narasumber, dan edukasi pemilih resmi KPU Kota Palu.
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
                            <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                            <span>Ajukan Permohonan</span>
                        </button>
                    )}
                </div>

                {showForm ? (
                    // ----------------------------------------------------
                    // FORM PENGISIAN PENDIDIKAN PEMILIH
                    // ----------------------------------------------------
                    <div className="space-y-6 mt-6 animate-fade-in">
                        {/* Header Info of Form */}
                        <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1 leading-tight tracking-tight">
                                        Formulir Permohonan Pendidikan Pemilih
                                    </h1>
                                    <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                        Lengkapi rincian data permohonan fasilitasi edukasi pemilih untuk instansi, lembaga, atau komunitas Anda.
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
                                    { num: 1, label: 'Identitas Pemohon', icon: User },
                                    { num: 2, label: 'Rincian Kegiatan', icon: Calendar },
                                    { num: 3, label: 'Dokumen & Pernyataan', icon: UploadCloud }
                                ].map((item) => {
                                    const isActive = step === item.num;
                                    const isPassed = step > item.num;
                                    return (
                                        <div key={item.num} className={`flex-1 p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-colors ${isActive ? 'bg-card border-b-2 border-kpu-primary text-kpu-primary' : isPassed ? 'text-neutral-600' : 'text-neutral-400'}`}>
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-sm font-bold shrink-0 ${isActive ? 'bg-kpu-primary text-white shadow-xs' : isPassed ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-100 text-neutral-400'}`}>
                                                {isPassed ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : item.num}
                                            </div>
                                            <span className={`text-[11px] sm:text-sm font-semibold text-center sm:text-left ${isActive ? 'text-kpu-primary' : ''}`}>{item.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={submit} className="p-5 sm:p-8 md:p-10">
                                {/* STEP 1: Data Pemohon */}
                                <div className={step === 1 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Identitas Pemohon & Lembaga</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Masukkan informasi kontak penanggung jawab dan lembaga pemohon.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Nama Lengkap / Penanggung Jawab <span className="text-red-500">*</span>
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
                                                    Nama Lembaga / Sekolah / Kampus / Ormas <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.lembaga} 
                                                    onChange={e => updateData('lembaga', e.target.value)}
                                                    className={inputClasses(serverErrors.lembaga)} 
                                                    placeholder="Contoh: SMAN 1 Palu, Universitas Tadulako, dsb."
                                                />
                                                {serverErrors.lembaga && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.lembaga}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
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

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Alamat Lengkap Lembaga / Pemohon <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={data.alamat} 
                                                onChange={e => updateData('alamat', e.target.value)}
                                                rows={3} 
                                                className={`${inputClasses(serverErrors.alamat)} resize-none leading-relaxed`} 
                                                placeholder="Tuliskan alamat lengkap lembaga atau alamat sekretariat..."
                                            ></textarea>
                                            {serverErrors.alamat && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.alamat}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                                        <button 
                                            type="button" 
                                            onClick={nextStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 cursor-pointer"
                                        >
                                            <span>Lanjut ke Kegiatan</span>
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>

                                {/* STEP 2: Detail Kegiatan */}
                                <div className={step === 2 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Rencana Pelaksanaan Kegiatan</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Berikan gambaran waktu, lokasi, sasaran, dan topik pendidikan pemilih yang diinginkan.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Waktu / Tanggal yang Diusulkan <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.waktu_kegiatan} 
                                                    onChange={e => updateData('waktu_kegiatan', e.target.value)}
                                                    className={inputClasses(serverErrors.waktu_kegiatan)} 
                                                    placeholder="Contoh: 15 Oktober 2026, 09:00 WITA"
                                                />
                                                {serverErrors.waktu_kegiatan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.waktu_kegiatan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Tempat / Lokasi Pelaksanaan <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text" 
                                                    value={data.tempat_kegiatan} 
                                                    onChange={e => updateData('tempat_kegiatan', e.target.value)}
                                                    className={inputClasses(serverErrors.tempat_kegiatan)} 
                                                    placeholder="Contoh: Aula SMAN 1 Palu / Ruang RPP KPU"
                                                />
                                                {serverErrors.tempat_kegiatan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.tempat_kegiatan}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Bentuk / Metode Kegiatan <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={data.bentuk_kegiatan} 
                                                    onChange={e => updateData('bentuk_kegiatan', e.target.value)}
                                                    className={inputClasses(serverErrors.bentuk_kegiatan)}
                                                >
                                                    <option value="" disabled>Pilih bentuk kegiatan...</option>
                                                    <option value="Sosialisasi tatap muka">Sosialisasi tatap muka</option>
                                                    <option value="Kunjungan Rumah Pintar Pemilu/RPP">Kunjungan Rumah Pintar Pemilu/RPP KPU Kota Palu</option>
                                                    <option value="KPU Goes to School">KPU Goes to School</option>
                                                    <option value="KPU Goes to Campus">KPU Goes to Campus</option>
                                                    <option value="Webinar">Webinar / Daring</option>
                                                </select>
                                                {serverErrors.bentuk_kegiatan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.bentuk_kegiatan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                    Estimasi Jumlah Peserta <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number" 
                                                    value={data.jumlah_peserta} 
                                                    onChange={e => updateData('jumlah_peserta', e.target.value)}
                                                    className={inputClasses(serverErrors.jumlah_peserta)} 
                                                    placeholder="Contoh: 50" 
                                                    min="1"
                                                />
                                                {serverErrors.jumlah_peserta && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jumlah_peserta}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Profil / Sasaran Peserta <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.profil_peserta} 
                                                onChange={e => updateData('profil_peserta', e.target.value)}
                                                className={inputClasses(serverErrors.profil_peserta)} 
                                                placeholder="Contoh: Pemilih Pemula (Siswa Kelas XII), Pengurus OSIS, Mahasiswa Ilmu Politik"
                                            />
                                            {serverErrors.profil_peserta && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.profil_peserta}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Topik / Materi Pendidikan Pemilih yang Dibutuhkan <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={data.topik_materi} 
                                                onChange={e => updateData('topik_materi', e.target.value)}
                                                rows={3} 
                                                className={`${inputClasses(serverErrors.topik_materi)} resize-none leading-relaxed`} 
                                                placeholder="Jelaskan secara spesifik materi kepemiluan yang diharapkan (misal: Tata Cara Pemungutan Suara, Pentingnya Partisipasi Pemilih Pemula, Penegakan Hukum Pemilu, dll)..."
                                            ></textarea>
                                            {serverErrors.topik_materi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.topik_materi}</p>}
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

                                {/* STEP 3: Dokumen & Pernyataan */}
                                <div className={step === 3 ? 'block' : 'hidden'}>
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">Unggah Dokumen & Komitmen Layanan</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Lengkapi surat permohonan resmi dan konfirmasi komitmen netralitas kegiatan.</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                Surat Permohonan Fasilitasi (Ditujukan ke Ketua KPU Kota Palu) <span className="text-red-500">*</span>
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
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="mt-4 rounded-lg h-8 text-xs bg-card text-neutral-800 border-neutral-300 hover:bg-neutral-100 z-10 relative cursor-pointer" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                updateData('dokumen_surat', null); 
                                                                if (suratInputRef.current) suratInputRef.current.value = ''; 
                                                            }}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-14 h-14 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center mb-4">
                                                            <UploadCloud className="w-7 h-7" />
                                                        </div>
                                                        <p className="text-sm font-bold text-neutral-800 mb-1">Klik untuk memilih file surat permohonan</p>
                                                        <p className="text-xs text-neutral-500">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                            {serverErrors.dokumen_surat && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_surat}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                                Proposal Kegiatan / Kerangka Acuan Kerja (KAK) <span className="text-xs text-neutral-400 font-normal">(Opsional)</span>
                                            </label>
                                            <div 
                                                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                                                    data.dokumen_proposal 
                                                        ? 'border-green-400 bg-green-50/50' 
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
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="mt-3 rounded-lg h-7 text-xs bg-card cursor-pointer" 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                updateData('dokumen_proposal', null); 
                                                                if (proposalInputRef.current) proposalInputRef.current.value = ''; 
                                                            }}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                                                        <p className="text-xs font-semibold text-neutral-700">Unggah proposal atau rincian KAK (jika ada)</p>
                                                        <p className="text-[11px] text-neutral-400 mt-0.5">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-red-50/50 border border-red-200 p-5 rounded-[18px] flex items-start gap-4 mt-6">
                                            <input 
                                                type="checkbox" 
                                                id="pernyataan" 
                                                checked={data.pernyataan} 
                                                onChange={(e) => updateData('pernyataan', e.target.checked)} 
                                                className="w-5 h-5 mt-0.5 rounded text-kpu-primary focus:ring-kpu-primary border-neutral-300 cursor-pointer"
                                            />
                                            <label htmlFor="pernyataan" className="text-[13px] text-neutral-900 leading-relaxed font-medium cursor-pointer select-none">
                                                Saya menyatakan bahwa kegiatan ini bersifat <b>netral, non-partisan, serta bebas dari unsur kampanye politik praktis</b> dan data yang diajukan adalah benar.
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-between gap-3">
                                        <button 
                                            type="button" 
                                            disabled={isSubmitting} 
                                            onClick={prevStep} 
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 h-12 border border-neutral-300 text-neutral-700 bg-card hover:bg-neutral-50 font-bold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting || !data.pernyataan || !data.dokumen_surat}
                                            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl px-8 h-12 bg-kpu-primary hover:bg-red-700 shadow-sm dark:shadow-none hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/25 min-w-[220px] w-full sm:w-auto text-white font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                    <span>Mengirim Permohonan...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                                                    <span>Kirim Permohonan</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    // ----------------------------------------------------
                    // INFORMASI LAYANAN (Default View)
                    <ServiceInfoLayout
                        miniCards={[
                            {
                                title: "Pemohon",
                                content: "Masyarakat Umum, Komunitas, Sekolah, Kampus, Organisasi",
                                icon: <Users className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Waktu Penyelesaian",
                                content: <><span className="text-sm font-semibold text-neutral-900 leading-snug">3 Hari Kerja</span><br/><span className="text-xs text-neutral-500 font-normal">Sejak diverifikasi</span></>,
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
                        requirementsSubtitle="Pengajuan Online TORA BELO"
                        requirementsContent={
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">1</div>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                        Mengunggah Surat Permohonan Fasilitasi Pendidikan Pemilih yang ditujukan kepada Ketua KPU Kota Palu yang memuat identitas pengguna layanan meliputi nama, nama Lembaga/Institusi, dan kontak yang dapat dihubungi.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">2</div>
                                    <div className="pt-1 sm:pt-1.5">
                                        <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed mb-2">
                                            Pengguna layanan dapat melampirkan Proposal Kegiatan / Kerangka Acuan Kerja (KAK) singkat yang memuat:
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1.5 text-[13px] sm:text-sm text-neutral-600">
                                            <li>Waktu dan tempat pelaksanaan kegiatan yang diusulkan.</li>
                                            <li>Jumlah dan profil sasaran peserta.</li>
                                            <li>Topik / materi pendidikan kepemiluan yang dibutuhkan.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">3</div>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                        Kegiatan bersifat netral, non-partisan, serta bebas dari unsur kampanye atau politik praktis.
                                    </p>
                                </div>
                            </div>
                        }
                        procedures={[
                            {
                                title: "PENGAJUAN",
                                desc: "Pengguna layanan mengajukan permohonan melalui form TORA BELO atau datang langsung ke KPU Kota Palu."
                            },
                            {
                                title: "VERIFIKASI",
                                desc: "Petugas menerima dan memverifikasi kelengkapan surat permohonan dan proposal kegiatan."
                            },
                            {
                                title: "KOORDINASI TANGGAL & NARASUMBER",
                                desc: "KPU Kota Palu berkoordinasi dengan pemohon terkait penentuan waktu pelaksanaan dan narasumber yang akan hadir."
                            },
                            {
                                title: "PELAKSANAAN",
                                desc: "Pelaksanaan kegiatan sosialisasi dan pendidikan pemilih sesuai dengan kesepakatan bersama."
                            }
                        ]}
                        timeContent={
                            <>
                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed mb-4">
                                    Maksimal <span className="font-bold text-neutral-900">3 (tiga) hari kerja</span> sejak surat permohonan dan dokumen (proposal) diverifikasi.
                                </p>
                                <p className="text-[12px] sm:text-[13px] text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                    Waktu pelaksanaan kegiatan disesuaikan dengan kesepakatan bersama dan ketersediaan narasumber KPU Kota Palu.
                                </p>
                            </>
                        }
                        productsContent={
                            <ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Pelayanan informasi sosialisasi dan pendidikan pemilih.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Bahan/materi pendidikan pemilih (opsional/sesuai ketersediaan).</span>
                                </li>
                            </ul>
                        }
                    />
)}
                
                <div className="mt-10 text-center pb-10">
                    <p className="text-xs text-neutral-400 font-medium">
                        &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                    </p>
                </div>
            </main>
        </div>
    );
}




