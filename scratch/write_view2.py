import os

def write_chunk(filename, content, mode='a'):
    with open(filename, mode, encoding='utf-8') as f:
        f.write(content)

filename = "resources/js/Pages/layanan/pengaduan-masyarakat.tsx"

chunk2 = """    if (successData) {
        return (
            <div className="flex min-h-screen flex-col bg-[#f8fafc]">
                <Head title={`${layanan.nama_layanan} - SIPADU`} />
                <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-50 shadow-sm">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-9 w-auto" />
                            <span className="font-extrabold text-neutral-900 text-base sm:text-lg tracking-tight">SIPADU</span>
                            <span className="text-neutral-300 mx-1 sm:mx-2 hidden sm:inline-block">|</span>
                            <span className="text-neutral-600 font-bold text-sm hidden sm:inline-block">{layanan.nama_layanan}</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
                    <div className="bg-white rounded-[24px] p-8 md:p-14 shadow-sm border border-neutral-200/60 text-center relative overflow-hidden mt-4 animate-fade-in">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-green-50/80 to-transparent pointer-events-none"></div>
                        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3 tracking-tight">Pengaduan Berhasil Diajukan!</h2>
                        <p className="text-neutral-600 mb-8 max-w-lg mx-auto leading-relaxed">
                            Pengaduan Anda telah berhasil diterima dan sedang menunggu proses verifikasi petugas.
                        </p>
                        
                        <div className="bg-neutral-50 border border-neutral-200 rounded-[16px] p-8 max-w-md mx-auto mb-10 shadow-sm relative">
                            <p className="text-sm text-neutral-500 mb-2 font-semibold">KODE TIKET PENGADUAN ANDA</p>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <p className="text-4xl sm:text-5xl font-bold text-kpu-primary tracking-widest">{successData.kode_tiket}</p>
                            </div>
                            <p className="text-sm text-neutral-500 mt-6 font-medium px-4">Simpan kode tiket ini untuk memantau status pengaduan Anda.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="rounded-xl px-8 w-full sm:w-auto h-12 bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20">
                                <Link href={`/cek-status?tiket=${successData.kode_tiket}`}>Cek Status Pengaduan ?</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl px-8 w-full sm:w-auto h-12 text-neutral-700 font-semibold border-neutral-200">
                                <Link href="/">Kembali ke Portal Publik</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Head title={`${layanan.nama_layanan} - SIPADU`} />

            <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-9 w-auto" />
                        <span className="font-extrabold text-neutral-900 text-base sm:text-lg tracking-tight">SIPADU</span>
                        <span className="text-neutral-300 mx-1 sm:mx-2 hidden sm:inline-block">|</span>
                        <span className="text-neutral-600 font-bold text-sm hidden sm:inline-block">{layanan.nama_layanan}</span>
                    </div>
                    {showForm ? (
                        <button onClick={() => setShowForm(false)} className="inline-flex items-center text-[13px] sm:text-sm font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                            <span className="hidden sm:inline-block">Batal</span>
                        </button>
                    ) : (
                        <Link href="/" className="inline-flex items-center text-[13px] sm:text-sm font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                            <span className="hidden sm:inline-block">Kembali</span>
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                {!showForm ? (
                    <>
                        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                                    <ShieldAlert className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">{layanan.nama_layanan}</h1>
                                    <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">{layanan.deskripsi}</p>
                                </div>
                            </div>
                            <Button onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} size="lg" className="h-12 px-8 rounded-xl bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20 w-full sm:w-auto transition-all hover:-translate-y-0.5">
                                Ajukan Pengaduan
                            </Button>
                        </div>
"""
write_chunk(filename, chunk2)
