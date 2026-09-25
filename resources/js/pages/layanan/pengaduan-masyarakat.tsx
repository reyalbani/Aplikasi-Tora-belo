import { Head, Link } from '@inertiajs/react';
import { Activity, AlertCircle, ArrowLeft, Building2, CheckCircle2, Clock, Copy, ExternalLink, File, FileText, Info, Loader2, Mail, MapPin, Megaphone, MessageSquareWarning, PhoneCall, Scale, ShieldAlert, Target, UploadCloud, User, Users } from 'lucide-react';


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
}

export default function PengaduanMasyarakat({ layanan }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ kode_tiket: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    
    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        status_pelapor: 'Perorangan',
        nik: '',
        nama: '',
        email: '',
        no_hp: '',
        alamat: '',
        kategori_pengaduan: '',
        judul_pengaduan: '',
        uraian_pengaduan: '',
        lokasi_kejadian: '',
        waktu_kejadian: '',
        pihak_dilaporkan: '',
        tuntutan: '',
        dokumen_ktp: null as File | null,
        dokumen_surat_kuasa: null as File | null,
        bukti_pendukung: [] as File[],
    });

    const procedures = [
        { title: "Penyampaian Pengaduan", desc: "Pelapor menyampaikan pengaduan melalui layanan digital TORA BELO dengan menyertakan bukti awal yang relevan." },
        { title: "Penerimaan & Registrasi", desc: "Petugas menerima dan mencatat pengaduan ke dalam sistem registrasi serta menerbitkan nomor tiket pengaduan." },
        { title: "Verifikasi & Telaah Awal", desc: "Petugas memeriksa kelengkapan persyaratan administratif dan mengategorikan tingkat pengaduan." },
        { title: "Disposisi & Klarifikasi Internal", desc: "Pengaduan didisposisikan kepada Subbagian teknis terkait atau Tim Pemeriksa Internal KPU Kota Palu untuk proses klarifikasi lebih lanjut." },
        { title: "Penyusunan Tanggapan", desc: "Tim pemeriksa menyusun laporan hasil klarifikasi, merumuskan kesimpulan, dan memberikan rekomendasi jawaban/solusi." },
        { title: "Penyampaian Jawaban Akhir", desc: "Petugas menyampaikan tanggapan resmi institusi secara tertulis kepada pelapor melalui sistem TORA BELO." }
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

    const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024);
        if (files.length !== validFiles.length) {
            alert('Beberapa file melebihi ukuran maksimal 10MB dan tidak ditambahkan.');
        }
        setData(prev => ({ ...prev, bukti_pendukung: [...prev.bukti_pendukung, ...validFiles] }));
    };
    
    const removeFile = (index: number) => {
        setData(prev => {
            const newFiles = [...prev.bukti_pendukung];
            newFiles.splice(index, 1);
            return { ...prev, bukti_pendukung: newFiles };
        });
    };

    const nextStep = () => {
        let isValid = true;
        if (step === 1) {
            if (data.status_pelapor !== 'Anonim/Rahasia') {
                if (!data.nik || !data.nama || !data.email || !data.no_hp || !data.alamat) isValid = false;
            }
        } else if (step === 2) {
            if (!data.kategori_pengaduan || !data.judul_pengaduan || !data.uraian_pengaduan || !data.lokasi_kejadian || !data.waktu_kejadian || !data.pihak_dilaporkan || !data.tuntutan) isValid = false;
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
        
        if (data.status_pelapor !== 'Anonim/Rahasia' && !data.dokumen_ktp) {
            alert('KTP wajib diunggah.');
            return;
        }
        if (data.status_pelapor === 'Kuasa Pelapor' && !data.dokumen_surat_kuasa) {
            alert('Surat Kuasa Khusus wajib diunggah.');
            return;
        }
        if (data.bukti_pendukung.length === 0) {
            alert('Minimal satu bukti pendukung wajib diunggah.');
            return;
        }
        
        setIsSubmitting(true);
        setServerErrors({});
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'bukti_pendukung') {
                (value as File[]).forEach((file, index) => {
                    formData.append(`bukti_pendukung[${index}]`, file);
                });
            } else if (value !== null) {
                formData.append(key, value as any);
            }
        });
        
        const getXsrfToken = () => {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
            if (match) return decodeURIComponent(match[2]);
            return '';
        };

        try {
            const response = await fetch('/layanan/pengaduan-masyarakat', {
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
                setServerErrors({ _global: 'Terjadi kesalahan jaringan atau sistem.' });
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
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Pengaduan Berhasil Diajukan!</h2>
                        <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
                            Laporan pengaduan Anda telah berhasil diterima dan tercatat dalam sistem TORA BELO untuk segera ditindaklanjuti oleh petugas.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-8 max-w-md mx-auto mb-10 shadow-sm dark:shadow-none relative">
                            <p className="text-xs sm:text-sm text-neutral-500 mb-2 font-bold uppercase tracking-wider">KODE TIKET PENGADUAN ANDA</p>
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
                            <p className="text-xs sm:text-sm text-neutral-500 mt-6 font-medium px-4">Gunakan kode ini untuk memantau status perkembangan pengaduan melalui menu Cek Status TORA BELO.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20 cursor-pointer hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-[0.98]">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Cek Status Pengaduan →</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl px-8 w-full sm:w-auto h-12 text-neutral-700 font-semibold border-neutral-200 cursor-pointer">
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
                {!showForm ? (
                    <>
                        {/* Header Info & Action Box */}
                        <div className="bg-card rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-none border border-neutral-200/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
                                    <Megaphone className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                                            {layanan.nama_layanan}
                                        </h1>
                                        <span className="bg-red-50 text-kpu-primary border border-red-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            Aspirasi Terbuka
                                        </span>
                                    </div>
                                    <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed mt-1 max-w-xl">
                                        {layanan.deskripsi}
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowForm(true);
                                    setStep(1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold text-sm shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-kpu-primary/20 transition-all duration-200 w-full sm:w-auto cursor-pointer shrink-0"
                            >
                                <MessageSquareWarning className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                                <span>Ajukan Pengaduan</span>
                            </button>
                        </div>

                        {/* Main Content Area */}
                    <ServiceInfoLayout
                        miniCards={[
                            {
                                title: "Pemohon",
                                content: "Warga Negara, Pemilih, Peserta Pemilu, Pemantau, Ormas",
                                icon: <Users className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Waktu Penyelesaian",
                                content: <><span className="text-sm font-semibold text-neutral-900 leading-snug">1 - 14 Hari</span><br/><span className="text-xs text-neutral-500 font-normal">Tergantung kategori</span></>,
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
                        requirementsSubtitle="Pengaduan Online TORA BELO"
                        requirementsContent={
                            <div className="space-y-6">
                                {/* Identitas Pelapor */}
                                <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-kpu-primary" />
                                        Persyaratan Identitas Pelapor
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-[13px] sm:text-sm text-neutral-600">
                                        <li><span className="font-semibold text-neutral-800">Perorangan/Lembaga:</span> Fotokopi/Scan Kartu Tanda Penduduk Elektronik (KTP-el) atau Identitas Kependudukan Digital (IKD) yang sah.</li>
                                        <li><span className="font-semibold text-neutral-800">Kuasa Pelapor:</span> Apabila pengaduan disampaikan oleh kuasa, wajib melampirkan Surat Kuasa Khusus bermaterai cukup beserta KTP-el Pemberi dan Penerima Kuasa.</li>
                                        <li><span className="font-semibold text-neutral-800">Anonim:</span> Pengaduan dapat disampaikan secara anonim/rahasia tanpa identitas dengan tetap menyertakan bukti awal yang kuat.</li>
                                    </ul>
                                </div>

                                {/* Materi Pengaduan */}
                                <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                        Persyaratan Materi Pengaduan
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-[13px] sm:text-sm text-neutral-600">
                                        <li>Mengisi Formulir Pengaduan Masyarakat secara lengkap pada sistem TORA BELO.</li>
                                        <li>Uraian kronologis kejadian pengaduan memuat prinsip <strong className="text-neutral-800">4W1H (What, Who, Where, When, How)</strong> secara mendetail.</li>
                                        <li>Melampirkan bukti pendukung yang relevan seperti foto, dokumen/surat pendukung, bukti transaksi, rekaman, atau tangkapan layar.</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        procedures={[
                            {
                                title: "PENYAMPAIAN PENGADUAN",
                                desc: "Pelapor menyampaikan pengaduan melalui TORA BELO atau kanal pengaduan resmi KPU Kota Palu lainnya dengan melampirkan identitas dan bukti awal."
                            },
                            {
                                title: "REGISTRASI",
                                desc: "Petugas menerima, mencatat pengaduan, dan memberikan nomor tiket kepada pelapor."
                            },
                            {
                                title: "VERIFIKASI & TELAAH",
                                desc: "Petugas melakukan pemeriksaan kelengkapan syarat dan klasifikasi jenis pengaduan."
                            },
                            {
                                title: "KLARIFIKASI & TINDAK LANJUT",
                                desc: "Pihak terkait melakukan klarifikasi (jika diperlukan) dan mengambil langkah penyelesaian sesuai ketentuan."
                            },
                            {
                                title: "RESPON / JAWABAN",
                                desc: "Pelapor menerima jawaban atau pemberitahuan hasil penyelesaian pengaduan."
                            }
                        ]}
                        timeContent={
                            <ul className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed list-disc pl-4 space-y-2 mb-4">
                                <li><span className="font-semibold text-neutral-800">Pemberian Tanda Terima:</span> 1 (satu) hari kerja.</li>
                                <li><span className="font-semibold text-neutral-800">Kategori Reguler / Administrasi:</span> Maksimal 5 (lima) hari kerja.</li>
                                <li><span className="font-semibold text-neutral-800">Pengaduan Kompleks / WBS:</span> Maksimal 14 (empat belas) hari kerja.</li>
                            </ul>
                        }
                        productsContent={
                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed mt-2">
                                Tanda Terima, Tindak Lanjut Pengaduan, dan Laporan Hasil Penanganan.
                            </p>
                        }
                        complaintText="Apabila Anda mengalami kendala dalam menyampaikan pengaduan melalui TORA BELO, Anda dapat menghubungi saluran alternatif resmi KPU Kota Palu berikut:"
                        complaintChannels={[
                            { type: 'email', label: 'Email: hukum.kpukotapalu@gmail.com', link: 'mailto:hukum.kpukotapalu@gmail.com' },
                            { type: 'phone', label: 'Telp: (0451) 457721', link: 'tel:0451457721' },
                            { type: 'lapor', label: 'SP4N-LAPOR! (www.lapor.go.id)', link: 'https://www.lapor.go.id' },
                            { type: 'location', label: 'Meja Layanan Langsung:', value: 'Ruang PTSP KPU Kota Palu.' }
                        ]}
                    />
                    </>
                ) : (
                    <div className="bg-card rounded-[24px] p-6 sm:p-10 shadow-sm dark:shadow-none border border-neutral-200/60">
                        {serverErrors._global && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm font-medium">{serverErrors._global}</div>
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-8">
                            {step === 1 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <User className="w-5 h-5 text-kpu-primary" /> Identitas Pelapor
                                    </h2>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Status Pelapor <span className="text-red-500">*</span></label>
                                        <select value={data.status_pelapor} onChange={e => updateData('status_pelapor', e.target.value)} className={inputClasses(serverErrors.status_pelapor)}>
                                            <option value="Perorangan">Perorangan</option>
                                            <option value="Kuasa Pelapor">Kuasa Pelapor</option>
                                            <option value="Anonim/Rahasia">Anonim/Rahasia</option>
                                        </select>
                                    </div>
                                    
                                    {data.status_pelapor !== 'Anonim/Rahasia' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">NIK <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.nik} onChange={e => updateData('nik', e.target.value)} className={inputClasses(serverErrors.nik)} placeholder="16 Digit NIK" />
                                                    {serverErrors.nik && <p className="mt-1 text-xs text-red-500">{serverErrors.nik}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.nama} onChange={e => updateData('nama', e.target.value)} className={inputClasses(serverErrors.nama)} placeholder="Nama Lengkap Sesuai KTP" />
                                                    {serverErrors.nama && <p className="mt-1 text-xs text-red-500">{serverErrors.nama}</p>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} className={inputClasses(serverErrors.email)} placeholder="Alamat Email Aktif" />
                                                    {serverErrors.email && <p className="mt-1 text-xs text-red-500">{serverErrors.email}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nomor HP/WhatsApp <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.no_hp} onChange={e => updateData('no_hp', e.target.value)} className={inputClasses(serverErrors.no_hp)} placeholder="08xxxxxxxxxx" />
                                                    {serverErrors.no_hp && <p className="mt-1 text-xs text-red-500">{serverErrors.no_hp}</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Alamat Lengkap <span className="text-red-500">*</span></label>
                                                <textarea value={data.alamat} onChange={e => updateData('alamat', e.target.value)} rows={3} className={inputClasses(serverErrors.alamat)} placeholder="Alamat Lengkap Domisili" />
                                                {serverErrors.alamat && <p className="mt-1 text-xs text-red-500">{serverErrors.alamat}</p>}
                                            </div>
                                        </>
                                    )}

                                    {data.status_pelapor === 'Anonim/Rahasia' && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm">
                                            <strong>Mode Anonim:</strong> Identitas Anda tidak akan diminta dan akan dirahasiakan oleh sistem. Pastikan bukti awal yang Anda lampirkan cukup kuat untuk ditindaklanjuti.
                                        </div>
                                    )}

                                    <div className="pt-6 border-t flex justify-end">
                                        <Button type="button" onClick={nextStep} className="px-8 h-12 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold">Selanjutnya</Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <FileText className="w-5 h-5 text-kpu-primary" /> Detail Pengaduan
                                    </h2>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Kategori Pengaduan <span className="text-red-500">*</span></label>
                                        <select value={data.kategori_pengaduan} onChange={e => updateData('kategori_pengaduan', e.target.value)} className={inputClasses(serverErrors.kategori_pengaduan)}>
                                            <option value="">-- Pilih Kategori --</option>
                                            <option value="Administrasi Pelayanan">Administrasi Pelayanan</option>
                                            <option value="Kode Etik">Kode Etik</option>
                                            <option value="Sengketa">Sengketa</option>
                                            <option value="WBS / Dugaan Pelanggaran">WBS / Dugaan Pelanggaran</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Judul Pengaduan <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.judul_pengaduan} onChange={e => updateData('judul_pengaduan', e.target.value)} className={inputClasses(serverErrors.judul_pengaduan)} placeholder="Singkat dan jelas, misal: Dugaan Pungli di PTSP" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Pihak yang Dilaporkan <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.pihak_dilaporkan} onChange={e => updateData('pihak_dilaporkan', e.target.value)} className={inputClasses(serverErrors.pihak_dilaporkan)} placeholder="Nama/Jabatan petugas atau instansi terkait" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Lokasi Kejadian <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.lokasi_kejadian} onChange={e => updateData('lokasi_kejadian', e.target.value)} className={inputClasses(serverErrors.lokasi_kejadian)} placeholder="Tempat kejadian perkara" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Waktu Kejadian <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.waktu_kejadian} onChange={e => updateData('waktu_kejadian', e.target.value)} className={inputClasses(serverErrors.waktu_kejadian)} placeholder="Tanggal / Waktu kejadian" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Uraian / Kronologi (4W1H) <span className="text-red-500">*</span></label>
                                        <textarea value={data.uraian_pengaduan} onChange={e => updateData('uraian_pengaduan', e.target.value)} rows={6} className={inputClasses(serverErrors.uraian_pengaduan)} placeholder="Jelaskan secara detail kejadian memuat unsur What, Who, Where, When, How" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Harapan / Tuntutan <span className="text-red-500">*</span></label>
                                        <textarea value={data.tuntutan} onChange={e => updateData('tuntutan', e.target.value)} rows={3} className={inputClasses(serverErrors.tuntutan)} placeholder="Tindak lanjut apa yang Anda harapkan dari pengaduan ini" />
                                    </div>

                                    <div className="pt-6 border-t flex justify-between">
                                        <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 rounded-xl text-neutral-700 font-semibold border-neutral-200">Kembali</Button>
                                        <Button type="button" onClick={nextStep} className="px-8 h-12 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold">Selanjutnya</Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <UploadCloud className="w-5 h-5 text-kpu-primary" /> Dokumen & Bukti Pendukung
                                    </h2>
                                    
                                    {data.status_pelapor !== 'Anonim/Rahasia' && (
                                        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Scan/Foto KTP-el <span className="text-red-500">*</span></label>
                                            <p className="text-xs text-neutral-500 mb-3">Format: PDF/JPG/PNG, Maks. 5MB</p>
                                            <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f) updateData('dokumen_ktp', f); }} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-kpu-primary hover:file:bg-red-100 transition-colors" />
                                        </div>
                                    )}

                                    {data.status_pelapor === 'Kuasa Pelapor' && (
                                        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Surat Kuasa Khusus <span className="text-red-500">*</span></label>
                                            <p className="text-xs text-neutral-500 mb-3">Format: PDF/JPG/PNG, Maks. 5MB</p>
                                            <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f) updateData('dokumen_surat_kuasa', f); }} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-kpu-primary hover:file:bg-red-100 transition-colors" />
                                        </div>
                                    )}

                                    <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Bukti Pendukung <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-neutral-500 mb-3">Bisa lebih dari 1 file (Foto, Dokumen, Rekaman). Maks 10MB per file.</p>
                                        <input type="file" multiple onChange={handleMultipleFileChange} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors" />
                                        {data.bukti_pendukung.length > 0 && (
                                            <ul className="mt-3 space-y-2">
                                                {data.bukti_pendukung.map((file, idx) => (
                                                    <li key={idx} className="flex justify-between items-center text-sm p-2 bg-card rounded border">
                                                        <span className="truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                                                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded">Hapus</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t flex justify-between">
                                        <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 rounded-xl text-neutral-700 font-semibold border-neutral-200">Kembali</Button>
                                        <Button type="submit" disabled={isSubmitting} className="px-8 h-12 rounded-xl bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20 flex items-center gap-2">
                                            {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}




