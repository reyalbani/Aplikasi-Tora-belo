import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';

export default function SkmForm({ permohonan }: { permohonan: any }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        tanggal_survei: new Date().toISOString().split('T')[0],
        jam_survei: new Date().toTimeString().split(' ')[0].substring(0, 5),
        nomor_hp: '',
        usia: '',
        jenis_kelamin: '',
        domisili: '',
        pendidikan: '',
        pekerjaan: '',
        saran: '',
        jawaban: {} as Record<number, number>,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/skm/${permohonan.kode_tiket}`);
    };

    const questions = [
        {
            id: 1, text: "Bagaimana pendapat saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?",
            options: [{ val: 1, label: "Tidak Sesuai" }, { val: 2, label: "Kurang Sesuai" }, { val: 3, label: "Sesuai" }, { val: 4, label: "Sangat Sesuai" }]
        },
        {
            id: 2, text: "Bagaimana pemahaman saudara tentang kemudahan prosedur pelayanan di Unit ini?",
            options: [{ val: 1, label: "Tidak Mudah" }, { val: 2, label: "Kurang Mudah" }, { val: 3, label: "Mudah" }, { val: 4, label: "Sangat Mudah" }]
        },
        {
            id: 3, text: "Bagaimana pendapat saudara tentang kecepatan waktu dalam memberikan pelayanan?",
            options: [{ val: 1, label: "Tidak Cepat" }, { val: 2, label: "Kurang Cepat" }, { val: 3, label: "Cepat" }, { val: 4, label: "Sangat Cepat" }]
        },
        {
            id: 4, text: "Bagaimana pendapat saudara tentang kewajaran biaya/tarif dalam pelayanan?",
            options: [{ val: 1, label: "Sangat Mahal" }, { val: 2, label: "Cukup Mahal" }, { val: 3, label: "Murah" }, { val: 4, label: "Gratis" }]
        },
        {
            id: 5, text: "Bagaimana pendapat saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?",
            options: [{ val: 1, label: "Tidak Sesuai" }, { val: 2, label: "Kurang Sesuai" }, { val: 3, label: "Sesuai" }, { val: 4, label: "Sangat Sesuai" }]
        },
        {
            id: 6, text: "Bagaimana pendapat saudara tentang kompetensi/kemampuan petugas dalam pelayanan?",
            options: [{ val: 1, label: "Tidak Kompeten" }, { val: 2, label: "Kurang Kompeten" }, { val: 3, label: "Kompeten" }, { val: 4, label: "Sangat Kompeten" }]
        },
        {
            id: 7, text: "Bagaimana pendapat saudara perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?",
            options: [{ val: 1, label: "Tidak Sopan dan Ramah" }, { val: 2, label: "Kurang Sopan dan Ramah" }, { val: 3, label: "Sopan dan Ramah" }, { val: 4, label: "Sangat Sopan dan Ramah" }]
        },
        {
            id: 8, text: "Bagaimana pendapat saudara tentang kualitas sarana dan prasarana?",
            options: [{ val: 1, label: "Buruk" }, { val: 2, label: "Cukup" }, { val: 3, label: "Baik" }, { val: 4, label: "Sangat Baik" }]
        },
        {
            id: 9, text: "Bagaimana pendapat saudara tentang penanganan pengaduan pengguna layanan?",
            options: [{ val: 1, label: "Tidak ada" }, { val: 2, label: "Ada tetapi tidak berfungsi" }, { val: 3, label: "Berfungsi kurang maksimal" }, { val: 4, label: "Dikelola dengan baik" }]
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title="Survei Kepuasan Masyarakat - TORA BELO" />

            <ServiceHeader title="SKM" backUrl={`/cek-status?tiket=${permohonan.kode_tiket}`} />

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden">
                    <div className="px-6 py-8 sm:p-10 border-b border-neutral-100 text-center">
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">SURVEI KEPUASAN MASYARAKAT</h1>
                        <p className="text-sm text-neutral-500">
                            Silakan isi survei kepuasan terhadap pelayanan yang baru saja Anda terima.
                        </p>
                    </div>

                    <div className="bg-blue-50/50 px-6 py-4 sm:px-10 border-b border-blue-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">LAYANAN YANG DINILAI:</p>
                            <p className="text-base font-bold text-blue-900">{permohonan.jenis_layanan}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 md:text-right">KODE TIKET:</p>
                            <p className="text-base font-bold text-blue-900 md:text-right">{permohonan.kode_tiket}</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        <form onSubmit={submit} className="space-y-10">
                            {/* Section Identitas */}
                            <div>
                                <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2 border-b pb-4 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center shrink-0">1</span>
                                    Data Identitas
                                </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm" required />
                                    {errors.email && <div className="text-red-500 text-xs mt-1.5">{errors.email}</div>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nomor HP <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span></label>
                                    <input type="text" value={data.nomor_hp} onChange={e => setData('nomor_hp', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Tanggal Survei <span className="text-red-500">*</span></label>
                                    <input type="date" value={data.tanggal_survei} readOnly className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-600 focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Jam Survei <span className="text-red-500">*</span></label>
                                    <input type="time" value={data.jam_survei} readOnly className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-600 focus:outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Usia <span className="text-red-500">*</span></label>
                                    <input type="number" value={data.usia} onChange={e => setData('usia', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm" required />
                                    {errors.usia && <div className="text-red-500 text-xs mt-1.5">{errors.usia}</div>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                                    <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm bg-card" required>
                                        <option value="">Pilih</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <div className="text-red-500 text-xs mt-1.5">{errors.jenis_kelamin}</div>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Domisili (Desa/Kel/Kab) <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span></label>
                                    <input type="text" value={data.domisili} onChange={e => setData('domisili', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Pendidikan Terakhir <span className="text-red-500">*</span></label>
                                    <select value={data.pendidikan} onChange={e => setData('pendidikan', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm bg-card" required>
                                        <option value="">Pilih</option>
                                        <option value="SD/Sederajat">SD/Sederajat</option>
                                        <option value="SMP/Sederajat">SMP/Sederajat</option>
                                        <option value="SMA/Sederajat">SMA/Sederajat</option>
                                        <option value="D3/Sederajat">D3/Sederajat</option>
                                        <option value="S1/Sederajat">S1/Sederajat</option>
                                        <option value="S2/Sederajat">S2/Sederajat</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.pendidikan && <div className="text-red-500 text-xs mt-1.5">{errors.pendidikan}</div>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Pekerjaan <span className="text-neutral-400 font-normal ml-1">(Tidak wajib)</span></label>
                                    <select value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm bg-card">
                                        <option value="">Pilih</option>
                                        <option value="ASN">ASN</option>
                                        <option value="POLRI">POLRI</option>
                                        <option value="Tni">TNI</option>
                                        <option value="SWASTA">SWASTA</option>
                                        <option value="WIRASWASTA">WIRASWASTA</option>
                                        <option value="PPK/PPS">PPK/PPS</option>
                                        <option value="BAWASLU/PANWASCAM">BAWASLU/PANWASCAM</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section Pertanyaan */}
                        <div>
                            <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2 border-b pb-4 mb-6">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">2</span>
                                Pertanyaan Survei
                            </h2>
                            <div className="space-y-6">
                                {questions.map(q => (
                                    <div key={q.id} className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                                        <p className="font-semibold text-neutral-800 text-sm mb-4 leading-relaxed">{q.id}. {q.text} <span className="text-red-500">*</span></p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                            {q.options.map(opt => (
                                                <label key={opt.val} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${data.jawaban[q.id] === opt.val ? 'bg-kpu-primary/5 border-kpu-primary/30 text-kpu-primary font-medium' : 'bg-card border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q_${q.id}`} 
                                                        value={opt.val}
                                                        checked={data.jawaban[q.id] === opt.val}
                                                        onChange={() => {
                                                            setData('jawaban', { ...data.jawaban, [q.id]: opt.val });
                                                        }}
                                                        className="w-4 h-4 text-kpu-primary focus:ring-kpu-primary border-gray-300"
                                                        required
                                                    />
                                                    <span className="text-[13px]">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2 border-b pb-4 mb-6">
                                <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">3</span>
                                Saran dan Masukan
                            </h2>
                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Saran & Masukan <span className="text-red-500">*</span></label>
                            <textarea 
                                value={data.saran} 
                                onChange={e => setData('saran', e.target.value)} 
                                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-kpu-primary focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all text-sm min-h-[120px]" 
                                placeholder="Tuliskan saran, kritik, atau masukan Anda di sini..."
                                required
                            />
                            {errors.saran && <div className="text-red-500 text-xs mt-1.5">{errors.saran}</div>}
                        </div>

                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm dark:shadow-none text-sm font-bold text-white bg-kpu-primary hover:bg-kpu-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors h-14"
                            >
                                {processing ? 'Memproses...' : 'Kirim Survei Kepuasan Masyarakat'}
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>
        </div>
    );
}



