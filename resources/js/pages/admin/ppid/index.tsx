import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, FileText, ShieldAlert } from 'lucide-react';

export default function Index({ permohonan, filters }: { permohonan: any, filters: any }) {
    const { data, setData, get } = useForm({
        status: filters.status || '',
        tipe: filters.tipe || '',
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pengajuan permohonan':
            case 'pengajuan keberatan':
                return 'bg-blue-100 text-blue-800';
            case 'pemeriksaan berkas & registrasi':
                return 'bg-amber-100 text-amber-800';
            case 'proses pengolahan informasi':
                return 'bg-indigo-100 text-indigo-800';
            case 'penyampaian pemberitahuan tertulis':
            case 'tanggapan atasan ppid':
                return 'bg-purple-100 text-purple-800';
            case 'penyerahan informasi':
            case 'selesai':
                return 'bg-green-100 text-green-800';
            case 'ditolak':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <>
            <Head title="Kelola Pejabat Pengelola Informasi dan Dokumentasi" />
            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pejabat Pengelola Informasi dan Dokumentasi</h1>
                        <p className="text-sm text-neutral-500">Kelola permohonan informasi publik dan pengajuan keberatan PPID.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <select 
                                value={data.tipe} 
                                onChange={e => {
                                    setData('tipe', e.target.value);
                                    router.get(route('admin.ppid.index'), { ...data, tipe: e.target.value }, { preserveState: true });
                                }}
                                className="text-sm rounded-lg border border-neutral-200 bg-card px-3 py-2 w-full sm:w-[180px]"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="permohonan">Permohonan Informasi</option>
                                <option value="keberatan">Pengajuan Keberatan</option>
                            </select>

                            <select 
                                value={data.status} 
                                onChange={e => {
                                    setData('status', e.target.value);
                                    router.get(route('admin.ppid.index'), { ...data, status: e.target.value }, { preserveState: true });
                                }}
                                className="text-sm rounded-lg border border-neutral-200 bg-card px-3 py-2 w-full sm:w-[220px]"
                            >
                                <option value="">Semua Status</option>
                                <option value="Pengajuan Permohonan">Pengajuan Permohonan</option>
                                <option value="Pengajuan Keberatan">Pengajuan Keberatan</option>
                                <option value="Pemeriksaan Berkas & Registrasi">Pemeriksaan Berkas & Registrasi</option>
                                <option value="Proses Pengolahan Informasi">Proses Pengolahan Informasi</option>
                                <option value="Penyampaian Pemberitahuan Tertulis">Penyampaian Pemberitahuan Tertulis</option>
                                <option value="Tanggapan Atasan PPID">Tanggapan Atasan PPID</option>
                                <option value="Penyerahan Informasi">Penyerahan Informasi</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 bg-neutral-50 border-b border-neutral-200 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">No. Tiket</th>
                                    <th className="px-6 py-4 font-medium">Pemohon</th>
                                    <th className="px-6 py-4 font-medium">Jenis Pengajuan</th>
                                    <th className="px-6 py-4 font-medium">Kategori Pemohon</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {permohonan.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                            Tidak ada data permohonan atau keberatan PPID.
                                        </td>
                                    </tr>
                                ) : (
                                    permohonan.data.map((item: any) => {
                                        const isi = item.isi_permohonan ? JSON.parse(item.isi_permohonan) : {};
                                        const isKeberatan = item.kode_tiket.startsWith('KBT') || isi.tipe_pengajuan === 'keberatan';
                                        return (
                                            <tr key={item.id_permohonan} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-neutral-900">{item.kode_tiket}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900">{item.masyarakat?.user?.name}</div>
                                                    <div className="text-xs text-neutral-500">{new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', )}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isKeberatan ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                            <ShieldAlert className="w-3.5 h-3.5" /> Keberatan
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                                            <FileText className="w-3.5 h-3.5" /> Permohonan Info
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">{isi.jenis_pemohon || 'Perorangan'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button asChild variant="outline" size="sm" className="h-8">
                                                        <Link href={route('admin.ppid.show', item.id_permohonan)}>
                                                            <Eye className="w-4 h-4 mr-1.5" /> Detail
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {permohonan.links && permohonan.links.length > 3 && (
                        <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
                            <div className="text-xs text-neutral-500">
                                Menampilkan {permohonan.from || 0} - {permohonan.to || 0} dari {permohonan.total} data
                            </div>
                            <div className="flex gap-1">
                                {permohonan.links.map((link: any, i: number) => (
                                    <Button
                                        key={i}
                                        asChild={Boolean(link.url)}
                                        disabled={!link.url}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 min-w-[32px] px-2 text-xs"
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}



