import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, CheckCircle2, File, User, Building, Phone, Mail, MapPin, ShieldAlert, Activity, Send } from 'lucide-react';
import { useState } from 'react';

export default function Show({ permohonan }: { permohonan: any }) {
    const isi = permohonan.isi_permohonan ? JSON.parse(permohonan.isi_permohonan) : {};
    const isKeberatan = permohonan.kode_tiket.startsWith('KBT') || isi.tipe_pengajuan === 'keberatan';

    // Status Flow based on whether it is Keberatan or Standard Permohonan
    const FLOW = isKeberatan ? [
        'Pengajuan Keberatan',
        'Pemeriksaan Berkas & Registrasi',
        'Proses Pengolahan Informasi',
        'Tanggapan Atasan PPID',
        'Selesai'
    ] : [
        'Pengajuan Permohonan',
        'Pemeriksaan Berkas & Registrasi',
        'Proses Pengolahan Informasi',
        'Penyampaian Pemberitahuan Tertulis',
        'Penyerahan Informasi'
    ];
    
    const currentStepIndex = FLOW.indexOf(permohonan.status);
    
    const [actionType, setActionType] = useState<string>('');
    const { data, setData, post, processing, errors, reset } = useForm({
        action_type: '',
        status: '',
        keterangan: '',
        catatan_pengolahan: '',
        nomor_surat_pemberitahuan: '',
        format_penyerahan: '',
        biaya_penggandaan: 'Rp 0 (Gratis)',
        tanggapan_atasan: '',
        dokumen_lampiran: null as File | null,
    });

    const handleAction = (type: string, nextStatus: string) => {
        setActionType(type);
        setData({
            ...data,
            action_type: type,
            status: nextStatus,
            keterangan: '',
        });
    };

    const submitAction = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.ppid.update-status', permohonan.id_permohonan), {
            onSuccess: () => {
                setActionType('');
                reset();
            }
        });
    };

    return (
        <>
            <Head title={`Detail Layanan PPID - ${permohonan.kode_tiket}`} />
            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="h-9 px-3">
                        <Link href={route('admin.ppid.index')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                            {isKeberatan ? 'Keberatan' : 'Permohonan'} {permohonan.kode_tiket}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800">
                                {permohonan.status}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Data & Dokumen */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Data Pemohon */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-kpu-primary" /> Data Pemohon
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Nama Pemohon</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kategori Pemohon</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.jenis_pemohon || 'Perorangan'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">NIK</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.nik || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pekerjaan</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.pekerjaan || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Nomor Kontak / WhatsApp</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.no_hp}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.email}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Alamat</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.alamat || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Materi Pengajuan */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                {isKeberatan ? <ShieldAlert className="w-5 h-5 text-amber-600" /> : <FileText className="w-5 h-5 text-kpu-primary" />}
                                {isKeberatan ? 'Materi Pengajuan Keberatan' : 'Detail Permohonan Informasi'}
                            </h2>

                            {isKeberatan ? (
                                <div className="space-y-4">
                                    {isi.kode_tiket_awal && (
                                        <div>
                                            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tiket Permohonan Awal</p>
                                            <p className="text-[13px] font-bold text-kpu-primary">{isi.kode_tiket_awal}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Alasan Keberatan</p>
                                        <p className="text-[13px] font-bold text-neutral-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">{isi.alasan_keberatan}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kasus Posisi & Kronologi</p>
                                        <p className="text-[13px] font-medium text-neutral-800 bg-neutral-50 p-3 rounded-lg border border-neutral-100 whitespace-pre-wrap leading-relaxed">{isi.kasus_posisi}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Rincian Informasi yang Dibutuhkan</p>
                                        <p className="text-[13px] font-medium text-neutral-800 bg-neutral-50 p-3 rounded-lg border border-neutral-100 whitespace-pre-wrap leading-relaxed">{isi.rincian_informasi}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tujuan Penggunaan</p>
                                        <p className="text-[13px] font-medium text-neutral-900">{isi.tujuan_penggunaan}</p>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Cara Memperoleh</p>
                                            <p className="text-[13px] font-medium text-neutral-900">{isi.cara_memperoleh}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Bentuk Salinan</p>
                                            <p className="text-[13px] font-medium text-neutral-900">{isi.cara_mendapatkan_salinan}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dokumen Unggahan */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <File className="w-5 h-5 text-kpu-primary" /> Dokumen Pendukung
                            </h2>
                            {permohonan.dokumen_permohonan && permohonan.dokumen_permohonan.length > 0 ? (
                                <div className="divide-y divide-neutral-100">
                                    {permohonan.dokumen_permohonan.map((doc: any) => (
                                        <div key={doc.id_dokumen} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-lg flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-neutral-900">{doc.jenis_dokumen}</p>
                                                    <p className="text-[11px] text-neutral-500">{doc.nama_file} • {(doc.ukuran_file / 1024).toFixed(0)} KB</p>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="h-8">
                                                <a href={`/${doc.path_file}`} target="_blank" rel="noopener noreferrer">
                                                    Buka File
                                                </a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-neutral-500 italic">Tidak ada berkas dokumen yang terlampir.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Status Timeline & Action Buttons */}
                    <div className="space-y-6">
                        {/* Process Action Panel */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-kpu-primary" /> Tindakan Petugas PPID
                            </h2>

                            {actionType ? (
                                <form onSubmit={submitAction} className="space-y-4">
                                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                        <p className="text-xs font-semibold text-neutral-500">Status Baru yang Diproses:</p>
                                        <p className="text-sm font-bold text-neutral-900">{data.status}</p>
                                    </div>

                                    {actionType === 'pengolahan' && (
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 mb-1">Catatan Pengujian Konsekuensi / Pengolahan</label>
                                            <textarea
                                                value={data.catatan_pengolahan}
                                                onChange={e => setData('catatan_pengolahan', e.target.value)}
                                                rows={3}
                                                className="w-full text-xs rounded-lg border border-neutral-200 p-2.5"
                                                placeholder="Hasil koordinasi dengan subbagian teknis terkait..."
                                            ></textarea>
                                        </div>
                                    )}

                                    {actionType === 'pemberitahuan' && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nomor Surat Pemberitahuan Tertulis</label>
                                                <input
                                                    type="text"
                                                    value={data.nomor_surat_pemberitahuan}
                                                    onChange={e => setData('nomor_surat_pemberitahuan', e.target.value)}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2.5"
                                                    placeholder="Contoh: 120/PPID/KPU-PL/VIII/2026"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Format Penyerahan & Biaya</label>
                                                <input
                                                    type="text"
                                                    value={data.format_penyerahan}
                                                    onChange={e => setData('format_penyerahan', e.target.value)}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2.5"
                                                    placeholder="Contoh: Softcopy (PDF) via portal TORA BELO / Email"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Unggah Surat Pemberitahuan Resmi (PDF)</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setData('dokumen_lampiran', e.target.files?.[0] || null)}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'tanggapan' && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Tanggapan Resmi Atasan PPID</label>
                                                <textarea
                                                    value={data.tanggapan_atasan}
                                                    onChange={e => setData('tanggapan_atasan', e.target.value)}
                                                    rows={4}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2.5"
                                                    placeholder="Tuliskan keputusan dan tanggapan tertulis Atasan PPID atas keberatan..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Unggah Surat Tanggapan Atasan PPID (PDF)</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setData('dokumen_lampiran', e.target.files?.[0] || null)}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'penyerahan' && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1">Unggah File Informasi / Dokumen Publik untuk Pemohon</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setData('dokumen_lampiran', e.target.files?.[0] || null)}
                                                    className="w-full text-xs rounded-lg border border-neutral-200 p-2"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 mb-1">Catatan Keterangan</label>
                                        <textarea
                                            value={data.keterangan}
                                            onChange={e => setData('keterangan', e.target.value)}
                                            rows={2}
                                            className="w-full text-xs rounded-lg border border-neutral-200 p-2.5"
                                            placeholder="Keterangan perkembangan yang dapat dibaca oleh pemohon di Cek Status..."
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setActionType('')} className="flex-1">
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing} size="sm" className="flex-1 bg-kpu-primary hover:bg-red-700 text-white font-bold">
                                            {processing ? 'Menyimpan...' : 'Simpan & Update'}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-2.5">
                                    {permohonan.status === 'Pengajuan Permohonan' && (
                                        <Button 
                                            onClick={() => handleAction('verifikasi', 'Pemeriksaan Berkas & Registrasi')}
                                            className="w-full justify-start text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white h-9"
                                        >
                                            1. Periksa Berkas & Registrasi Permohonan
                                        </Button>
                                    )}

                                    {permohonan.status === 'Pengajuan Keberatan' && (
                                        <Button 
                                            onClick={() => handleAction('verifikasi', 'Pemeriksaan Berkas & Registrasi')}
                                            className="w-full justify-start text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white h-9"
                                        >
                                            1. Registrasi Pengajuan Keberatan
                                        </Button>
                                    )}

                                    {permohonan.status === 'Pemeriksaan Berkas & Registrasi' && (
                                        <Button 
                                            onClick={() => handleAction('pengolahan', 'Proses Pengolahan Informasi')}
                                            className="w-full justify-start text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white h-9"
                                        >
                                            2. Mulai Pengolahan & Uji Konsekuensi Informasi
                                        </Button>
                                    )}

                                    {permohonan.status === 'Proses Pengolahan Informasi' && !isKeberatan && (
                                        <Button 
                                            onClick={() => handleAction('pemberitahuan', 'Penyampaian Pemberitahuan Tertulis')}
                                            className="w-full justify-start text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white h-9"
                                        >
                                            3. Terbitkan Surat Pemberitahuan Tertulis
                                        </Button>
                                    )}

                                    {permohonan.status === 'Proses Pengolahan Informasi' && isKeberatan && (
                                        <Button 
                                            onClick={() => handleAction('tanggapan', 'Tanggapan Atasan PPID')}
                                            className="w-full justify-start text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white h-9"
                                        >
                                            3. Masukkan Tanggapan Atasan PPID
                                        </Button>
                                    )}

                                    {permohonan.status === 'Penyampaian Pemberitahuan Tertulis' && (
                                        <Button 
                                            onClick={() => handleAction('penyerahan', 'Penyerahan Informasi')}
                                            className="w-full justify-start text-xs font-semibold bg-green-600 hover:bg-green-700 text-white h-9"
                                        >
                                            4. Serahkan Informasi & Selesaikan Layanan
                                        </Button>
                                    )}

                                    {permohonan.status === 'Tanggapan Atasan PPID' && (
                                        <Button 
                                            onClick={() => handleAction('selesai', 'Selesai')}
                                            className="w-full justify-start text-xs font-semibold bg-green-600 hover:bg-green-700 text-white h-9"
                                        >
                                            4. Tandai Selesai Penanganan Keberatan
                                        </Button>
                                    )}

                                    {(permohonan.status === 'Penyerahan Informasi' || permohonan.status === 'Selesai') && (
                                        <div className="p-3 bg-green-50 rounded-lg text-green-700 text-xs font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            Layanan PPID ini telah selesai diproses.
                                        </div>
                                    )}

                                    {permohonan.status !== 'Selesai' && permohonan.status !== 'Penyerahan Informasi' && permohonan.status !== 'Ditolak' && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleAction('tolak', 'Ditolak')}
                                            className="w-full justify-start text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 h-9"
                                        >
                                            Tolak Permohonan / Tidak Memenuhi Syarat
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Riwayat Status */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-kpu-primary" /> Riwayat Status & Timeline
                            </h2>
                            <div className="space-y-4">
                                {permohonan.status_permohonan?.map((hist: any, i: number) => (
                                    <div key={hist.id_status || i} className="relative pl-5 pb-4 last:pb-0 border-l-2 border-neutral-200 last:border-transparent">
                                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-kpu-primary"></div>
                                        <p className="text-xs font-bold text-neutral-900">{hist.status}</p>
                                        <p className="text-[11px] text-neutral-400 mb-1">{new Date(hist.waktu).toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-neutral-600 leading-relaxed">{hist.keterangan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



