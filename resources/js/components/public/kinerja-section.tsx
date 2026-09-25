import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader2 } from 'lucide-react';

interface KinerjaService {
    id_layanan: number;
    service_name: string;
    total: number;
}

interface KinerjaResponse {
    total_verified: number;
    period: string;
    services: KinerjaService[];
}

export function KinerjaSection() {
    const [period, setPeriod] = useState<'1_week' | '1_month' | '1_year'>('1_week');
    const [data, setData] = useState<KinerjaResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetch(`/api/kinerja?period=${period}`)
            .then(res => res.json())
            .then(res => {
                if (mounted && res.success) {
                    setData(res.data);
                }
            })
            .catch(err => console.error("Failed to fetch kinerja", err))
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [period]);

    return (
        <section className="py-12 sm:py-16 bg-neutral-50 border-t border-neutral-100" id="kinerja-layanan">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-red-50 text-kpu-primary rounded-2xl mb-4">
                        <BarChart3 className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-[24px] sm:text-[32px] font-extrabold text-neutral-900 tracking-tight mb-3">
                        Kinerja Layanan
                    </h2>
                    <p className="text-[14px] sm:text-[16px] text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                        Lihat perkembangan pelayanan berdasarkan pengajuan yang telah diverifikasi.
                    </p>
                </div>

                {/* Filter */}
                <div className="flex justify-center mb-8">
                    <div className="flex p-1 bg-neutral-100/80 rounded-xl w-full sm:w-auto border border-neutral-200/50">
                        <button
                            onClick={() => setPeriod('1_week')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                period === '1_week'
                                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            1 Minggu
                        </button>
                        <button
                            onClick={() => setPeriod('1_month')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                period === '1_month'
                                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            1 Bulan
                        </button>
                        <button
                            onClick={() => setPeriod('1_year')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                period === '1_year'
                                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            1 Tahun
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-kpu-primary animate-spin" />
                    </div>
                ) : !data ? (
                    <div className="text-center py-12 text-neutral-500">Gagal memuat data.</div>
                ) : (
                    <div className="space-y-6">
                        {/* Total Verified Card */}
                        <div className="bg-white rounded-[24px] border border-neutral-200/60 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-red-50/30 pointer-events-none"></div>
                            
                            <h3 className="text-lg font-bold text-neutral-700 mb-2 relative z-10">Total Pengajuan Terverifikasi</h3>
                            <div className="flex items-center justify-center gap-3 relative z-10 mt-2">
                                <span className="text-5xl sm:text-7xl font-black text-neutral-900 tracking-tight">
                                    {data.total_verified}
                                </span>
                            </div>
                            <div className="mt-5 inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm relative z-10">
                                <TrendingUp className="w-4 h-4 mr-1.5" />
                                Dalam {period === '1_week' ? '1 Minggu' : period === '1_month' ? '1 Bulan' : '1 Tahun'} Terakhir
                            </div>
                        </div>

                        {/* Per Service List */}
                        <div className="bg-white rounded-[24px] border border-neutral-200/60 shadow-sm p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-neutral-400" />
                                Kinerja Berdasarkan Layanan
                            </h3>
                            
                            {data.total_verified === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                                        <TrendingUp className="w-8 h-8 text-neutral-300" />
                                    </div>
                                    <p className="text-neutral-500 font-medium">Belum ada pengajuan yang terverifikasi pada periode ini.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.services.map((service) => (
                                        <div key={service.id_layanan} className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-neutral-100/80 transition-colors">
                                            <span className="text-[14px] font-bold text-neutral-700 leading-tight pr-4">
                                                {service.service_name}
                                            </span>
                                            <span className="text-xl font-black text-kpu-primary shrink-0">
                                                {service.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
