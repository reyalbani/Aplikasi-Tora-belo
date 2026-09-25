import re

new_content = r"""import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Headset,
    CheckCircle2,
    Clock,
    Activity,
    Search,
    Info,
    UploadCloud
} from 'lucide-react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';
import { ServiceInfoLayout } from '@/components/layanan/ServiceInfoLayout';
import { Button } from '@/components/ui/button';

export default function PengaduanPelayanan({ layanan, flash }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_layanan: layanan.id_layanan,
        nama_pelapor: '',
        nik_pelapor: '',
        email: '',
        no_hp: '',
        alamat_pelapor: '',
        jenis_laporan: 'Gratifikasi',
        ringkasan_aduan: '',
        bukti_pendukung: null as File | null,
    });

    const [tiketSearch, setTiketSearch] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengaduan-pelayanan.store'), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    if (flash?.success?.includes('Nomor Tiket')) {
        const ticketMatch = flash.success.match(/PGD-[A-Z0-9]+/);
        const ticketNumber = ticketMatch ? ticketMatch[0] : '';
        
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <Head title={`${layanan.nama_layanan} - SIPADU`} />
                <ServiceHeader 
                    title="Pengaduan Berhasil Dikirim" 
                    breadcrumb={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Layanan Publik', href: '/#layanan' },
                        { label: layanan.nama_layanan, href: '#' }
                    ]}
                />
                <main className="container-custom py-12 flex-1 flex flex-col items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">Pengaduan berhasil dikirim.</h2>
                        <p className="text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
                            Simpan nomor pengaduan ini untuk memantau proses tindak lanjut.
                        </p>
                        
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8 inline-block min-w-[300px]">
                            <span className="text-sm text-neutral-500 font-semibold mb-2 block">Nomor Pengaduan</span>
                            <div className="text-3xl font-black text-kpu-primary tracking-wider">{ticketNumber}</div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 h-12 w-full sm:w-auto font-semibold" size="lg">
                                <a href={`/cek-status?tiket=${ticketNumber}`}>Cek Status Pengaduan</a>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Head title={`${layanan.nama_layanan} - SIPADU`} />
            
            <ServiceHeader 
                title={layanan.nama_layanan}
                description={layanan.deskripsi}
                icon={Headset}
                breadcrumb={[
                    { label: 'Beranda', href: '/' },
                    { label: 'Layanan Publik', href: '/#layanan' },
                    { label: layanan.nama_layanan, href: '#' }
                ]}
            />

            <main className="container-custom py-8 md:py-12 flex-1">
                <ServiceInfoLayout
                    showTabs={true}
                    requirementsTitle="Form Pengaduan"
                    aboutTitle={layanan.nama_layanan}
                    aboutContent={
                        <div className="space-y-4">
                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
                                Layanan pengaduan untuk menyampaikan aduan, pertanyaan, saran, dan masukan terkait pelayanan KPU Kota Palu.
                            </p>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-4">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[12px] sm:text-[13px] text-blue-800 leading-relaxed">
                                    Layanan ini digunakan untuk penyampaian pengaduan terkait pelayanan, gratifikasi, whistle-blowing system, dan benturan kepentingan.
                                </p>
                            </div>
                        </div>
                    }
                    miniCards={[
                        {
                            title: "Prosedur",
                            content: "4 Tahapan proses",
                            icon: <Activity className="w-5 h-5" />,
                            colorClass: "blue"
                        },
                        {
                            title: "Waktu",
                            content: "Sesuai jenis aduan",
                            icon: <Clock className="w-5 h-5" />,
                            colorClass: "amber"
                        },
                        {
                            title: "Biaya",
                            content: "Rp0,- (GRATIS)",
                            icon: <CheckCircle2 className="w-5 h-5" />,
                            colorClass: "green"
                        }
                    ]}
                    requirementsContent={
                        <div className="max-w-4xl">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nama_pelapor" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nama Pelapor <span className="text-red-500">*</span></label>
                                        <input
                                            id="nama_pelapor"
                                            type="text"
                                            value={data.nama_pelapor}
                                            onChange={e => setData('nama_pelapor', e.target.value)}
                                            className={`w-full rounded-xl border ${errors.nama_pelapor ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all`}
                                            placeholder="Nama lengkap Anda"
                                            required
                                        />
                                        {errors.nama_pelapor && <p className="mt-1.5 text-xs text-red-500">{errors.nama_pelapor}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="nik_pelapor" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">NIK Pelapor <span className="text-red-500">*</span></label>
                                        <input
                                            id="nik_pelapor"
                                            type="text"
                                            maxLength={16}
                                            value={data.nik_pelapor}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setData('nik_pelapor', val);
                                            }}
                                            className={`w-full rounded-xl border ${errors.nik_pelapor ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all`}
                                            placeholder="16 Digit NIK"
                                            required
                                        />
                                        {errors.nik_pelapor && <p className="mt-1.5 text-xs text-red-500">{errors.nik_pelapor}</p>}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Email Aktif <span className="text-red-500">*</span></label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className={`w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all`}
                                            placeholder="Alamat email Anda"
                                            required
                                        />
                                        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="no_hp" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nomor Telepon/WA <span className="text-red-500">*</span></label>
                                        <input
                                            id="no_hp"
                                            type="text"
                                            value={data.no_hp}
                                            onChange={e => setData('no_hp', e.target.value)}
                                            className={`w-full rounded-xl border ${errors.no_hp ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all`}
                                            placeholder="08xxxxxxxxxx"
                                            required
                                        />
                                        {errors.no_hp && <p className="mt-1.5 text-xs text-red-500">{errors.no_hp}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="alamat_pelapor" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Alamat Pelapor <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="alamat_pelapor"
                                        value={data.alamat_pelapor}
                                        onChange={e => setData('alamat_pelapor', e.target.value)}
                                        rows={3}
                                        className={`w-full rounded-xl border ${errors.alamat_pelapor ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all resize-none`}
                                        placeholder="Alamat domisili Anda"
                                        required
                                    ></textarea>
                                    {errors.alamat_pelapor && <p className="mt-1.5 text-xs text-red-500">{errors.alamat_pelapor}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-2.5">Jenis Laporan <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Gratifikasi', 'Whistle-Blowing System', 'Benturan Kepentingan', 'Lainnya'].map((jenis) => (
                                            <label key={jenis} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.jenis_laporan === jenis ? 'border-kpu-primary bg-red-50/30' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="jenis_laporan" 
                                                    value={jenis}
                                                    checked={data.jenis_laporan === jenis}
                                                    onChange={(e) => setData('jenis_laporan', e.target.value)}
                                                    className="w-4 h-4 text-kpu-primary border-neutral-300 focus:ring-kpu-primary"
                                                />
                                                <span className="text-[13px] font-medium text-neutral-800">{jenis}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.jenis_laporan && <p className="mt-1.5 text-xs text-red-500">{errors.jenis_laporan}</p>}
                                </div>

                                <div>
                                    <label htmlFor="ringkasan_aduan" className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Ringkasan Aduan <span className="text-red-500">*</span></label>
                                    <textarea
                                        id="ringkasan_aduan"
                                        value={data.ringkasan_aduan}
                                        onChange={e => setData('ringkasan_aduan', e.target.value)}
                                        rows={6}
                                        className={`w-full rounded-xl border ${errors.ringkasan_aduan ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-kpu-primary focus:ring-kpu-primary/10'} px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all resize-none`}
                                        placeholder="Tuliskan secara detail pengaduan, kronologi kejadian, atau masukan Anda..."
                                        required
                                    ></textarea>
                                    {errors.ringkasan_aduan && <p className="mt-1.5 text-xs text-red-500">{errors.ringkasan_aduan}</p>}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Bukti Pendukung Aduan</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-xl bg-white hover:bg-neutral-50 transition-colors">
                                        <div className="space-y-2 text-center">
                                            <UploadCloud className="mx-auto h-10 w-10 text-neutral-400" />
                                            <div className="flex text-sm text-neutral-600 justify-center">
                                                <label htmlFor="bukti_pendukung" className="relative cursor-pointer rounded-md font-semibold text-kpu-primary hover:text-kpu-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-kpu-primary focus-within:ring-offset-2">
                                                    <span>Upload file pendukung</span>
                                                    <input 
                                                        id="bukti_pendukung" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        onChange={e => setData('bukti_pendukung', e.target.files ? e.target.files[0] : null)}
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-neutral-500">PDF, JPG, PNG, DOC up to 5MB (Opsional)</p>
                                            {data.bukti_pendukung && (
                                                <p className="text-[13px] font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg inline-block mt-2">
                                                    Terpilih: {data.bukti_pendukung.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.bukti_pendukung && <p className="mt-1.5 text-xs text-red-500">{errors.bukti_pendukung}</p>}
                                </div>

                                <div className="pt-4 border-t border-neutral-100">
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto min-w-[200px] h-12 rounded-xl bg-kpu-primary hover:bg-kpu-primary-dark text-white font-semibold shadow-sm dark:shadow-none hover:shadow-md transition-all"
                                        disabled={processing}
                                    >
                                        {processing ? 'Memproses...' : 'Kirim Pengaduan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    }
                    procedures={[
                        { title: "Penyampaian Pengaduan", desc: "Pelapor mengirimkan aduan melalui form pengaduan." },
                        { title: "Penerimaan dan Verifikasi Pengaduan", desc: "Sistem menerima pengaduan dan tim memverifikasi kelengkapan berkas/aduan." },
                        { title: "Penanganan dan Tindak Lanjut", desc: "Pengaduan diteruskan ke unit kerja terkait untuk ditindaklanjuti." },
                        { title: "Penyampaian Hasil / Penyelesaian Pengaduan", desc: "Pelapor dapat melihat hasil penyelesaian pengaduan melalui sistem." }
                    ]}
                    flowchartContent={
                        <div className="min-w-[700px] py-4 flex flex-col items-center">
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Pengadu menyampaikan laporan</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Laporan diterima</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Verifikasi laporan</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Penanganan / koordinasi</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>

                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Tindak lanjut</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">Penyampaian hasil</h4>
                            </div>
                        </div>
                    }
                    timeContent={
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col justify-center">
                                <h4 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" /> Waktu Penyelesaian
                                </h4>
                                <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed font-semibold">
                                    Sesuai jenis dan kompleksitas pengaduan.
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center">
                                <h4 className="font-bold text-[15px] text-neutral-800 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Biaya Layanan
                                </h4>
                                <div className="text-3xl font-black text-green-600 mb-1">Rp0,-</div>
                                <div className="text-lg font-bold text-green-700 mb-3">(GRATIS)</div>
                            </div>
                        </div>
                    }
                    productsContent={
                        <ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Penerimaan pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Informasi status/tindak lanjut pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Hasil penanganan pengaduan sesuai ketentuan</span>
                            </li>
                        </ul>
                    }
                    ctaContent={
                        <div className="bg-white border border-neutral-200 rounded-[24px] p-6 sm:p-8 mt-12 flex flex-col md:flex-row items-center gap-8 justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                    <Search className="w-5 h-5 text-kpu-primary" />
                                    Cek Status Pengaduan
                                </h3>
                                <p className="text-sm text-neutral-600">
                                    Masukkan nomor pengaduan yang Anda terima untuk mengetahui status penanganan pengaduan Anda saat ini secara real-time.
                                </p>
                            </div>
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text"
                                        placeholder="PGD-XXXXXX" 
                                        value={tiketSearch}
                                        onChange={e => setTiketSearch(e.target.value)}
                                        className="pl-10 pr-4 py-3 h-12 w-full sm:w-[250px] rounded-xl border border-neutral-300 focus:border-kpu-primary focus:ring-kpu-primary/20 text-sm focus:outline-none focus:ring-4 transition-all"
                                    />
                                </div>
                                <Button 
                                    className="h-12 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white px-6 font-semibold"
                                    onClick={() => {
                                        if(tiketSearch.trim()) {
                                            window.location.href = `/cek-status?tiket=${tiketSearch.trim()}`;
                                        }
                                    }}
                                >
                                    Cek Status
                                </Button>
                            </div>
                        </div>
                    }
                />
            </main>
        </div>
    );
}
"""

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
