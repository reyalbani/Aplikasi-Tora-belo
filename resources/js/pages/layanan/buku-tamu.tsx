import { Head, useForm } from '@inertiajs/react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';

interface LayananProps {
    layanan: {
        id_layanan: number;
        nama_layanan: string;
        deskripsi: string;
    };
}

export default function BukuTamu({ layanan }: LayananProps) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        nama: '',
        nomor_whatsapp: '',
        email: '',
        instansi: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/layanan/${layanan.id_layanan}/buku-tamu`);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={`Buku Tamu - ${layanan.nama_layanan}`} />

            <ServiceHeader title="Buku Tamu" backUrl="/" />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                <div className="max-w-2xl mx-auto">
                    {/* Form Card */}
                    <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-8 sm:p-10 border-b border-neutral-100 text-center">
                            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">BUKU TAMU</h1>
                            <p className="text-sm text-neutral-500">
                                Silakan lengkapi data diri sebelum melanjutkan ke layanan.
                            </p>
                        </div>

                        {/* Selected Service Info */}
                        <div className="bg-blue-50/50 px-6 py-4 sm:px-10 border-b border-blue-100/50">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">ANDA AKAN MELANJUTKAN KE:</p>
                            <p className="text-base font-bold text-blue-900">{layanan.nama_layanan}</p>
                        </div>

                        {/* Form */}
                        <div className="p-6 sm:p-10">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal}
                                        readOnly
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-600 focus:outline-none"
                                    />
                                </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all placeholder:text-neutral-400 text-sm"
                                    placeholder="Masukkan nama lengkap Anda"
                                    required
                                />
                                {errors.nama && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.nama}</div>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">
                                    Nomor WhatsApp <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.nomor_whatsapp}
                                    onChange={e => setData('nomor_whatsapp', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all placeholder:text-neutral-400 text-sm"
                                    placeholder="Contoh: 08123456789"
                                />
                                {errors.nomor_whatsapp && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.nomor_whatsapp}</div>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">
                                    Email <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all placeholder:text-neutral-400 text-sm"
                                    placeholder="alamat@email.com"
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">
                                    Instansi <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.instansi}
                                    onChange={e => setData('instansi', e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all placeholder:text-neutral-400 text-sm"
                                    placeholder="Asal instansi / organisasi"
                                />
                                {errors.instansi && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.instansi}</div>}
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm dark:shadow-none text-sm font-bold text-white bg-kpu-primary hover:bg-kpu-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors h-12"
                                >
                                    {processing ? 'Memproses...' : 'Lanjut'}
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



