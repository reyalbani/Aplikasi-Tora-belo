import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, CheckCircle2, File, User } from 'lucide-react';
import { useState } from 'react';

export default function Show({ permohonan }: { permohonan: any }) {
    const isi = permohonan.isi_permohonan ? JSON.parse(permohonan.isi_permohonan) : {};
    
    // Status Flow
    const FLOW = [
        'Diajukan',
        'Diterima',
        'Dalam Verifikasi',
        'Dalam Telaah',
        'Didisposisikan',
        'Dalam Klarifikasi',
        'Dalam Tindak Lanjut',
        'Menunggu Jawaban',
        'Selesai'
    ];
    
    const currentStepIndex = FLOW.indexOf(permohonan.status);
    
    // Forms for different actions
    const [actionType, setActionType] = useState<string>('');
    const { data, setData, post, processing, reset } = useForm({
        action_type: '',
        status: '',
        keterangan: '',
        tujuan_disposisi: '',
        catatan_telaah: '',
        hasil_klarifikasi: '',
        tindakan_lanjut: '',
        jawaban_final: '',
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
        post(route('admin.pengaduan-masyarakat.update-status', permohonan.id_permohonan), {
            onSuccess: () => {
                setActionType('');
                reset();
            }
        });
    };

    return (
        <>
            <Head title={`Detail Pengaduan ${permohonan.kode_tiket}`} />
            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="h-9 px-3">
                        <Link href={route('admin.pengaduan-masyarakat.index')}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                            Pengaduan {permohonan.kode_tiket}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800">
                                {permohonan.status}
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Data & Dokumen */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Data Pengaduan */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-kpu-primary" /> Data Pelapor & Pengaduan
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Nama Pelapor</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kategori</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.kategori}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kontak</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.no_hp}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{permohonan.masyarakat?.user?.email}</p>
                                </div>
                            </div>
                            
                            <hr className="my-5 border-neutral-100" />
                            
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Waktu Kejadian (When)</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.when}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Tempat Kejadian (Where)</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.where}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Peristiwa (What)</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.what}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pihak Terlibat (Who)</p>
                                    <p className="text-[13px] font-medium text-neutral-900">{isi.who}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Kronologi (How)</p>
                                    <p className="text-[13px] font-medium text-neutral-900 whitespace-pre-wrap">{isi.how}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Uraian / Penjelasan Tambahan</p>
                                    <p className="text-[13px] font-medium text-neutral-900 whitespace-pre-wrap">{isi.uraian}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dokumen */}
                        <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 p-5 sm:p-6">
                            <h2 className="text-base font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-kpu-primary" /> Dokumen Pendukung / Bukti
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
                                {permohonan.dokumen?.length === 0 && (
                                    <p className="text-sm text-neutral-500 italic">Tidak ada dokumen bukti yang diunggah.</p>
                                )}
                            </div>
                        </div>

                        {/* ACTION PANEL */}
                        {permohonan.status !== 'Selesai' && permohonan.status !== 'Ditolak' && (
                            <div className="bg-blue-50/50 rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-blue-100 p-5 sm:p-6">
                                <h2 className="text-base font-bold text-blue-900 mb-4">Tindakan Petugas</h2>
                                
                                {!actionType ? (
                                    <div className="flex flex-wrap gap-3">
                                        {permohonan.status === 'Diajukan' && (
                                            <>
                                                <Button onClick={() => handleAction('terima', 'Diterima')} className="bg-blue-600 hover:bg-blue-700">Terima Pengaduan</Button>
                                                <Button onClick={() => handleAction('tolak', 'Ditolak')} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Tolak</Button>
                                            </>
                                        )}
                                        {permohonan.status === 'Diterima' && (
                                            <Button onClick={() => handleAction('verifikasi', 'Dalam Verifikasi')} className="bg-blue-600 hover:bg-blue-700">Verifikasi Pengaduan</Button>
                                        )}
                                        {permohonan.status === 'Dalam Verifikasi' && (
                                            <Button onClick={() => handleAction('telaah', 'Dalam Telaah')} className="bg-blue-600 hover:bg-blue-700">Telaah Kasus</Button>
                                        )}
                                        {permohonan.status === 'Dalam Telaah' && (
                                            <Button onClick={() => handleAction('disposisi', 'Didisposisikan')} className="bg-blue-600 hover:bg-blue-700">Disposisikan</Button>
                                        )}
                                        {permohonan.status === 'Didisposisikan' && (
                                            <Button onClick={() => handleAction('klarifikasi', 'Dalam Klarifikasi')} className="bg-blue-600 hover:bg-blue-700">Klarifikasi</Button>
                                        )}
                                        {permohonan.status === 'Dalam Klarifikasi' && (
                                            <Button onClick={() => handleAction('tindak_lanjut', 'Dalam Tindak Lanjut')} className="bg-blue-600 hover:bg-blue-700">Tindak Lanjut</Button>
                                        )}
                                        {permohonan.status === 'Dalam Tindak Lanjut' && (
                                            <Button onClick={() => handleAction('tunggu_jawaban', 'Menunggu Jawaban')} className="bg-blue-600 hover:bg-blue-700">Tunggu Jawaban</Button>
                                        )}
                                        {permohonan.status === 'Menunggu Jawaban' && (
                                            <Button onClick={() => handleAction('selesai', 'Selesai')} className="bg-green-600 hover:bg-green-700 text-white">Selesaikan & Beri Jawaban Final</Button>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={submitAction} className="space-y-4 bg-card p-5 rounded-xl border border-blue-100">
                                        <h3 className="font-bold text-sm text-neutral-800">
                                            {data.status === 'Ditolak' ? 'Tolak Pengaduan' : `Update Status ke: ${data.status}`}
                                        </h3>
                                        
                                        {actionType === 'telaah' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Catatan Telaah</label>
                                                <textarea value={data.catatan_telaah} onChange={e => setData('catatan_telaah', e.target.value)} required rows={3} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Hasil telaah awal..."></textarea>
                                            </div>
                                        )}
                                        
                                        {actionType === 'disposisi' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Tujuan Disposisi</label>
                                                <input type="text" value={data.tujuan_disposisi} onChange={e => setData('tujuan_disposisi', e.target.value)} required className="w-full text-sm rounded-lg border-neutral-300" placeholder="Bidang/Divisi terkait..." />
                                            </div>
                                        )}

                                        {actionType === 'klarifikasi' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Hasil Klarifikasi</label>
                                                <textarea value={data.hasil_klarifikasi} onChange={e => setData('hasil_klarifikasi', e.target.value)} required rows={3} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Klarifikasi dari pihak terkait..."></textarea>
                                            </div>
                                        )}

                                        {actionType === 'tindak_lanjut' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Tindakan Lanjut</label>
                                                    <textarea value={data.tindakan_lanjut} onChange={e => setData('tindakan_lanjut', e.target.value)} required rows={3} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Aksi yang diambil..."></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Upload Dokumen Tindak Lanjut (Opsional)</label>
                                                    <input type="file" onChange={e => setData('dokumentasi', e.target.files?.[0] || null)} className="w-full text-sm" accept=".jpg,.png,.pdf" />
                                                </div>
                                            </>
                                        )}
                                        
                                        {actionType === 'selesai' && (
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jawaban Final untuk Pelapor</label>
                                                <textarea value={data.jawaban_final} onChange={e => setData('jawaban_final', e.target.value)} required rows={4} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Tanggapan resmi yang akan dilihat pelapor..."></textarea>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Keterangan / Catatan Internal</label>
                                            <textarea value={data.keterangan} onChange={e => setData('keterangan', e.target.value)} rows={2} className="w-full text-sm rounded-lg border-neutral-300" placeholder="Catatan untuk petugas..."></textarea>
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
                                <Clock className="w-5 h-5 text-kpu-primary" /> Progress Pengaduan
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



