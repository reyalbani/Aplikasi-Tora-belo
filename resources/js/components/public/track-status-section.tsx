import { useState } from 'react';
import { Search, ClipboardList, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TrackStatusSection() {
    const [searchMethod, setSearchMethod] = useState<'ticket' | 'phone'>('ticket');

    return (
        <section id="cek-status" className="bg-neutral-50/50 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="relative overflow-hidden rounded-[24px] bg-white border border-neutral-200/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] group hover:shadow-[0_8px_30px_-12px_rgba(239,68,68,0.1)] transition-all duration-300">
                    
                    {/* Subtle background decoration */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent to-red-50/40 pointer-events-none"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-100/40 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                        
                        {/* Left: Icon/Illustration */}
                        <div className="shrink-0 self-center lg:self-start">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-kpu-primary border border-red-100 group-hover:scale-105 transition-transform duration-300 mt-2">
                                <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Middle/Right: Text Content & Form */}
                        <div className="flex-1 w-full min-w-0 flex flex-col justify-center">
                            <div className="text-center lg:text-left mb-6">
                                <h3 className="text-[18px] sm:text-[22px] font-bold text-neutral-800 mb-1.5 sm:mb-2 tracking-tight">
                                    Lacak Pengajuan Anda
                                </h3>
                                <p className="text-[13px] sm:text-[15px] text-neutral-500 leading-relaxed max-w-md mx-auto lg:mx-0">
                                    Lacak perkembangan pengajuan Anda menggunakan Kode Tiket atau Nomor Telepon.
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex p-1 bg-neutral-100 rounded-xl mb-5 w-full sm:w-fit mx-auto lg:mx-0">
                                <button
                                    type="button"
                                    onClick={() => setSearchMethod('ticket')}
                                    className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                                        searchMethod === 'ticket' 
                                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50' 
                                        : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                                >
                                    Kode Tiket
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchMethod('phone')}
                                    className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                                        searchMethod === 'phone' 
                                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50' 
                                        : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                                >
                                    Nomor Telepon
                                </button>
                            </div>

                            {/* Input & Action */}
                            <form action="/cek-status" method="GET" className="w-full flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 sm:max-w-sm">
                                    <div className="mb-2">
                                        <label className="text-sm font-bold text-neutral-700">
                                            {searchMethod === 'ticket' ? 'Kode Tiket' : 'Nomor Telepon'}
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                                            {searchMethod === 'ticket' ? (
                                                <Search className="w-[18px] h-[18px]" />
                                            ) : (
                                                <Phone className="w-[18px] h-[18px]" />
                                            )}
                                        </div>
                                        {searchMethod === 'ticket' ? (
                                            <input 
                                                type="text" 
                                                name="tiket"
                                                required
                                                placeholder="Contoh: PID-XXXXXX" 
                                                className="w-full rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 pl-11 pr-4 py-3 text-[14px] text-neutral-800 focus:border-kpu-primary/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all h-[52px] shadow-sm uppercase placeholder:normal-case"
                                            />
                                        ) : (
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                required
                                                placeholder="Contoh: 081234567890" 
                                                className="w-full rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 pl-11 pr-4 py-3 text-[14px] text-neutral-800 focus:border-kpu-primary/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-kpu-primary/10 transition-all h-[52px] shadow-sm"
                                            />
                                        )}
                                    </div>
                                    <p className="mt-3 text-[12px] text-neutral-500 leading-relaxed font-medium">
                                        {searchMethod === 'ticket' 
                                            ? "Lupa Kode Tiket? Anda dapat menggunakan Nomor Telepon yang digunakan saat mengajukan layanan."
                                            : "Gunakan nomor telepon yang digunakan saat mengajukan layanan."
                                        }
                                    </p>
                                </div>
                                <div className="mt-7 shrink-0">
                                    <Button type="submit" className="w-full sm:w-auto rounded-[16px] bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-[0_4px_12px_-4px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_16px_-6px_rgba(239,68,68,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-200 px-8 h-[52px]">
                                        Cek Status
                                    </Button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
