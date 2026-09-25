import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, CheckCircle2, File, User, Building, Phone, Mail, MapPin, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function Show({ permohonan }: { permohonan: any }) {
    const isi = permohonan.isi_permohonan ? JSON.parse(permohonan.isi_permohonan) : {};
    
    // Status Flow
    const FLOW = [
        'Pengajuan Permohonan',
        'Penerimaan & Verifikasi Berkas',
        'Disposisi Pimpinan',
        'Kajian & Koordinasi Teknis',
        'Konfirmasi & Persetujuan',
        'Pelaksanaan Kegiatan',
        'Evaluasi & Dokumentasi',
        'Selesai'
    ];
    
    const currentStepIndex = FLOW.indexOf(permohonan.status);
    
    // Forms for different actions
    const [actionType, setActionType] = useState<string>('');
    const { data, setData, post, processing, errors, reset } = useForm({
        action_type: '',
        status: '',
        keterangan: '',
        tujuan_disposisi: '',
        catatan_kajian: '',
        hasil_konfirmasi: '',
        tanggal_pelaksanaan: '',
        dokumentasi: null as File | null,
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
        post(route('admin.pendidikan-pemilih.update-status', permohonan.id_permohonan), {
            onSuccess: () => {
                setActionType('');
                reset();
            }
        });
    };

    return (
        <>
            <Head title={`Detail Permohonan ${permohonan.kode_tiket}`} />
            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="h-9 px-3">
                        <Link href={route('admin.pendidikan-pemilih.index')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                            Permohonan {permohonan.kode_tiket}
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
                                <User className="w-5 h-5 text-kpu-primary" /> Data Pemohon & Kegiatan
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Nama Pemohon</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Lembaga</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.lembaga}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kontak</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.no_hp}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.email}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Alamat</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.alamat}</p>
                                </div>
                            </div>
                            
                            <hr className="my-5 border-neutral-100" />
                            
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Waktu Pelaksanaan</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.waktu_kegiatan}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tempat</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.tempat_kegiatan}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Bentuk Kegiatan</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.bentuk_kegiatan}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Jumlah Peserta</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.jumlah_peserta} Orang</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Profil/Sasaran Peserta</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.profil_peserta}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Topik/Materi</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.topik_materi}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dokumen */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-kpu-primary" /> Dokumen Pendukung
                            </h2>
                            <div className="space-y-3">
                                {permohonan.dokumen?.map((doc: any) => (
                                    <div key={doc.id_dokumen} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 text-kpu-primary flex items-center justify-center shrink-0">
                                                <File className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">{doc.jenis_dokumen}</p>
                                                <p className="text-[11px] text-neutral-500">{doc.nama_file}</p>
                                            </div>
                                        </div>
                                        <a href={`/${doc.path_file}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-kpu-primary hover:underline px-3 py-1.5 bg-red-50 rounded-lg">
                                            Lihat File
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACTION PANEL */}
                        {permohonan.status !== 'Selesai' && permohonan.status !== 'Ditolak' && (
                            <div className="bg-blue-50/50 rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-blue-100 p-5 sm:p-6">
                                <h2 className="text-base font-bold text-blue-900 mb-4">Tindakan Petugas</h2>
                                
                                {!actionType ? (
                                    <div className="flex flex-wrap gap-3">
                                        {permohonan.status === 'Pengajuan Permohonan' && (
                                            <>
                                                <Button onClick={() => handleAction('verify', 'Penerimaan & Verifikasi Berkas')} className="bg-blue-600 hover:bg-blue-700">Terima & Verifikasi Berkas</Button>
                                                <Button onClick={() => handleAction('tolak', 'Ditolak')} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Tolak Permohonan</Button>
                                            </>
                                        )}
                                        {permohonan.status === 'Penerimaan & Verifikasi Berkas' && (
                                            <Button onClick={() => handleAction('disposisi', 'Disposisi Pimpinan')} className="bg-blue-600 hover:bg-blue-700">Lanjut ke Disposisi</Button>
                                        )}
                                        {permohonan.status === 'Disposisi Pimpinan' && (
                                            <Button onClick={() => handleAction('kajian', 'Kajian & Koordinasi Teknis')} className="bg-blue-600 hover:bg-blue-700">Lanjut ke Kajian Teknis</Button>
                                        )}
                                        {permohonan.status === 'Kajian & Koordinasi Teknis' && (
                                            <Button onClick={() => handleAction('konfirmasi', 'Konfirmasi & Persetujuan')} className="bg-blue-600 hover:bg-blue-700">Lanjut ke Konfirmasi</Button>
                                        )}
                                        {permohonan.status === 'Konfirmasi & Persetujuan' && (
                                            <Button onClick={() => handleAction('pelaksanaan', 'Pelaksanaan Kegiatan')} className="bg-blue-600 hover:bg-blue-700">Mulai Pelaksanaan Kegiatan</Button>
                                        )}
                                        {permohonan.status === 'Pelaksanaan Kegiatan' && (
                                            <Button onClick={() => handleAction('evaluasi', 'Evaluasi & Dokumentasi')} className="bg-blue-600 hover:bg-blue-700">Lanjut ke Evaluasi</Button>
                                        )}
                                        {permohonan.status === 'Evaluasi & Dokumentasi' && (
                                            <Button onClick={() => handleAction('selesai', 'Selesai')} className="bg-green-600 hover:bg-green-700 text-white">Selesaikan Layanan</Button>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={submitAction} className="space-y-4 bg-card p-5 rounded-xl border border-blue-100">
                                        <h3 className="font-bold text-sm text-neutral-800">
                                            {data.status === 'Ditolak' ? 'Tolak Permohonan' : `Update Status ke: ${data.status}`}
                                        </h3>
                                        
                                        {actionType === 'disposisi' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Tujuan Disposisi</label>
                                                <input type="text" value={data.tujuan_disposisi} onChange={e => setData('tujuan_disposisi', e.target.value)} required className="w-full text-sm rounded-lg border-neutral-300" placeholder="Cth: Subbag Parhubmas..." />
                                            </div>
                                        )}
                                        
                                        {actionType === 'kajian' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Hasil Kajian & Persiapan</label>
                                                <textarea value={data.catatan_kajian} onChange={e => setData('catatan_kajian', e.target.value)} required rows={3} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Catat narasumber, metode, dll..."></textarea>
                                            </div>
                                        )}

                                        {actionType === 'konfirmasi' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Hasil Konfirmasi ke Pemohon</label>
                                                <textarea value={data.hasil_konfirmasi} onChange={e => setData('hasil_konfirmasi', e.target.value)} required rows={2} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Cth: Jadwal disetujui untuk tgl X..."></textarea>
                                            </div>
                                        )}

                                        {actionType === 'pelaksanaan' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Tanggal Pelaksanaan Aktual</label>
                                                    <input type="date" value={data.tanggal_pelaksanaan} onChange={e => setData('tanggal_pelaksanaan', e.target.value)} required className="w-full text-sm rounded-lg border-neutral-300" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Upload Dokumentasi Kegiatan (Opsional)</label>
                                                    <input type="file" onChange={e => setData('dokumentasi', e.target.files?.[0] || null)} className="w-full text-sm" accept=".jpg,.png,.pdf" />
                                                </div>
                                            </>
                                        )}
                                        
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Keterangan / Catatan Status</label>
                                            <textarea value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} rows={2} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Opsional..."></textarea>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setActionType('')}>Batal</Button>
                                            <Button type="submit" disabled={processing} className={data.status === 'Ditolak' ? 'bg-red-600 hover:bg-red-700' : 'bg-kpu-primary hover:bg-red-700'}>
                                                {processing ? 'Menyimpan...' : 'Simpan & Update Status'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Timeline & Riwayat */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-kpu-primary" /> Progress Layanan
                            </h2>
                            <div className="space-y-5">
                                {FLOW.map((step, idx) => {
                                    const isCompleted = currentStepIndex >= idx;
                                    const isActive = currentStepIndex === idx;
                                    return (
                                        <div key={idx} className="flex gap-4 relative">
                                            {idx < FLOW.length - 1 && (
                                                <div className={`absolute left-[11px] top-7 w-[2px] h-full -ml-[1px] ${currentStepIndex > idx ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
                                            )}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${isActive ? 'bg-kpu-primary text-white shadow-sm dark:shadow-none dark:shadow-none ring-4 ring-red-50' : isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
                                                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                                            </div>
                                            <div className="pt-0.5 pb-2">
                                                <p className={`text-sm font-semibold ${isActive ? 'text-kpu-primary' : isCompleted ? 'text-neutral-900' : 'text-neutral-500'}`}>{step}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-kpu-primary" /> Riwayat Status
                            </h2>
                            <div className="space-y-4">
                                {permohonan.status_riwayat?.map((riwayat: any) => (
                                    <div key={riwayat.id_status} className="border-l-2 border-neutral-100 pl-4 py-1 relative">
                                        <div className="absolute w-2 h-2 rounded-full bg-neutral-300 -left-[5px] top-2.5"></div>
                                        <p className="text-xs font-semibold text-neutral-500 mb-1">
                                            {new Date(riwayat.waktu).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                        </p>
                                        <p className="text-sm font-bold text-neutral-800">{riwayat.status}</p>
                                        {riwayat.keterangan && (
                                            <p className="text-[13px] text-neutral-600 mt-1 leading-relaxed bg-neutral-50 p-2 rounded-lg border border-neutral-100">{riwayat.keterangan}</p>
                                        )}
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



