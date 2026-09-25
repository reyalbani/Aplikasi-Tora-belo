import { Head, Link } from '@inertiajs/react';
import { Activity, AlertCircle, ArrowLeft, BookOpen, Building2, Calendar, CheckCircle2, Clock, Copy, ExternalLink, File, FileText, Info, Layers, Loader2, Mail, MapPin, PhoneCall, Target, UploadCloud, User, Users, Mail as MailIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState, useRef, FormEvent } from 'react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';
import { PublicFooter } from '@/components/public/public-footer';

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

export default function PengantaranSurat({ layanan, bukuTamu }: Props) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    
    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama_pemohon: bukuTamu?.nama || '',
        nik: '',
        no_hp: bukuTamu?.no_hp || '',
        email: bukuTamu?.email || '',
        alamat_pemohon: '',
        
        jenis_surat: '',
        nomor_surat: '',
        tanggal_surat: '',
        perihal: '',
        instansi_tujuan: '',
        nama_penerima: '',
        no_hp_penerima: '',
        alamat_tujuan: '',
        catatan_pengantaran: '',
        catatan_tambahan: '',
        
        dokumen_surat: null as File | null,
        dokumen_pendukung: null as File | null,
        pernyataan: false,
    });

    const suratInputRef = useRef<HTMLInputElement>(null);
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
            if (!data.nama_pemohon.trim() || !data.nik.trim() || !data.no_hp.trim() || !data.email.trim() || !data.alamat_pemohon.trim()) {
                isValid = false;
            }
        } else if (step === 2) {
            if (!data.jenis_surat || !data.tanggal_surat || !data.perihal.trim() || !data.instansi_tujuan.trim() || !data.nama_penerima.trim() || !data.alamat_tujuan.trim()) {
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
            alert('Dokumen surat wajib diunggah.');
            return;
        }
        
        if (!data.pernyataan) {
            alert('Anda harus menyatakan bahwa data dan dokumen adalah benar.');
            return;
        }
        
        setIsSubmitting(true);
        setServerErrors({});
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value as any);
                }
            }
        });
        
        const getXsrfToken = () => {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
            return '';
        };

        try {
            const response = await fetch('/layanan/pengantaran-surat', {
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
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Pengajuan Berhasil!</h2>
                        <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
                            Permohonan pengantaran surat Anda telah berhasil dikirim.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-6 max-w-md mx-auto mb-10 shadow-sm dark:shadow-none relative text-left">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Nomor Pengajuan</p>
                                    <p className="text-2xl font-bold text-kpu-primary">{successData.kode_tiket}</p>
                                    <Button 
                                        type="button" 
                                        onClick={copyToClipboard} 
                                        variant="outline" 
                                        size="sm"
                                        className="mt-2 text-xs rounded-lg px-3 py-1"
                                    >
                                        {copied ? <CheckCircle2 className="w-3 h-3 mr-1.5 text-green-600" /> : <Copy className="w-3 h-3 mr-1.5" />}
                                        {copied ? 'Tersalin' : 'Salin Nomor'}
                                    </Button>
                                </div>
                                <div className="border-t border-neutral-200 pt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Tanggal Pengajuan</p>
                                        <p className="text-sm font-semibold text-neutral-800">{successData.tanggal_pengajuan || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Nama Pemohon</p>
                                        <p className="text-sm font-semibold text-neutral-800">{successData.nama_pemohon || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">Tujuan Pengantaran</p>
                                        <p className="text-sm font-semibold text-neutral-800">{successData.tujuan_pengantaran || '-'}</p>
                                    </div>
                                </div>
                                <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
                                    <span className="text-sm text-neutral-600">Status Awal:</span>
                                    <span className="text-sm font-bold text-kpu-primary uppercase bg-red-50 px-3 py-1 rounded-full border border-red-100">{successData.status || 'MENUNGGU VERIFIKASI'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Lihat Status Pengajuan →</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl px-8 w-full sm:w-auto h-12 text-neutral-700 font-semibold border-neutral-200">
                                <Link href="/layanan">Kembali ke Layanan</Link>
                            </Button>
                        </div>
                    </div>
                </main>
                
                <div className="mt-10 text-center pb-10">
                    <p className="text-xs text-neutral-400 font-medium">
                        &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={`${layanan.nama_layanan} - TORA BELO`} />

            <ServiceHeader 
                title={layanan.nama_layanan} 
                backUrl="/"
            />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                
                <div className="space-y-6 mt-2 animate-fade-in">
                    {/* Header Info of Form */}
                    <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60">
                        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                                <MailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1 leading-tight tracking-tight">
                                    PENGAJUAN PENGANTARAN SURAT
                                </h1>
                                <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                    Lengkapi data permohonan pengantaran surat melalui TORA BELO.
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
                                { num: 1, label: 'DATA PEMOHON', icon: User },
                                { num: 2, label: 'DATA SURAT & TUJUAN', icon: MailIcon },
                                { num: 3, label: 'DOKUMEN & KONFIRMASI', icon: UploadCloud }
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
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Data Pemohon</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Masukkan identitas dan informasi kontak pemohon.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nama Lengkap / Nama Pemohon <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.nama_pemohon} 
                                                onChange={e => updateData('nama_pemohon', e.target.value)}
                                                className={inputClasses(serverErrors.nama_pemohon)} 
                                                placeholder="Nama lengkap pemohon"
                                            />
                                            {serverErrors.nama_pemohon && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nama_pemohon}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nomor Identitas / NIK <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.nik} 
                                                onChange={e => updateData('nik', e.target.value)}
                                                className={inputClasses(serverErrors.nik)} 
                                                placeholder="Masukkan 16 digit NIK"
                                            />
                                            {serverErrors.nik && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nik}</p>}
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
                                                Email <span className="text-red-500">*</span>
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
                                            Alamat Pemohon <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.alamat_pemohon} 
                                            onChange={e => updateData('alamat_pemohon', e.target.value)}
                                            rows={3} 
                                            className={`${inputClasses(serverErrors.alamat_pemohon)} resize-none leading-relaxed`} 
                                            placeholder="Tuliskan alamat lengkap pemohon..."
                                        ></textarea>
                                        {serverErrors.alamat_pemohon && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.alamat_pemohon}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={nextStep} 
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 cursor-pointer"
                                    >
                                        <span>Lanjutkan</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            </div>

                            {/* STEP 2: Data Surat & Tujuan */}
                            <div className={step === 2 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Data Surat & Tujuan</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Masukkan informasi surat yang akan diajukan untuk pengantaran.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Jenis Surat <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.jenis_surat} 
                                                onChange={e => updateData('jenis_surat', e.target.value)}
                                                className={inputClasses(serverErrors.jenis_surat)}
                                            >
                                                <option value="" disabled>Pilih jenis surat...</option>
                                                <option value="Surat Dinas">Surat Dinas</option>
                                                <option value="Surat Undangan">Surat Undangan</option>
                                                <option value="Surat Permohonan">Surat Permohonan</option>
                                                <option value="Surat Pemberitahuan">Surat Pemberitahuan</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                            {serverErrors.jenis_surat && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jenis_surat}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nomor Surat
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.nomor_surat} 
                                                onChange={e => updateData('nomor_surat', e.target.value)}
                                                className={inputClasses(serverErrors.nomor_surat)} 
                                                placeholder="Contoh: 123/KPU/2026"
                                            />
                                            {serverErrors.nomor_surat && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nomor_surat}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Tanggal Surat <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date" 
                                                value={data.tanggal_surat} 
                                                onChange={e => updateData('tanggal_surat', e.target.value)}
                                                className={inputClasses(serverErrors.tanggal_surat)} 
                                            />
                                            {serverErrors.tanggal_surat && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.tanggal_surat}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Perihal Surat <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.perihal} 
                                                onChange={e => updateData('perihal', e.target.value)}
                                                className={inputClasses(serverErrors.perihal)} 
                                                placeholder="Perihal atau subjek surat" 
                                            />
                                            {serverErrors.perihal && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.perihal}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nama Instansi/Tujuan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.instansi_tujuan} 
                                                onChange={e => updateData('instansi_tujuan', e.target.value)}
                                                className={inputClasses(serverErrors.instansi_tujuan)} 
                                                placeholder="Nama Instansi Tujuan"
                                            />
                                            {serverErrors.instansi_tujuan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.instansi_tujuan}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nama Penerima <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.nama_penerima} 
                                                onChange={e => updateData('nama_penerima', e.target.value)}
                                                className={inputClasses(serverErrors.nama_penerima)} 
                                                placeholder="Nama penerima surat"
                                            />
                                            {serverErrors.nama_penerima && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nama_penerima}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                                Nomor Telepon Penerima
                                            </label>
                                            <input
                                                type="text" 
                                                value={data.no_hp_penerima} 
                                                onChange={e => updateData('no_hp_penerima', e.target.value)}
                                                className={inputClasses(serverErrors.no_hp_penerima)} 
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {serverErrors.no_hp_penerima && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.no_hp_penerima}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                            Alamat Tujuan Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.alamat_tujuan} 
                                            onChange={e => updateData('alamat_tujuan', e.target.value)}
                                            rows={3} 
                                            className={`${inputClasses(serverErrors.alamat_tujuan)} resize-none leading-relaxed`} 
                                            placeholder="Tuliskan alamat lengkap tujuan surat..."
                                        ></textarea>
                                        {serverErrors.alamat_tujuan && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.alamat_tujuan}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">
                                            Catatan Pengantaran
                                        </label>
                                        <textarea
                                            value={data.catatan_pengantaran} 
                                            onChange={e => updateData('catatan_pengantaran', e.target.value)}
                                            rows={2} 
                                            className={`${inputClasses(serverErrors.catatan_pengantaran)} resize-none leading-relaxed`} 
                                            placeholder="Catatan tambahan (Opsional)"
                                        ></textarea>
                                        {serverErrors.catatan_pengantaran && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.catatan_pengantaran}</p>}
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
                                        <span>Lanjutkan</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            </div>

                            {/* STEP 3: Dokumen & Konfirmasi */}
                            <div className={step === 3 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Dokumen & Konfirmasi</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Upload dokumen surat dan pastikan data pengajuan sudah benar.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                            Upload Surat <span className="text-red-500">*</span>
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
                                                    <p className="text-sm font-bold text-neutral-800 mb-1">Klik untuk memilih file surat</p>
                                                    <p className="text-xs text-neutral-500">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                        {serverErrors.dokumen_surat && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_surat}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
                                            Dokumen Pendukung <span className="text-xs text-neutral-400 font-normal">(Opsional)</span>
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
                                                accept=".pdf,.jpg,.jpeg,.png" 
                                                onChange={handleFileChange('dokumen_pendukung', pendukungInputRef)} 
                                            />
                                            {data.dokumen_pendukung ? (
                                                <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-green-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                                                            <File className="w-5 h-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-neutral-900 truncate max-w-[150px] sm:max-w-[300px]">{data.dokumen_pendukung.name}</p>
                                                            <p className="text-xs text-neutral-600">{(data.dokumen_pendukung.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 z-10 cursor-pointer" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            updateData('dokumen_pendukung', null); 
                                                            if (pendukungInputRef.current) pendukungInputRef.current.value = ''; 
                                                        }}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <p className="text-sm font-semibold text-neutral-700 mb-1">Upload dokumen tambahan (jika ada)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ringkasan Pengajuan */}
                                    <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-5 mt-6">
                                        <h4 className="font-bold text-sm text-neutral-900 mb-4 pb-2 border-b border-neutral-200">RINGKASAN PENGAJUAN</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-neutral-500 text-xs">Nama Pemohon</p>
                                                <p className="font-semibold">{data.nama_pemohon || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-xs">Nomor WhatsApp</p>
                                                <p className="font-semibold">{data.no_hp || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-xs">Jenis Surat</p>
                                                <p className="font-semibold">{data.jenis_surat || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-xs">Nomor Surat</p>
                                                <p className="font-semibold">{data.nomor_surat || '-'}</p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <p className="text-neutral-500 text-xs">Perihal</p>
                                                <p className="font-semibold">{data.perihal || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-xs">Instansi/Tujuan</p>
                                                <p className="font-semibold">{data.instansi_tujuan || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 text-xs">Nama Penerima</p>
                                                <p className="font-semibold">{data.nama_penerima || '-'}</p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <p className="text-neutral-500 text-xs">Alamat Tujuan</p>
                                                <p className="font-semibold">{data.alamat_tujuan || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-5 flex items-start gap-3">
                                        <div className="pt-0.5">
                                            <input 
                                                type="checkbox" 
                                                id="pernyataan" 
                                                checked={data.pernyataan}
                                                onChange={(e) => updateData('pernyataan', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-kpu-primary focus:ring-kpu-primary cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="pernyataan" className="text-sm text-neutral-700 leading-relaxed cursor-pointer select-none">
                                            Saya menyatakan bahwa data dan dokumen yang saya sampaikan adalah benar.
                                        </label>
                                    </div>
                                    {serverErrors.pernyataan && <p className="text-xs text-red-500 font-medium px-1">{serverErrors.pernyataan}</p>}
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
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-8 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Mengirim...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Kirim Pengajuan</span>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div className="mt-10 text-center pb-10">
                    <p className="text-xs text-neutral-400 font-medium">
                        &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                    </p>
                </div>
            </main>
        </div>
    );
}
