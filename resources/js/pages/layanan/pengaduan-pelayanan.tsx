import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, AlertCircle, ArrowLeft, BookOpen, Calendar, CheckCircle2, Copy, ExternalLink, FileText, Info, Loader2, Mail, MapPin, PhoneCall, UploadCloud, User, Users, Headset, File } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState, useRef, FormEvent } from 'react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';

declare const route: any;

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

export default function PengaduanPelayanan({ layanan, bukuTamu }: Props) {
    const [step, setStep] = useState(1);
    const [successData, setSuccessData] = useState<{ kode_tiket: string } | null>(null);
    const [copied, setCopied] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id_layanan: layanan.id_layanan,
        nama_pelapor: bukuTamu?.nama || '',
        nik_pelapor: '',
        no_hp: bukuTamu?.no_hp || '',
        email: bukuTamu?.email || '',
        alamat_pelapor: '',
        
        jenis_pengaduan: '',
        judul_pengaduan: '',
        uraian_pengaduan: '',
        waktu_kejadian: '',
        lokasi_kejadian: '',
        harapan: '',
        
        bukti_pendukung: null as globalThis.File | null,
        pernyataan: false,
    });

    const buktiInputRef = useRef<HTMLInputElement>(null);

    const updateData = (field: keyof typeof data, value: any) => {
        setData(field, value);
        clearErrors(field);
    };

    const handleFileChange = (field: keyof typeof data, ref: React.RefObject<HTMLInputElement | null>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                alert('Ukuran file maksimal 100MB.');
                if (ref.current) ref.current.value = '';
                return;
            }
            updateData(field, file);
        }
    };

    const removeFile = (field: keyof typeof data, ref: React.RefObject<HTMLInputElement | null>) => {
        updateData(field, null);
        if (ref.current) ref.current.value = '';
    };

    const nextStep = () => {
        let isValid = true;
        if (step === 1) {
            if (!data.nama_pelapor.trim() || !data.nik_pelapor.trim() || !data.no_hp.trim() || !data.email.trim() || !data.alamat_pelapor.trim()) {
                isValid = false;
            }
        } else if (step === 2) {
            if (!data.jenis_pengaduan || !data.judul_pengaduan.trim() || !data.uraian_pengaduan.trim()) {
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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!data.pernyataan) {
            alert('Anda harus menyetujui pernyataan kebenaran data.');
            return;
        }
        
        post(route('pengaduan-pelayanan.store'), {
            forceFormData: true,
            onSuccess: (page) => {
                const flash = page.props.flash as any;
                if (flash?.success?.includes('Nomor Tiket')) {
                    const ticketMatch = flash.success.match(/PGD-[A-Z0-9]+/);
                    if (ticketMatch) {
                        setSuccessData({ kode_tiket: ticketMatch[0] });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            }
        });
    };

    const copyTicket = () => {
        if (successData?.kode_tiket) {
            navigator.clipboard.writeText(successData.kode_tiket);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (successData) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
                <Head title="Pengaduan Berhasil - TORA BELO" />
                <ServiceHeader 
                    title="Pengaduan Berhasil" 
                />
                <main className="container-custom py-12 flex-1 flex flex-col items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">Pengaduan Berhasil Dikirim</h2>
                        <p className="text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
                            Terima kasih. Pengaduan Anda telah berhasil diterima dan akan diproses sesuai ketentuan.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8 inline-block min-w-[300px]">
                            <span className="text-sm text-neutral-500 font-semibold mb-2 block">Nomor Pengaduan:</span>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl font-black text-kpu-primary tracking-wider">{successData.kode_tiket}</span>
                                <button 
                                    onClick={copyTicket}
                                    className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-500 hover:text-neutral-700"
                                    title="Salin nomor tiket"
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 h-12 w-full sm:w-auto font-semibold" size="lg">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Lihat Status Pengaduan</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl px-8 h-12 w-full sm:w-auto font-semibold" size="lg">
                                <Link href="/#layanan">Kembali ke Daftar Layanan</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/30 flex flex-col font-sans">
            <Head title={`${layanan.nama_layanan} - TORA BELO`} />
            
            <ServiceHeader 
                title={layanan.nama_layanan}
            />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                
                {/* Header Info Box */}
                <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                            <Headset className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
                                    {layanan.nama_layanan}
                                </h1>
                                <span className="bg-red-50 text-kpu-primary border border-red-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    Pengaduan
                                </span>
                            </div>
                            <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed mt-1">
                                Formulir untuk menyampaikan pengaduan, pertanyaan, saran, atau masukan terkait pelayanan KPU Kota Palu.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mt-6 animate-fade-in">
                    {/* Header Info of Form */}
                    <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60">
                        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                                <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1 leading-tight tracking-tight">
                                    Formulir Pengaduan Pelayanan
                                </h1>
                                <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                    Lengkapi data dan informasi pengaduan Anda dengan benar agar dapat kami tindak lanjuti.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[18px] flex flex-col gap-2 shadow-xs">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                                <p className="text-sm font-bold">Pengajuan belum dapat dikirim. Mohon periksa kembali data berikut:</p>
                            </div>
                            <ul className="list-disc pl-9 text-xs sm:text-sm space-y-1">
                                {Object.entries(errors).map(([key, err]) => (
                                    <li key={key}><span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {err as string}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden">
                        {/* Stepper Header */}
                        <div className="flex border-b border-neutral-100 bg-neutral-50/50">
                            {[
                                { num: 1, label: 'Identitas Pelapor', icon: User },
                                { num: 2, label: 'Rincian Pengaduan', icon: AlertCircle },
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
                            {/* STEP 1: Data Pelapor */}
                            <div className={step === 1 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Identitas Pelapor</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Masukkan data diri dan kontak yang dapat digunakan untuk komunikasi terkait pengaduan.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nama Lengkap Pelapor <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.nama_pelapor}
                                            onChange={e => updateData('nama_pelapor', e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            placeholder="Masukkan nama lengkap Anda"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">NIK Pelapor <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            maxLength={16}
                                            value={data.nik_pelapor}
                                            onChange={e => updateData('nik_pelapor', e.target.value.replace(/\D/g, ''))}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            placeholder="Masukkan 16 digit NIK"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nomor Telepon / WhatsApp <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.no_hp}
                                            onChange={e => updateData('no_hp', e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Email Aktif <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => updateData('email', e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            placeholder="Masukkan alamat email aktif"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Alamat Pelapor <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={data.alamat_pelapor}
                                            onChange={e => updateData('alamat_pelapor', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all resize-none"
                                            placeholder="Masukkan alamat lengkap Anda"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 2: Rincian Pengaduan */}
                            <div className={step === 2 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Rincian Pengaduan</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Jelaskan pengaduan atau laporan Anda secara jelas dan lengkap.</p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-2.5">Jenis Pengaduan <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['Pengaduan Pelayanan', 'Gratifikasi', 'Whistle-Blowing System', 'Benturan Kepentingan', 'Lainnya'].map((jenis) => (
                                                <label key={jenis} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.jenis_pengaduan === jenis ? 'border-kpu-primary bg-red-50/30' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}>
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${data.jenis_pengaduan === jenis ? 'border-kpu-primary' : 'border-neutral-300'}`}>
                                                        {data.jenis_pengaduan === jenis && <div className="w-2.5 h-2.5 rounded-full bg-kpu-primary"></div>}
                                                    </div>
                                                    <span className={`text-[13px] font-semibold ${data.jenis_pengaduan === jenis ? 'text-kpu-primary' : 'text-neutral-700'}`}>{jenis}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Judul / Ringkasan Pengaduan <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.judul_pengaduan}
                                            onChange={e => updateData('judul_pengaduan', e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            placeholder="Masukkan ringkasan singkat pengaduan Anda"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Uraian Pengaduan <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={data.uraian_pengaduan}
                                            onChange={e => updateData('uraian_pengaduan', e.target.value)}
                                            rows={5}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all resize-none"
                                            placeholder="Jelaskan pengaduan Anda secara rinci, termasuk waktu, tempat, pihak terkait, kronologi kejadian, dan informasi lain yang relevan."
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Tanggal Kejadian</label>
                                            <input
                                                type="date"
                                                value={data.waktu_kejadian}
                                                onChange={e => updateData('waktu_kejadian', e.target.value)}
                                                className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Lokasi Kejadian</label>
                                            <input
                                                type="text"
                                                value={data.lokasi_kejadian}
                                                onChange={e => updateData('lokasi_kejadian', e.target.value)}
                                                className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all"
                                                placeholder="Masukkan lokasi kejadian jika relevan"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Harapan / Tindak Lanjut yang Diharapkan</label>
                                        <textarea
                                            value={data.harapan}
                                            onChange={e => updateData('harapan', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-xl border border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10 px-4 py-3 text-sm transition-all resize-none"
                                            placeholder="Jelaskan tindak lanjut yang Anda harapkan dari KPU Kota Palu"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* STEP 3: Dokumen & Pernyataan */}
                            <div className={step === 3 ? 'block' : 'hidden'}>
                                <div className="mb-6">
                                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">Dokumen & Pernyataan</h3>
                                    <p className="text-xs text-neutral-500 mt-1">Lampirkan bukti pendukung apabila tersedia dan konfirmasi kebenaran data.</p>
                                </div>
                                <div className="space-y-6">
                                    
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Bukti Pendukung Pengaduan</label>
                                        <p className="text-xs text-neutral-500 mb-2">Opsional. Anda dapat melampirkan dokumen, foto, atau file pendukung yang relevan.</p>
                                        
                                        {!data.bukti_pendukung ? (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                                                <div className="space-y-2 text-center">
                                                    <UploadCloud className="mx-auto h-10 w-10 text-neutral-400" />
                                                    <div className="flex text-sm text-neutral-600 justify-center">
                                                        <label htmlFor="bukti_pendukung" className="relative cursor-pointer rounded-md font-semibold text-kpu-primary hover:text-kpu-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-kpu-primary focus-within:ring-offset-2">
                                                            <span>Pilih file</span>
                                                            <input 
                                                                id="bukti_pendukung" 
                                                                ref={buktiInputRef}
                                                                type="file" 
                                                                className="sr-only" 
                                                                onChange={handleFileChange('bukti_pendukung', buktiInputRef)}
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="text-[11px] sm:text-xs text-neutral-500">PDF, DOC, JPG, PNG, ZIP maksimal 100MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                                                        <File className="w-5 h-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-sm font-semibold text-green-800 truncate">{data.bukti_pendukung.name}</p>
                                                        <p className="text-xs text-green-600">{(data.bukti_pendukung.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeFile('bukti_pendukung', buktiInputRef)} className="text-sm font-medium text-red-500 hover:text-red-700 px-3 py-1 bg-white border border-red-100 rounded-lg shrink-0">Hapus</button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pt-4 border-t border-neutral-100">
                                        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 transition-colors">
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={data.pernyataan}
                                                    onChange={e => updateData('pernyataan', e.target.checked)}
                                                    className="w-5 h-5 text-kpu-primary border-neutral-300 rounded focus:ring-kpu-primary"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[13px] font-semibold text-neutral-800 block mb-1">Pernyataan Pelapor <span className="text-red-500">*</span></span>
                                                <span className="text-[12px] sm:text-[13px] text-neutral-600 leading-relaxed block">
                                                    Saya menyatakan bahwa informasi dan data yang saya sampaikan dalam formulir ini adalah benar dan dapat dipertanggungjawabkan.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Stepper Navigation Buttons */}
                            <div className="mt-8 sm:mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
                                <div>
                                    {step > 1 && (
                                        <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-6 rounded-xl font-semibold text-neutral-600">
                                            Kembali
                                        </Button>
                                    )}
                                </div>
                                
                                <div>
                                    {step < 3 ? (
                                        <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-semibold">
                                            Lanjut
                                        </Button>
                                    ) : (
                                        <Button type="submit" disabled={processing} className="h-12 px-8 rounded-xl bg-kpu-primary hover:bg-red-700 text-white font-semibold shadow-sm hover:shadow-md transition-all min-w-[160px]">
                                            {processing ? (
                                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Memproses...</>
                                            ) : (
                                                "Kirim Pengaduan"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
