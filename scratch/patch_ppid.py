import sys

with open('resources/js/pages/layanan/ppid.tsx', 'r') as f:
    content = f.read()

# Add showForm state
if 'const [showForm, setShowForm] = useState(false);' not in content:
    content = content.replace(
        'const [step, setStep] = useState(1);',
        'const [showForm, setShowForm] = useState(false);\n    const [step, setStep] = useState(1);'
    )

# Replace the Return statement
# Find the start of the return statement
return_start = content.find('    return (\n        <div className="flex min-h-screen')

# The original return statement goes until the end of the file.
original_return = content[return_start:]

import re

# We need to change the header button to toggle showForm
# And the main area to conditionally render the form or the info view
new_return = """    return (
        <div className="flex min-h-screen flex-col bg-[#f8fafc]">
            <Head title={`${layanan.nama_layanan} - SIPADU`} />

            {/* STANDALONE TOP BAR */}
            <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-kpu.png" alt="Logo KPU" className="h-9 w-auto" />
                        <span className="font-extrabold text-neutral-900 text-base sm:text-lg tracking-tight">SIPADU KPU KOTA PALU</span>
                        <span className="text-neutral-300 mx-1 sm:mx-2 hidden sm:inline-block">|</span>
                        <span className="text-neutral-600 font-bold text-sm hidden sm:inline-block">Layanan PPID</span>
                    </div>
                    {showForm ? (
                        <button onClick={() => setShowForm(false)} className="inline-flex items-center text-[13px] sm:text-sm font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                            <span className="hidden sm:inline-block">Batal Pengajuan</span>
                            <span className="inline-block sm:hidden">Batal</span>
                        </button>
                    ) : (
                        <Link href="/" className="inline-flex items-center text-[13px] sm:text-sm font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                            <span className="hidden sm:inline-block">Kembali ke Portal Publik</span>
                            <span className="inline-block sm:hidden">Kembali</span>
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
                
                {/* Header Info */}
                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100">
                            <Info className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-1 leading-tight tracking-tight">
                                {layanan.nama_layanan}
                            </h1>
                            <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                {layanan.deskripsi}
                            </p>
                        </div>
                    </div>
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} className="rounded-xl px-8 h-12 bg-kpu-primary hover:bg-red-700 text-white font-bold shadow-sm w-full sm:w-auto">
                            Ajukan Permohonan
                        </Button>
                    )}
                </div>

                {showForm ? (
                    <div className="space-y-6 mt-2">
                        {Object.keys(serverErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[16px] flex flex-col gap-2">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold">Pengajuan belum dapat dikirim. Periksa data berikut:</p>
                                </div>
                                <ul className="list-disc pl-9 text-sm space-y-1">
                                    {Object.entries(serverErrors).map(([key, err]) => (
                                        <li key={key}><span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {err as string}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-white rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden">
"""

# Extract the form section from original
form_start_marker = '<div className="bg-white rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden">'
form_start = original_return.find(form_start_marker)
form_end_marker = '</main>\n        </div>\n    );\n}'
form_end = original_return.find(form_end_marker)

extracted_form = original_return[form_start + len(form_start_marker):form_end]

