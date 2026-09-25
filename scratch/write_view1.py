import os

def write_chunk(filename, content, mode='a'):
    with open(filename, mode, encoding='utf-8') as f:
        f.write(content)

filename = "resources/js/Pages/layanan/pengaduan-masyarakat.tsx"
write_chunk(filename, "", 'w') # clear file

chunk1 = """import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, FileText, CheckCircle2, Info, Users, Target, UploadCloud, User, File, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, FormEvent } from 'react';

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
        { title: "Penyampaian Pengaduan", desc: "Pelapor menyampaikan pengaduan melalui layanan digital SIPADU." },
        { title: "Penerimaan & Registrasi", desc: "Petugas menerima dan mencatat pengaduan ke dalam sistem registrasi serta memberikan bukti tanda terima." },
        { title: "Verifikasi & Telaah Awal", desc: "Petugas memeriksa kelengkapan persyaratan dan mengategorikan pengaduan." },
        { title: "Disposisi & Klarifikasi Internal", desc: "Pengaduan didisposisikan kepada Subbagian terkait atau Tim Pemeriksa Internal untuk klarifikasi." },
        { title: "Penyusunan Tanggapan", desc: "Tim menyusun laporan hasil klarifikasi dan merumuskan jawaban/solusi." },
        { title: "Penyampaian Jawaban Akhir", desc: "Petugas menyampaikan tanggapan resmi kepada pelapor melalui aplikasi." }
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

    const inputClasses = (error: string | undefined) => 
        `w-full rounded-xl border ${error ? 'border-red-500' : 'border-neutral-200 focus:border-kpu-primary'} px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all bg-white text-neutral-900 placeholder:text-neutral-400`;

"""
write_chunk(filename, chunk1)
