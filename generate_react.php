<?php
$services = [
    'PPID' => 'Layanan PPID',
    'PendidikanPemilih' => 'Layanan Pendidikan Pemilih',
    'PengaduanMasyarakat' => 'Layanan Pengaduan Masyarakat',
    'KerjaSama' => 'Layanan Kerjasama',
    'Mutarlih' => 'Layanan Pemutakhiran Data Pemilih',
    'Muparpol' => 'Layanan Pemutakhiran Data Partai Politik',
    'PengantaranSurat' => 'Pengantaran Surat',
    'Konsultasi' => 'Konsultasi',
    'PengaduanPelayanan' => 'Layanan Pengaduan Pelayanan'
];

$base_dir = __DIR__ . '/resources/js/pages/petugas';
if(!is_dir($base_dir)) {
    mkdir($base_dir, 0777, true);
}

// 1. Dashboard
$dashboard = <<<'REACT'
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Dashboard({ aggregates }: { aggregates: any[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Petugas', href: '/petugas/area' }]}>
            <Head title="Dashboard Petugas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {aggregates.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                            <h3 className="text-lg font-medium text-slate-800">{item.name}</h3>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{item.total}</div>
                            <p className="text-sm text-slate-500">Total Permohonan</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
REACT;
file_put_contents($base_dir . '/Dashboard.tsx', $dashboard);

// 2. Index & Show templates
$indexTemplate = <<<'REACT'
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function Index({ permohonan, filters }: any) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || ''
    });

    const handleSearch = (e: any) => {
        e.preventDefault();
        get(window.location.pathname);
    };

    return (
        <AppLayout breadcrumbs={[{ title: '{TITLE}', href: '#' }]}>
            <Head title="{TITLE}" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">{TITLE}</h1>
                </div>

                <div className="bg-white p-4 rounded-xl border border-sidebar-border/70 shadow-sm mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Cari kode tiket..." 
                            className="px-4 py-2 border rounded-lg flex-1"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                        <select 
                            className="px-4 py-2 border rounded-lg"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="Pengajuan Permohonan">Pengajuan Permohonan</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                        <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg">Filter</button>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-sidebar-border/70 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 border-b">
                            <tr>
                                <th className="p-4">Kode Tiket</th>
                                <th className="p-4">Pemohon</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permohonan.data.map((item: any) => (
                                <tr key={item.id_permohonan} className="border-b hover:bg-slate-50/50">
                                    <td className="p-4 font-medium">{item.kode_tiket}</td>
                                    <td className="p-4">{item.masyarakat?.user?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="p-4">
                                        <Link href={`${window.location.pathname}/${item.id_permohonan}`} className="text-blue-600 hover:underline">
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
REACT;

$showTemplate = <<<'REACT'
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ permohonan }: any) {
    const { data, setData, post, processing, errors } = useForm({
        status: permohonan.status,
        keterangan: '',
        dokumen_lampiran: null as File | null,
    });

    const submitStatus = (e: any) => {
        e.preventDefault();
        post(`${window.location.pathname}/status`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: '{TITLE}', href: '#' }, { title: 'Detail', href: '#' }]}>
            <Head title={`Detail ${permohonan.kode_tiket}`} />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Informasi Permohonan ({permohonan.kode_tiket})</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Pemohon</span>
                                <p className="font-medium">{permohonan.masyarakat?.user?.name || '-'}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Tanggal Pengajuan</span>
                                <p className="font-medium">{new Date(permohonan.tanggal_pengajuan).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-500">Isi Permohonan (JSON)</span>
                                <pre className="mt-2 bg-slate-50 p-4 rounded-lg overflow-x-auto border text-xs">
                                    {JSON.stringify(JSON.parse(permohonan.isi_permohonan), null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Riwayat Status</h2>
                        <div className="space-y-4">
                            {permohonan.status_permohonan?.map((history: any) => (
                                <div key={history.id_status} className="border-l-2 border-slate-200 pl-4 py-1">
                                    <p className="font-medium text-sm">{history.status}</p>
                                    <p className="text-slate-500 text-xs">{new Date(history.waktu).toLocaleString('id-ID')}</p>
                                    <p className="text-sm mt-1">{history.keterangan}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Update Status</h2>
                        <form onSubmit={submitStatus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status Baru</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="Pengajuan Permohonan">Pengajuan Permohonan</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Keterangan</label>
                                <textarea 
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    rows={3}
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Dokumen Lampiran (Opsional)</label>
                                <input 
                                    type="file" 
                                    className="w-full text-sm"
                                    onChange={e => setData('dokumen_lampiran', e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                Simpan Status
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-sidebar-border/70 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Dokumen Pemohon</h2>
                        <ul className="space-y-2 text-sm">
                            {permohonan.dokumen_permohonan?.length > 0 ? permohonan.dokumen_permohonan.map((doc: any) => (
                                <li key={doc.id_dokumen} className="flex justify-between items-center border-b pb-2">
                                    <span className="truncate flex-1">{doc.jenis_dokumen}</span>
                                    <a href={`/${doc.path_file}`} target="_blank" className="text-blue-600 hover:underline ml-2">Lihat</a>
                                </li>
                            )) : (
                                <p className="text-slate-500">Tidak ada dokumen lampiran.</p>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
REACT;

foreach($services as $dir => $title) {
    $targetDir = $base_dir . '/' . $dir;
    if(!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    
    $indexStr = str_replace('{TITLE}', $title, $indexTemplate);
    $showStr = str_replace('{TITLE}', $title, $showTemplate);
    
    file_put_contents($targetDir . '/Index.tsx', $indexStr);
    file_put_contents($targetDir . '/Show.tsx', $showStr);
}

echo "React pages generated.\n";
