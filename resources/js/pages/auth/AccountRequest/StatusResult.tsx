import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    accountRequests: any[];
    method?: 'phone' | 'code';
    contact: {
        whatsapp: string;
        email: string;
    };
};

export default function StatusResult({ accountRequests = [], method = 'phone', contact }: Props) {
    if (accountRequests.length === 0) {
        return (
            <>
                <Head title="Status Permohonan" />
                <div className="mb-6 flex flex-col gap-2">
                    <Link href="/permohonan-akun/status" className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 mb-6 shadow-sm flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    {method === 'phone' ? (
                        <>
                            <h2 className="text-xl font-bold text-foreground mb-2">Permohonan Tidak Ditemukan</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Permohonan dengan nomor HP tersebut tidak ditemukan.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-foreground mb-2">Permohonan Tidak Ditemukan</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Kode permohonan tidak ditemukan. Periksa kembali kode yang Anda masukkan.
                            </p>
                        </>
                    )}
                    <Link href="/permohonan-akun" className="w-full">
                        <Button className="w-full bg-red-600 text-white font-bold hover:bg-red-700 h-[48px] rounded-[12px]">
                            AJUKAN PERMOHONAN AKUN
                        </Button>
                    </Link>
                </div>

                <a 
                    href={contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : `mailto:${contact.email}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] border border-slate-200 bg-slate-50 text-[14px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                >
                    HUBUNGI ADMIN
                </a>
            </>
        );
    }

    return (
        <>
            <Head title="Status Permohonan" />

            <div className="mb-6 flex flex-col gap-2">
                <Link href="/permohonan-akun/status" className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </Link>
                <h1 className="text-xl font-bold text-foreground">Permohonan Anda</h1>
            </div>

            <div className="flex flex-col gap-6 mb-6">
                {accountRequests.map((accountRequest, index) => {
                    const isPending = accountRequest.status === 'pending';
                    const isReviewing = accountRequest.status === 'reviewing';
                    const isApproved = accountRequest.status === 'approved';
                    const isRejected = accountRequest.status === 'rejected';

                    return (
                        <div key={accountRequest.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                                <div className="text-sm font-bold text-slate-500">#{accountRequests.length - index}</div>
                                {isPending && <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">MENUNGGU VERIFIKASI</div>}
                                {isReviewing && <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">DIPROSES</div>}
                                {isApproved && <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">DISETUJUI</div>}
                                {isRejected && <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">DITOLAK</div>}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Nama</div>
                                    <div className="text-sm font-medium">{accountRequest.nama_lengkap}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Nomor HP</div>
                                    <div className="text-sm font-medium">
                                        {accountRequest.nomor_whatsapp ? accountRequest.nomor_whatsapp.replace(/.(?=.{4})/g, '*') : '-'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Akses Dimohon</div>
                                    <div className="text-sm font-medium capitalize">{accountRequest.requested_role}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Tanggal Pengajuan</div>
                                    <div className="text-sm font-medium">
                                        {new Date(accountRequest.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-3">Timeline</div>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <CheckCircle className="w-4 h-4" /> <span>Permohonan Diterima</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <CheckCircle className="w-4 h-4" /> <span>Data Tersimpan</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${isPending ? 'text-blue-600 font-medium' : isReviewing || isApproved || isRejected ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {isReviewing || isApproved || isRejected ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            <span>Menunggu Verifikasi Admin</span>
                                        </div>
                                        {isRejected ? (
                                            <div className="flex items-center gap-2 text-rose-600 font-medium">
                                                <XCircle className="w-4 h-4" /> <span>Permohonan Ditolak</span>
                                            </div>
                                        ) : (
                                            <div className={`flex items-center gap-2 ${isApproved ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {isApproved ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                                <span>Permohonan Disetujui</span>
                                            </div>
                                        )}
                                        {!isRejected && (
                                            <div className={`flex items-center gap-2 ${isApproved && accountRequest.status === 'Aktif' /* Placeholder for future if needed */ ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {isApproved && accountRequest.status === 'Aktif' ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                                <span>Akun Diaktifkan</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isRejected && accountRequest.rejection_reason && (
                                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-800">
                                        <p>Permohonan akun Anda belum dapat disetujui. Silakan hubungi Admin untuk informasi lebih lanjut.</p>
                                        <p className="mt-2 font-medium">Alasan: {accountRequest.rejection_reason}</p>
                                    </div>
                                )}

                                {isApproved && (
                                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-800">
                                        <p>Permohonan akun Anda telah disetujui. Silakan gunakan akun yang diberikan untuk masuk ke sistem.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex flex-col gap-2">
                                {isApproved && accountRequest.activation_token && (
                                    <Link 
                                        href={`/aktivasi-akun/${accountRequest.activation_token}`}
                                        className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] bg-red-600 text-[14px] font-bold text-white shadow-sm hover:bg-red-700 transition-all"
                                    >
                                        AKTIVASI AKUN
                                    </Link>
                                )}
                                {isApproved && !accountRequest.activation_token && (
                                    <Link 
                                        href="/login"
                                        className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] bg-red-600 text-[14px] font-bold text-white shadow-sm hover:bg-red-700 transition-all"
                                    >
                                        MASUK KE TORA BELO
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3">
                <a 
                    href={contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : `mailto:${contact.email}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] border border-slate-200 bg-slate-50 text-[14px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                >
                    HUBUNGI ADMIN
                </a>
            </div>
        </>
    );
}

StatusResult.layout = {
    title: 'Hasil Permohonan',
    description: 'TORA BELO KPU KOTA PALU',
};
