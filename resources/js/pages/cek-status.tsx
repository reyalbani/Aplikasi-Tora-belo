import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, ChevronLeft, Loader2, Clock, CheckCircle2, XCircle, FileText, Activity, Phone, Users } from 'lucide-react';
import { ServiceHeader } from '@/components/layanan/ServiceHeader';

interface TimelineItem {
    status: string;
    keterangan: string;
    waktu: string;
}

interface TrackingData {
    id_permohonan: number;
    kode_tiket: string;
    tanggal_pengajuan: string;
    jenis_layanan: string;
    status_saat_ini: string;
    skm_filled: boolean;
    updated_at: string;
    timeline?: TimelineItem[];
}

export default function CekStatus({ initialTiket, initialPhone }: { initialTiket: string, initialPhone?: string }) {
    const [searchMethod, setSearchMethod] = useState<'ticket' | 'phone'>('ticket');
    const [tiket, setTiket] = useState(initialTiket || '');
    const [phone, setPhone] = useState(initialPhone || '');
    const [loading, setLoading] = useState(false);
    
    // For single ticket data (ticket mode)
    const [data, setData] = useState<TrackingData | null>(null);
    // For multiple data (phone mode)
    const [results, setResults] = useState<TrackingData[]>([]);
    
    const [error, setError] = useState('');
    
    // Polling states
    const [isPolling, setIsPolling] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    
    const activeTiketRef = useRef<string | null>(null);
    const activePhoneRef = useRef<string | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchStatusByTicket = useCallback(async (kode: string, isSilent = false) => {
        if (!kode) return;
        
        if (!isSilent) {
            setLoading(true);
            setError('');
            setData(null);
            setResults([]);
        } else {
            setIsPolling(true);
        }

        try {
            const response = await fetch(`/cek-status/api/${kode}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (!mountedRef.current) return;

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                    setError('');
                    setIsReconnecting(false);
                    activeTiketRef.current = kode;
                    activePhoneRef.current = null;
                    
                    if (!isSilent) {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('tiket', kode);
                        newUrl.searchParams.delete('phone');
                        window.history.replaceState({}, '', newUrl);
                    }
                }
            } else if (response.status === 404) {
                if (!isSilent) {
                    setError('Kode tiket tidak ditemukan. Periksa kembali kode tracker yang Anda masukkan.');
                    setData(null);
                    activeTiketRef.current = null;
                }
                if (isSilent) {
                    setError('Data tiket tidak lagi ditemukan di sistem.');
                    activeTiketRef.current = null;
                }
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            if (!mountedRef.current) return;
            if (!isSilent) {
                setError('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
                setData(null);
                activeTiketRef.current = null;
            } else {
                setIsReconnecting(true);
            }
        } finally {
            if (!mountedRef.current) return;
            if (!isSilent) setLoading(false);
            setIsPolling(false);
        }
    }, []);

    const fetchStatusByPhone = useCallback(async (phoneNum: string, isSilent = false) => {
        if (!phoneNum) return;
        
        if (!isSilent) {
            setLoading(true);
            setError('');
            setData(null);
            setResults([]);
        } else {
            setIsPolling(true);
        }

        try {
            const formData = new FormData();
            formData.append('phone', phoneNum);
            
            const response = await fetch(`/cek-status/api/phone`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: formData
            });

            if (!mountedRef.current) return;

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setResults(result.data);
                    setError('');
                    setIsReconnecting(false);
                    activePhoneRef.current = phoneNum;
                    activeTiketRef.current = null;
                    
                    if (!isSilent) {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('phone', phoneNum);
                        newUrl.searchParams.delete('tiket');
                        window.history.replaceState({}, '', newUrl);
                    }
                }
            } else if (response.status === 404 || response.status === 400) {
                const result = await response.json();
                if (!isSilent) {
                    setError(result.message || 'Pengajuan dengan nomor telepon tersebut tidak ditemukan.');
                    setResults([]);
                    activePhoneRef.current = null;
                }
                if (isSilent) {
                    setError(result.message || 'Pengajuan dengan nomor telepon tersebut tidak ditemukan.');
                    activePhoneRef.current = null;
                }
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            if (!mountedRef.current) return;
            if (!isSilent) {
                setError('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
                setResults([]);
                activePhoneRef.current = null;
            } else {
                setIsReconnecting(true);
            }
        } finally {
            if (!mountedRef.current) return;
            if (!isSilent) setLoading(false);
            setIsPolling(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchMethod === 'ticket') {
            if (!tiket.trim()) {
                setError('Silakan masukkan kode tiket.');
                return;
            }
            fetchStatusByTicket(tiket, false);
        } else {
            if (!phone.trim()) {
                setError('Silakan masukkan nomor telepon.');
                return;
            }
            fetchStatusByPhone(phone, false);
        }
    };

    // Auto-fetch if initial tiket or phone is present
    useEffect(() => {
        if (initialTiket && !data && !error && !loading) {
            setSearchMethod('ticket');
            fetchStatusByTicket(initialTiket, false);
        } else if (initialPhone && !results.length && !error && !loading) {
            setSearchMethod('phone');
            fetchStatusByPhone(initialPhone, false);
        }
    }, [initialTiket, initialPhone, fetchStatusByTicket, fetchStatusByPhone]);

    // Polling effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (activeTiketRef.current) {
            intervalId = setInterval(() => {
                fetchStatusByTicket(activeTiketRef.current!, true);
            }, 3000);
        } else if (activePhoneRef.current) {
            intervalId = setInterval(() => {
                fetchStatusByPhone(activePhoneRef.current!, true);
            }, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [data, results, searchMethod, fetchStatusByTicket, fetchStatusByPhone]);

    const formatDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).format(date).replace(/\./g, ':');
        } catch (e) {
            return isoString;
        }
    };

    const formatDateShort = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);
        } catch (e) {
            return isoString;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diajukan':
            case 'pengajuan permohonan': return <FileText className="w-5 h-5" />;
            case 'pengajuan keberatan': return <FileText className="w-5 h-5" />;
            case 'verifikasi':
            case 'penerimaan & verifikasi berkas':
            case 'pemeriksaan berkas & registrasi': return <Clock className="w-5 h-5" />;
            case 'diproses':
            case 'disposisi pimpinan':
            case 'kajian & koordinasi teknis':
            case 'proses pengolahan informasi': return <Activity className="w-5 h-5" />;
            case 'konfirmasi & persetujuan':
            case 'tanggapan atasan ppid':
            case 'penyampaian pemberitahuan tertulis': return <FileText className="w-5 h-5" />;
            case 'pelaksanaan kegiatan': return <Users className="w-5 h-5" />;
            case 'evaluasi & dokumentasi': return <FileText className="w-5 h-5" />;
            case 'selesai':
            case 'penyerahan informasi': return <CheckCircle2 className="w-5 h-5" />;
            case 'ditolak': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diajukan':
            case 'pengajuan permohonan': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'pengajuan keberatan': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'verifikasi':
            case 'penerimaan & verifikasi berkas':
            case 'pemeriksaan berkas & registrasi': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'diproses':
            case 'disposisi pimpinan':
            case 'kajian & koordinasi teknis':
            case 'proses pengolahan informasi': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
            case 'konfirmasi & persetujuan':
            case 'tanggapan atasan ppid':
            case 'penyampaian pemberitahuan tertulis': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'pelaksanaan kegiatan': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'evaluasi & dokumentasi': return 'bg-teal-50 text-teal-600 border-teal-200';
            case 'selesai':
            case 'penyerahan informasi': return 'bg-green-50 text-green-600 border-green-200';
            case 'ditolak': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
        }
    };
    
    const getStatusBgColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diajukan':
            case 'pengajuan permohonan': return 'bg-blue-600';
            case 'pengajuan keberatan': return 'bg-amber-600';
            case 'verifikasi':
            case 'penerimaan & verifikasi berkas':
            case 'pemeriksaan berkas & registrasi': return 'bg-amber-500';
            case 'diproses':
            case 'disposisi pimpinan':
            case 'kajian & koordinasi teknis':
            case 'proses pengolahan informasi': return 'bg-indigo-600';
            case 'konfirmasi & persetujuan':
            case 'tanggapan atasan ppid':
            case 'penyampaian pemberitahuan tertulis': return 'bg-purple-600';
            case 'pelaksanaan kegiatan': return 'bg-blue-600';
            case 'evaluasi & dokumentasi': return 'bg-teal-600';
            case 'selesai':
            case 'penyerahan informasi': return 'bg-green-600';
            case 'ditolak': return 'bg-red-600';
            default: return 'bg-neutral-600';
        }
    };

    // Build timeline chronological
    const renderTimeline = (trackingData: TrackingData) => {
        if (!trackingData.timeline) return null;
        
        const history = [...trackingData.timeline].reverse();
        
        let standardSteps = ['Diajukan', 'Verifikasi', 'Diproses', 'Selesai'];
        
        if (trackingData.jenis_layanan.toLowerCase().includes('ppid')) {
            const isKeberatan = trackingData.kode_tiket.startsWith('KBT') || trackingData.status_saat_ini.toLowerCase().includes('keberatan') || history.some(h => h.status.toLowerCase().includes('keberatan'));
            if (isKeberatan) {
                standardSteps = [
                    'Pengajuan Keberatan',
                    'Pemeriksaan Berkas & Registrasi',
                    'Proses Pengolahan Informasi',
                    'Tanggapan Atasan PPID',
                    'Selesai'
                ];
            } else {
                standardSteps = [
                    'Pengajuan Permohonan',
                    'Pemeriksaan Berkas & Registrasi',
                    'Proses Pengolahan Informasi',
                    'Penyampaian Pemberitahuan Tertulis',
                    'Penyerahan Informasi'
                ];
            }
            if (trackingData.status_saat_ini === 'Ditolak' || trackingData.status_saat_ini === 'Dibatalkan') {
                standardSteps[4] = trackingData.status_saat_ini;
            }
        } else if (trackingData.jenis_layanan.toLowerCase().includes('pendidikan pemilih')) {
            standardSteps = [
                'Pengajuan Permohonan',
                'Penerimaan & Verifikasi Berkas',
                'Disposisi Pimpinan',
                'Kajian & Koordinasi Teknis',
                'Konfirmasi & Persetujuan',
                'Pelaksanaan Kegiatan',
                'Evaluasi & Dokumentasi',
                'Selesai'
            ];
            if (trackingData.status_saat_ini === 'Ditolak' || trackingData.status_saat_ini === 'Dibatalkan') {
                standardSteps[7] = trackingData.status_saat_ini;
            }
        } else {
            if (trackingData.status_saat_ini === 'Ditolak' || trackingData.status_saat_ini === 'Dibatalkan') {
                standardSteps[3] = trackingData.status_saat_ini;
            }
        }

        const renderedSteps: { status: string; isPast: boolean; data?: TimelineItem }[] = [];
        
        for (const step of standardSteps) {
            const histItem = history.find(h => h.status === step);
            if (histItem) {
                renderedSteps.push({ status: step, isPast: true, data: histItem });
            } else {
                renderedSteps.push({ status: step, isPast: false });
            }
        }
        
        const matchedStatuses = renderedSteps.filter(r => r.isPast).map(r => r.status);
        const unmatchedHistory = history.filter(h => !matchedStatuses.includes(h.status));
        
        if (unmatchedHistory.length > 0) {
            return (
                <div className="space-y-8">
                    {history.map((item, index) => {
                        const isLatest = index === history.length - 1;
                        return (
                            <div key={index} className="relative flex items-start gap-5">
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm dark:shadow-none text-white ${getStatusBgColor(item.status)}`}>
                                    {getStatusIcon(item.status)}
                                </div>
                                <div className="pt-1.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                        <h4 className={`font-bold text-base ${isLatest ? 'text-neutral-900' : 'text-neutral-700'}`}>{item.status}</h4>
                                    </div>
                                    <span className="inline-block text-xs font-medium text-neutral-500 bg-card px-2 py-0.5 rounded-md border border-neutral-200 mb-2">{formatDate(item.waktu)}</span>
                                    <p className={`text-sm text-neutral-600 leading-relaxed`}>{item.keterangan}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="space-y-8 relative">
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-neutral-200 -z-0"></div>

                {renderedSteps.map((step, index) => {
                    const isLatest = step.isPast && (index === renderedSteps.length - 1 || !renderedSteps[index + 1]?.isPast);
                    
                    if (step.isPast && step.data) {
                        return (
                            <div key={index} className="relative flex items-start gap-5 z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm dark:shadow-none text-white ${getStatusBgColor(step.status)}`}>
                                    {getStatusIcon(step.status)}
                                </div>
                                <div className="pt-1.5 bg-neutral-50/80 rounded-xl p-4 flex-1 border border-neutral-100 shadow-sm dark:shadow-none">
                                    <h4 className="font-bold text-base text-neutral-900 mb-1">{step.status}</h4>
                                    <div className="text-xs font-medium text-neutral-500 mb-2">
                                        {formatDate(step.data.waktu)}
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{step.data.keterangan}</p>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="relative flex items-start gap-5 z-10 opacity-50">
                                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 border-4 border-white shadow-sm dark:shadow-none text-neutral-400">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-400"></div>
                                </div>
                                <div className="pt-2">
                                    <h4 className="font-semibold text-base text-neutral-500">{step.status}</h4>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans selection:bg-kpu-primary selection:text-white flex flex-col">
            <Head title="Cek Status Pengajuan - TORA BELO KPU" />
            
            <ServiceHeader title="Cek Status Pengajuan" backUrl="/" />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
                
                {/* Search Card */}
                <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 p-6 sm:p-10 mb-8">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-3">
                            Cek Status Pengajuan
                        </h1>
                        <p className="text-neutral-500 text-[15px] max-w-xl leading-relaxed mb-6 sm:mx-0 mx-auto">
                            Lacak pengajuan Anda menggunakan Kode Tiket atau Nomor Telepon.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-neutral-100 rounded-xl mb-6 w-full sm:w-fit mx-auto sm:mx-0">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('ticket');
                                setError('');
                                setData(null);
                                setResults([]);
                            }}
                            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                searchMethod === 'ticket' 
                                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50' 
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            Kode Tiket
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('phone');
                                setError('');
                                setData(null);
                                setResults([]);
                            }}
                            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                searchMethod === 'phone' 
                                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50' 
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                        >
                            Nomor Telepon
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            {searchMethod === 'ticket' ? (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                                        <Search className="w-[18px] h-[18px]" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={tiket}
                                        onChange={(e) => setTiket(e.target.value.toUpperCase())}
                                        placeholder="Contoh: PID-XXXXXX" 
                                        className="w-full rounded-[16px] border border-neutral-200/80 bg-neutral-50 pl-11 pr-4 py-3.5 text-[15px] font-semibold text-neutral-900 focus:border-kpu-primary/50 focus:bg-card focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all h-[52px] shadow-sm dark:shadow-none uppercase placeholder:font-normal placeholder:text-neutral-400"
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                                        <Phone className="w-[18px] h-[18px]" />
                                    </div>
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Masukkan nomor telepon (Contoh: 081234567890)" 
                                        className="w-full rounded-[16px] border border-neutral-200/80 bg-neutral-50 pl-11 pr-4 py-3.5 text-[15px] font-semibold text-neutral-900 focus:border-kpu-primary/50 focus:bg-card focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all h-[52px] shadow-sm dark:shadow-none placeholder:font-normal placeholder:text-neutral-400"
                                    />
                                </>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading || (searchMethod === 'ticket' ? !tiket.trim() : !phone.trim())}
                            className="w-full sm:w-auto rounded-[16px] bg-kpu-primary hover:bg-red-700 text-white font-bold transition-all duration-200 px-8 h-[52px]"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mencari...</>
                            ) : (
                                'Lacak'
                            )}
                        </Button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-card border border-red-100 shadow-sm dark:shadow-none rounded-[24px] p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                            {searchMethod === 'ticket' ? 'Kode tiket tidak ditemukan' : 'Pengajuan tidak ditemukan'}
                        </h3>
                        <p className="text-neutral-500 text-[15px]">{error}</p>
                    </div>
                )}

                {/* Ticket Mode Result State */}
                {searchMethod === 'ticket' && data && (
                    <div className="bg-card rounded-[24px] shadow-sm dark:shadow-none border border-neutral-200/60 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">
                        
                        <div className="p-6 sm:p-10 border-b border-neutral-100 relative">
                            {/* Live Update Badge */}
                            <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 shadow-sm dark:shadow-none">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live Update
                            </div>

                            <p className="text-sm text-neutral-500 font-medium mb-1">Kode Tiket</p>
                            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-6">{data.kode_tiket}</h2>
                            
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                                <div>
                                    <p className="text-xs text-neutral-500 font-medium mb-1 uppercase tracking-wider">Jenis Layanan</p>
                                    <p className="font-bold text-neutral-800 text-sm">{data.jenis_layanan}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 font-medium mb-1 uppercase tracking-wider">Tanggal Pengajuan</p>
                                    <p className="font-bold text-neutral-800 text-sm">{formatDate(data.tanggal_pengajuan)}</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <p className="text-sm font-semibold text-neutral-600">Status Saat Ini:</p>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm shadow-sm dark:shadow-none ${getStatusColor(data.status_saat_ini)}`}>
                                    {getStatusIcon(data.status_saat_ini)}
                                    {data.status_saat_ini}
                                </div>
                            </div>
                            
                            {data.jenis_layanan.toLowerCase().includes('ppid') && (
                                <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-blue-900 mb-1">Estimasi Waktu Penyelesaian</p>
                                            <p className="text-blue-800/80 leading-relaxed">Pemberitahuan tertulis disampaikan maks. 10 Hari Kerja. Untuk informasi tahapan pemilu, maks. 3 Hari Kerja.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 pt-3 border-t border-blue-100/50">
                                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-blue-900 mb-1">Biaya / Tarif Layanan</p>
                                            <p className="text-blue-800/80 leading-relaxed">Tidak dipungut biaya (Gratis).</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SKM Section */}
                            {(data.status_saat_ini.toLowerCase() === 'selesai' || data.status_saat_ini.toLowerCase() === 'penyerahan informasi') && (
                                <div className="mt-8 p-6 bg-green-50/50 border border-green-200 rounded-2xl text-center">
                                    {data.skm_filled ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                            <h4 className="text-lg font-bold text-green-900 mb-1">Terima Kasih!</h4>
                                            <p className="text-sm text-green-800/80">Anda telah mengisi Survei Kepuasan Masyarakat (SKM) untuk tiket ini.</p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-lg font-bold text-neutral-900 mb-2">Layanan Telah Selesai</h4>
                                            <p className="text-sm text-neutral-600 mb-4">Bantu kami meningkatkan kualitas layanan dengan mengisi Survei Kepuasan Masyarakat (SKM).</p>
                                            <Link 
                                                href={`/skm/${data.kode_tiket}`}
                                                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                                            >
                                                Isi Survei Kepuasan
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 sm:p-10 bg-neutral-50/30 flex-1">
                            <h3 className="text-lg font-extrabold text-neutral-900 mb-8">Timeline Status</h3>
                            {renderTimeline(data)}
                        </div>
                        
                        <div className="bg-card border-t border-neutral-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center text-xs font-medium text-neutral-500">
                                <Activity className="w-4 h-4 mr-1.5" />
                                Halaman ini diperbarui otomatis ketika ada perubahan status.
                            </div>
                            <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                                {isReconnecting && (
                                    <span className="text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Koneksi sedang diperiksa...
                                    </span>
                                )}
                                {isPolling && !isReconnecting && (
                                    <span className="text-blue-600 flex items-center">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Memperbarui...
                                    </span>
                                )}
                                <span>Terakhir diperbarui: {formatDate(data.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Phone Mode Result State */}
                {searchMethod === 'phone' && results.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Pengajuan Ditemukan</h2>
                            <span className="bg-kpu-primary/10 text-kpu-primary px-3 py-1 rounded-full text-sm font-bold">
                                {results.length} Pengajuan
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <div key={result.id_permohonan} className="bg-white rounded-[20px] p-6 border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow relative">
                                    {results.length > 1 && (
                                        <div className="absolute top-0 right-0 bg-neutral-100 text-neutral-500 text-xs font-bold px-4 py-1.5 rounded-bl-[20px] rounded-tr-[20px]">
                                            Pengajuan {index + 1}
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[11px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Kode Tiket</p>
                                                <p className="font-extrabold text-xl text-neutral-900">{result.kode_tiket}</p>
                                            </div>
                                            <div className="flex gap-8">
                                                <div>
                                                    <p className="text-[11px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Layanan</p>
                                                    <p className="font-bold text-neutral-800 text-sm">{result.jenis_layanan}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Tanggal</p>
                                                    <p className="font-bold text-neutral-800 text-sm">{formatDateShort(result.tanggal_pengajuan)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between sm:items-end space-y-5 sm:space-y-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-neutral-100">
                                            <div>
                                                <p className="text-[11px] text-neutral-500 font-bold mb-1 sm:text-right uppercase tracking-wider">Status Saat Ini</p>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-sm dark:shadow-none ${getStatusColor(result.status_saat_ini)}`}>
                                                    {getStatusIcon(result.status_saat_ini)}
                                                    {result.status_saat_ini}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setSearchMethod('ticket');
                                                    setTiket(result.kode_tiket);
                                                    fetchStatusByTicket(result.kode_tiket, false);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="inline-flex items-center justify-center text-sm font-bold bg-kpu-primary/10 text-kpu-primary hover:bg-kpu-primary hover:text-white px-4 py-2 rounded-xl transition-colors w-full sm:w-auto"
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 bg-card border border-neutral-100 px-6 py-4 rounded-[20px] flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                                {isReconnecting && (
                                    <span className="text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Koneksi sedang diperiksa...
                                    </span>
                                )}
                                {isPolling && !isReconnecting && (
                                    <span className="text-blue-600 flex items-center">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Memperbarui...
                                    </span>
                                )}
                                {results[0] && <span>Terakhir diperbarui: {formatDate(results[0].updated_at)}</span>}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
