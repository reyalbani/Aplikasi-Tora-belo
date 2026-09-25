import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function Index({ permohonan, filters }: { permohonan: any, filters: any }) {
    const { data, setData, get } = useForm({
        status: filters.status || ''
    });

    const getStatusColor = (status: string) => {
        if (status === 'Selesai') return 'bg-green-100 text-green-800';
        if (status === 'Diterima' || status === 'Dalam Tindak Lanjut') return 'bg-blue-100 text-blue-800';
        if (status === 'Dalam Klarifikasi' || status === 'Menunggu Jawaban') return 'bg-amber-100 text-amber-800';
        if (status === 'Ditolak') return 'bg-red-100 text-red-800';
        return 'bg-neutral-100 text-neutral-800';
    };

    return (
        <>
            <Head title="Kelola Pengaduan Masyarakat" />
            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengaduan Masyarakat</h1>
                        <p className="text-sm text-neutral-500">Kelola permohonan layanan pengaduan masyarakat.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl shadow-sm dark:shadow-none dark:shadow-none border border-neutral-200 overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select 
                                value={data.status} 
                                onChange={e => {
                                    setData('status', e.target.value);
                                    get(route('admin.pengaduan-masyarakat.index'), { preserveState: true });
                                }}
                                className="text-sm rounded-lg border border-neutral-200 bg-card px-3 py-2 w-full sm:w-[200px]"
                            >
                                <option value="">Semua Status</option>
                                <option value="Diajukan">Diajukan</option>
                                <option value="Diterima">Diterima</option>
                                <option value="Dalam Verifikasi">Dalam Verifikasi</option>
                                <option value="Dalam Telaah">Dalam Telaah</option>
                                <option value="Didisposisikan">Didisposisikan</option>
                                <option value="Dalam Klarifikasi">Dalam Klarifikasi</option>
                                <option value="Dalam Tindak Lanjut">Dalam Tindak Lanjut</option>
                                <option value="Menunggu Jawaban">Menunggu Jawaban</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-neutral-500 bg-neutral-50 border-b border-neutral-200 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">No. Tiket</th>
                                    <th className="px-6 py-4 font-medium">Pemohon</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">Tanggal Kejadian</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {permohonan.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                            Tidak ada data pengaduan ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    permohonan.data.map((item: any) => {
                                        const isi = item.isi_permohonan ? JSON.parse(item.isi_permohonan) : {};
                                        return (
                                            <tr key={item.id_permohonan} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-neutral-900">{item.kode_tiket}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900">{item.masyarakat?.user?.name}</div>
                                                    <div className="text-xs text-neutral-500">{new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', )}</div>
                                                </td>
                                                <td className="px-6 py-4">{isi.kategori || '-'}</td>
                                                <td className="px-6 py-4">{isi.when || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button asChild variant="outline" size="sm" className="h-8">
                                                        <Link href={route('admin.pengaduan-masyarakat.show', item.id_permohonan)}>
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
                    
                    {permohonan.links && permohonan.links.length > 3 && (
                        <div className="p-4 border-t border-neutral-100 flex items-center justify-center gap-1">
                            {permohonan.links.map((link: any, i: number) => (
                                <Link 
                                    key={i} 
                                    href={link.url || '#'} 
                                    className={`px-3 py-1 text-sm rounded-md ${link.active ? 'bg-kpu-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}



