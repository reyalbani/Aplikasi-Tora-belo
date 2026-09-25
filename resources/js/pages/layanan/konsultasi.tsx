import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Send, UploadCloud, Check, User, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, FormEvent } from 'react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';
import { router } from '@inertiajs/react';

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

export default function Konsultasi({ layanan, bukuTamu }: Props) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ kode_tiket: string, nama_pemohon?: string, topik_konsultasi?: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    
    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama_lengkap: bukuTamu?.nama || '',
        nik: '',
        no_hp: bukuTamu?.no_hp || '',
        email: bukuTamu?.email || '',
        instansi: bukuTamu?.instansi || '',
        alamat: '',
        jenis_konsultasi: '',
        judul_konsultasi: '',
        uraian_konsultasi: '',
        kanal_konsultasi: '',
        waktu_konsultasi: '',
        dokumen_pendukung: null as File | null,
        pernyataan: false,
    });

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

    const handleFileChange = (field: keyof typeof data, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateData(field, file);
        }
    };

    const nextStep = () => {
        setServerErrors({});
        if (step === 1) {
            if (!data.nama_lengkap.trim() || !data.no_hp.trim()) {
                setServerErrors({
                    nama_lengkap: !data.nama_lengkap.trim() ? 'Nama Lengkap wajib diisi' : '',
                    no_hp: !data.no_hp.trim() ? 'Nomor HP wajib diisi' : '',
                });
                return;
            }
        } else if (step === 2) {
            if (!data.jenis_konsultasi || !data.judul_konsultasi.trim() || !data.uraian_konsultasi.trim() || !data.kanal_konsultasi) {
                setServerErrors({
                    jenis_konsultasi: !data.jenis_konsultasi ? 'Topik Konsultasi wajib diisi' : '',
                    judul_konsultasi: !data.judul_konsultasi.trim() ? 'Judul Konsultasi wajib diisi' : '',
                    uraian_konsultasi: !data.uraian_konsultasi.trim() ? 'Uraian Konsultasi wajib diisi' : '',
                    kanal_konsultasi: !data.kanal_konsultasi ? 'Kanal Konsultasi wajib diisi' : '',
                });
                return;
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step + 1);
    };

    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step - 1);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!data.pernyataan) {
            setServerErrors({
                pernyataan: 'Anda harus menyetujui pernyataan kebenaran data.'
            });
            return;
        }

        setIsSubmitting(true);
        setServerErrors({});

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '' && key !== 'pernyataan') {
                formData.append(key, value as any);
            }
        });
        formData.append('pernyataan', data.pernyataan ? '1' : '0');

        fetch('/layanan/konsultasi', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        })
        .then(async response => {
            const result = await response.json();
            if (!response.ok) {
                if (response.status === 422) {
                    setServerErrors(result.errors || {});
                    if (result.errors) {
                        const errorKeys = Object.keys(result.errors);
                        if (['nama_lengkap', 'no_hp', 'nik', 'email', 'instansi', 'alamat'].some(k => errorKeys.includes(k))) setStep(1);
                        else if (['jenis_konsultasi', 'judul_konsultasi', 'uraian_konsultasi', 'kanal_konsultasi', 'waktu_konsultasi'].some(k => errorKeys.includes(k))) setStep(2);
                        else setStep(3);
                    }
                } else {
                    setServerErrors({ global: result.message || 'Terjadi kesalahan sistem' });
                }
                throw new Error('Validation failed');
            }
            return result;
        })
        .then(result => {
            setSuccessData(result);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(() => {
            // Error handled above
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    const inputClasses = (hasError: any) => 
        `flex h-11 w-full rounded-xl border px-4 py-2 text-[13px] sm:text-sm bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
            hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-neutral-200 hover:border-neutral-300 focus:border-kpu-primary focus:ring-kpu-primary/20'
        }`;

    if (successData) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex flex-col">
                <Head title="Pengajuan Konsultasi Berhasil - TORA BELO" />
                <ServiceHeader title="Layanan Konsultasi" />
                
                <main className="flex-1 py-10">
                    <div className="container max-w-2xl mx-auto px-4">
                        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-200/60 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Pengajuan Konsultasi Berhasil!</h2>
                            <p className="text-neutral-600 mb-8 leading-relaxed">
                                Permohonan layanan Konsultasi Anda telah berhasil dicatat pada sistem TORA BELO dan akan segera diproses oleh Petugas KPU Kota Palu.
                            </p>
                            
                            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 mb-8">
                                <p className="text-sm text-neutral-500 mb-2 font-medium">KODE TRACKER ANDA</p>
                                <div className="flex items-center justify-center gap-3">
                                    <code className="text-2xl sm:text-3xl font-black text-kpu-primary tracking-wider">{successData.kode_tiket}</code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(successData.kode_tiket);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="p-2 hover:bg-white rounded-lg transition-colors group relative"
                                        title="Salin kode"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700">📋</div>}
                                    </button>
                                </div>
                                <p className="text-xs text-neutral-500 mt-4">
                                    Simpan kode tracker ini untuk memantau status pengajuan konsultasi Anda.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link 
                                    href="/cek-status"
                                    className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-kpu-primary text-white font-bold text-sm hover:bg-red-700 transition-colors"
                                >
                                    Cek Status Pengajuan
                                </Link>
                                <Link 
                                    href="/"
                                    className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition-colors"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                
                <footer className="py-6 border-t border-neutral-200 bg-white mt-auto">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm text-neutral-500">© 2026 KPU Kota Palu. Hak Cipta Dilindungi.</p>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col">
            <Head title="Form Pengajuan Konsultasi - TORA BELO" />
            <ServiceHeader title="Layanan Konsultasi" />

            <main className="flex-1 py-8 sm:py-12">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="mb-8 sm:mb-10 text-center sm:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-kpu-primary transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                            Form Pengajuan Layanan Konsultasi
                        </h1>
                        <p className="text-neutral-500 mt-2 text-sm sm:text-base">
                            Silakan lengkapi formulir di bawah ini untuk mengajukan permohonan konsultasi secara digital.
                        </p>
                    </div>

                    {serverErrors.global && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            <span className="font-bold">Error:</span> {serverErrors.global}
                        </div>
                    )}

                    <div className="bg-card rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden">
                        {/* Stepper Header */}
                        <div className="flex border-b border-neutral-100 bg-neutral-50/50">
                            {[
                                { num: 1, label: 'DATA PEMOHON', icon: User },
                                { num: 2, label: 'RINCIAN KONSULTASI', icon: MessageCircle },
                                { num: 3, label: 'DOKUMEN & KONFIRMASI', icon: FileText }
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
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.nama_lengkap} onChange={e => updateData('nama_lengkap', e.target.value)} className={inputClasses(serverErrors.nama_lengkap)} placeholder="Nama lengkap pemohon" />
                                            {serverErrors.nama_lengkap && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nama_lengkap}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Nomor Identitas / NIK</label>
                                            <input type="text" value={data.nik} onChange={e => updateData('nik', e.target.value)} className={inputClasses(serverErrors.nik)} placeholder="Masukkan 16 digit NIK (Opsional)" />
                                            {serverErrors.nik && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nik}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Nomor Telepon / WhatsApp <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.no_hp} onChange={e => updateData('no_hp', e.target.value)} className={inputClasses(serverErrors.no_hp)} placeholder="08xxxxxxxxxx" />
                                            {serverErrors.no_hp && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.no_hp}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Email</label>
                                            <input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} className={inputClasses(serverErrors.email)} placeholder="email@contoh.com (Opsional)" />
                                            {serverErrors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Asal / Instansi / Organisasi</label>
                                        <input type="text" value={data.instansi} onChange={e => updateData('instansi', e.target.value)} className={inputClasses(serverErrors.instansi)} placeholder="Asal instansi atau organisasi (Opsional)" />
                                        {serverErrors.instansi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.instansi}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Alamat Pemohon</label>
                                        <textarea value={data.alamat} onChange={e => updateData('alamat', e.target.value)} className={`${inputClasses(serverErrors.alamat)} resize-none leading-relaxed`} rows={3} placeholder="Tuliskan alamat lengkap pemohon (Opsional)..."></textarea>
                                        {serverErrors.alamat && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.alamat}</p>}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                                    <button type="button" onClick={nextStep} className="inline-flex items-center justify-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer">
                                        <span>Lanjutkan</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            </div>

                            {/* STEP 2: Rincian Konsultasi */}
                            <div className={step === 2 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Rincian Konsultasi</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Masukkan informasi rincian hal yang ingin dikonsultasikan.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Jenis / Topik Konsultasi <span className="text-red-500">*</span></label>
                                            <select value={data.jenis_konsultasi} onChange={e => updateData('jenis_konsultasi', e.target.value)} className={inputClasses(serverErrors.jenis_konsultasi)}>
                                                <option value="" disabled>Pilih topik konsultasi...</option>
                                                <option value="Kepemiluan">Kepemiluan</option>
                                                <option value="Data Pemilih">Data Pemilih</option>
                                                <option value="Pencalonan">Pencalonan</option>
                                                <option value="Tahapan Pemilu/Pemilihan">Tahapan Pemilu/Pemilihan</option>
                                                <option value="Pendidikan Pemilih">Pendidikan Pemilih</option>
                                                <option value="Informasi Kepemiluan">Informasi Kepemiluan</option>
                                                <option value="Kelembagaan KPU">Kelembagaan KPU</option>
                                                <option value="Layanan KPU">Layanan KPU</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                            {serverErrors.jenis_konsultasi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.jenis_konsultasi}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Metode Konsultasi <span className="text-red-500">*</span></label>
                                            <select value={data.kanal_konsultasi} onChange={e => updateData('kanal_konsultasi', e.target.value)} className={inputClasses(serverErrors.kanal_konsultasi)}>
                                                <option value="" disabled>Pilih metode...</option>
                                                <option value="Tatap Muka">Tatap Muka</option>
                                                <option value="Telepon">Telepon</option>
                                                <option value="WhatsApp">WhatsApp</option>
                                                <option value="Daring/Online">Daring/Online</option>
                                            </select>
                                            {serverErrors.kanal_konsultasi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.kanal_konsultasi}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Judul / Pokok Konsultasi <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.judul_konsultasi} onChange={e => updateData('judul_konsultasi', e.target.value)} className={inputClasses(serverErrors.judul_konsultasi)} placeholder="Masukkan pokok atau judul konsultasi" />
                                        {serverErrors.judul_konsultasi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.judul_konsultasi}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Uraian / Pertanyaan Konsultasi <span className="text-red-500">*</span></label>
                                        <textarea value={data.uraian_konsultasi} onChange={e => updateData('uraian_konsultasi', e.target.value)} className={`${inputClasses(serverErrors.uraian_konsultasi)} resize-none leading-relaxed h-auto`} rows={5} placeholder="Jelaskan pertanyaan, permasalahan, atau hal yang ingin dikonsultasikan secara lengkap."></textarea>
                                        {serverErrors.uraian_konsultasi && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.uraian_konsultasi}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Waktu Konsultasi yang Diinginkan</label>
                                        <input type="text" value={data.waktu_konsultasi} onChange={e => updateData('waktu_konsultasi', e.target.value)} className={inputClasses(serverErrors.waktu_konsultasi)} placeholder="Opsional (Contoh: Senin pagi)" />
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-between">
                                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 rounded-xl px-5 h-12 border bg-white cursor-pointer font-bold"><ArrowLeft className="w-4 h-4" /> Kembali</button>
                                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 rounded-xl px-7 h-12 bg-kpu-primary text-white font-bold cursor-pointer hover:bg-red-700">Lanjutkan <ArrowLeft className="w-4 h-4 rotate-180" /></button>
                                </div>
                            </div>

                            {/* STEP 3: Dokumen & Konfirmasi */}
                            <div className={step === 3 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Dokumen Pendukung</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Unggah dokumen pendukung jika diperlukan (Opsional).</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-neutral-50/50 rounded-xl p-5 border border-neutral-100">
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-3">Dokumen Pendukung <span className="font-normal text-neutral-500">(Opsional)</span></label>
                                        <input type="file" id="dokumen_pendukung" onChange={e => handleFileChange('dokumen_pendukung', e)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-kpu-primary hover:file:bg-violet-100" accept=".pdf,.jpg,.jpeg,.png" />
                                        {serverErrors.dokumen_pendukung && <p className="mt-2 text-xs text-red-500 font-medium">{serverErrors.dokumen_pendukung}</p>}
                                    </div>

                                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 sm:p-5 mt-4">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-0.5">
                                                <input type="checkbox" checked={data.pernyataan} onChange={e => updateData('pernyataan', e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-orange-200 rounded text-kpu-primary focus:ring-kpu-primary/30 bg-white cursor-pointer" />
                                                <Check className="absolute w-3.5 h-3.5 text-orange-500 opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[13px] sm:text-sm font-medium text-neutral-700 leading-relaxed block cursor-pointer">
                                                    Saya menyatakan bahwa data dan informasi yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                                                </span>
                                            </div>
                                        </label>
                                        {serverErrors.pernyataan && <p className="mt-2 text-xs text-red-500 font-medium ml-8">{serverErrors.pernyataan}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                    <button type="button" onClick={prevStep} disabled={isSubmitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 h-12 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-bold text-sm shadow-xs cursor-pointer disabled:opacity-50">
                                        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Kembali</span>
                                    </button>
                                    <button type="submit" disabled={isSubmitting || !data.pernyataan} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-xs cursor-pointer disabled:opacity-50">
                                        {isSubmitting ? (
                                            <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div><span>Mengirim...</span></>
                                        ) : (
                                            <><Send className="w-4 h-4" /><span>Ajukan Konsultasi</span></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            
            <footer className="py-6 border-t border-neutral-200 bg-white mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-neutral-500">© 2026 KPU Kota Palu. Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}