# Info View
info_view = """
                ) : (
                    <div className="bg-white rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden">
                        {/* Persyaratan Layanan */}
                        <div className="p-6 sm:p-8 border-b border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-kpu-primary" />
                                Persyaratan Layanan
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">1</div>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                        Identitas Diri (KTP/SIM/Paspor)
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">2</div>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                        Dokumen Legalitas (Untuk Lembaga/Organisasi/Badan Hukum)
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">3</div>
                                    <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                        Surat Kuasa & Identitas Pemberi Kuasa (Jika dikuasakan)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Prosedur */}
                        <div className="p-6 sm:p-8 bg-neutral-50/50">
                            <h2 className="text-lg font-bold text-neutral-800 mb-8 flex items-center gap-2">
                                <Info className="w-5 h-5 text-kpu-primary" />
                                Sistem, Mekanisme dan Prosedur
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Pengajuan Permohonan", desc: "Pemohon mengajukan permohonan informasi publik secara langsung atau elektronik melalui SIPADU." },
                                    { title: "Penerimaan & Verifikasi Berkas", desc: "Petugas memverifikasi kelengkapan berkas dan mencatat permohonan ke dalam register." },
                                    { title: "Proses Pengolahan Informasi", desc: "PPID melakukan pengujian konsekuensi jika diperlukan dan mengoordinasikan ketersediaan informasi dengan Subbagian teknis terkait." },
                                    { title: "Penyampaian Pemberitahuan Tertulis", desc: "PPID menerbitkan Surat Pemberitahuan Tertulis yang memuat status permohonan, format penyampaian dan rincian biaya apabila ada penggandaan." },
                                    { title: "Penyerahan Informasi", desc: "Penyerahan informasi kepada pemohon beserta tanda terima." }
                                ].map((proc, idx, arr) => {
                                    const isLatest = idx === arr.length - 1;
                                    return (
                                        <div key={idx} className="relative flex items-start gap-4 sm:gap-5">
                                            {!isLatest && <div className="absolute left-3.5 sm:left-4 top-8 bottom-[-24px] w-[2px] bg-neutral-200"></div>}
                                            <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-kpu-primary text-white flex items-center justify-center font-bold text-[11px] sm:text-sm shrink-0 shadow-sm border-2 border-white ring-2 ring-red-50">
                                                {idx + 1}
                                            </div>
                                            <div className="pt-0.5 sm:pt-1 pb-2">
                                                <h4 className="font-bold text-[14px] sm:text-[15px] text-neutral-800 mb-1">{proc.title}</h4>
                                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">{proc.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <h2 className="text-lg font-bold text-neutral-800 mt-8 mb-8 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                Prosedur Pengajuan Keberatan
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Pengajuan Keberatan", desc: "Pemohon menyampaikan Formulir Keberatan kepada Atasan PPID paling lambat 30 hari kerja sejak ditemukannya alasan keberatan." },
                                    { title: "Tanggapan Atas Keberatan", desc: "Atasan PPID memberikan tanggapan atas keberatan paling lambat 30 hari kerja sejak register keberatan." }
                                ].map((proc, idx, arr) => {
                                    const isLatest = idx === arr.length - 1;
                                    return (
                                        <div key={idx} className="relative flex items-start gap-4 sm:gap-5">
                                            {!isLatest && <div className="absolute left-3.5 sm:left-4 top-8 bottom-[-24px] w-[2px] bg-neutral-200"></div>}
                                            <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] sm:text-sm shrink-0 shadow-sm border-2 border-white ring-2 ring-amber-50">
                                                {idx + 1}
                                            </div>
                                            <div className="pt-0.5 sm:pt-1 pb-2">
                                                <h4 className="font-bold text-[14px] sm:text-[15px] text-neutral-800 mb-1">{proc.title}</h4>
                                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">{proc.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Waktu & Biaya */}
                        <div className="p-6 sm:p-8 border-t border-neutral-100 bg-white">
                            <h3 className="font-bold text-[15px] text-neutral-800 mb-4">Waktu Penyelesaian</h3>
                            <ul className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed list-disc pl-4 space-y-2 mb-6">
                                <li><span className="font-semibold text-neutral-800">Penyampaian Surat Pemberitahuan Tertulis (Diterima/Ditolak):</span> Maksimal 10 (sepuluh) hari kerja sejak permohonan diregister.</li>
                                <li><span className="font-semibold text-neutral-800">Khusus untuk Informasi Tahapan Pemilu dan Pemilihan:</span> Penyampaian jawaban tertulis paling lambat 3 (tiga) hari kerja.</li>
                                <li><span className="font-semibold text-neutral-800">Perpanjangan Waktu Penyampaian Informasi:</span> Dapat diperpanjang paling lambat 7 (tujuh) hari kerja dengan memberikan pemberitahuan tertulis beserta alasannya kepada pemohon.</li>
                                <li><span className="font-semibold text-neutral-800">Khusus untuk Informasi Tahapan Pemilu dan Pemilihan:</span> Perpanjangan waktu penyampaian informasi paling lambat 2 (dua) hari kerja.</li>
                                <li><span className="font-semibold text-neutral-800">Tanggapan Atasan PPID atas Keberatan:</span> Paling lambat 30 (tiga puluh) hari kerja sejak pengajuan keberatan.</li>
                                <li><span className="font-semibold text-neutral-800">Khusus Informasi Tahapan Pemilu dan Pemilihan:</span> Atasan PPID memberikan jawaban tertulis paling lambat 3 (tiga) hari kerja setelah diterimanya keberatan.</li>
                            </ul>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-[#f8fafc] border border-neutral-200/60 rounded-[16px] p-5 sm:p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-kpu-primary shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-[14px] sm:text-[15px] text-neutral-800 mb-1">Biaya / Tarif</h3>
                                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">Tidak dipungut biaya (Gratis).</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#f8fafc] border border-neutral-200/60 rounded-[16px] p-5 sm:p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-kpu-primary shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-[14px] sm:text-[15px] text-neutral-800 mb-1">Produk Pelayanan</h3>
                                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">Pelayanan Informasi Publik (PPID)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pengaduan Pelayanan */}
                        <div className="p-6 sm:p-8 border-t border-neutral-100 bg-neutral-50/50">
                            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-kpu-primary" />
                                Pengaduan Pelayanan
                            </h2>
                            <div className="bg-white border border-neutral-200/60 rounded-[16px] p-5 sm:p-6">
                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed mb-5">
                                    Apabila Anda merasa tidak puas terhadap layanan ini, Anda dapat menyampaikan pengaduan melalui Layanan Pengaduan Masyarakat pada Portal SIPADU, atau menghubungi kontak resmi KPU Kota Palu.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-xl border border-neutral-100">
                                        <div className="w-8 h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center shrink-0">
                                            <span className="text-sm">📧</span>
                                        </div>
                                        <p className="text-[13px] sm:text-sm font-semibold text-neutral-700">palukota.kpu@gmail.com</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-xl border border-neutral-100">
                                        <div className="w-8 h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center shrink-0">
                                            <span className="text-sm">📞</span>
                                        </div>
                                        <p className="text-[13px] sm:text-sm font-semibold text-neutral-700">(0451) 457271</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-10 text-center pb-10">
                    <p className="text-xs text-neutral-400 font-medium">
                        &copy; {new Date().getFullYear()} KPU Kota Palu. Hak Cipta Dilindungi.
                    </p>
                </div>
            </main>
        </div>
    );
}
"""

final_content = content[:return_start] + new_return + extracted_form + info_view

# Remove the duplicated header info div if it was captured in extracted_form
# Actually, looking at original_return, the header info:
# <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60 mt-2">
# It's part of the original form before form_start_marker.
# But wait, original didn't have "showForm". The extracted form starts precisely at form_start_marker, which is the <div className="bg-white rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden">
# So the extracted form is just the form, exactly what we want.
# BUT wait, the SUCCESS VIEW might be at the beginning of the return statement? No, in PPID form, there is no separate success view IF block. 
# Wait, let's check ppid.tsx if there is a `if (successData)` block.

with open('resources/js/pages/layanan/ppid.tsx', 'w') as f:
    f.write(final_content)
