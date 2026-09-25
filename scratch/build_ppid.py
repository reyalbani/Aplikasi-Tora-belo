with open('resources/js/pages/layanan/ppid.tsx.bak', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add showForm state
content = content.replace('const [step, setStep] = useState(1);', 'const [showForm, setShowForm] = useState(false);\n    const [step, setStep] = useState(1);')

# 2. Add Target icon import
content = content.replace('UploadCloud, File, AlertCircle, Copy', 'UploadCloud, File, AlertCircle, Copy, Target')

# 3. Replace the Header in the return block
old_header = '''<Link href="/" className="inline-flex items-center text-[13px] sm:text-sm font-bold text-neutral-600 hover:text-kpu-primary transition-colors bg-neutral-100 hover:bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                        <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                        <span className="hidden sm:inline-block">Kembali ke Portal Publik</span>
                        <span className="inline-block sm:hidden">Kembali</span>
                    </Link>'''
new_header = '''{showForm ? (
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
                    )}'''
content = content.replace(old_header, new_header)

# 4. wrap the main form
form_header = '''                    // FORM UI
                    <div className="space-y-6 mt-2">
                        {/* Header Info */}
                        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100">
                                    <Info className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-1 leading-tight tracking-tight">
                                        Formulir {layanan.nama_layanan}
                                    </h1>
                                    <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                        Layanan Permohonan Informasi Publik (PPID) KPU Kota Palu berdasarkan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
                                    </p>
                                </div>
                            </div>
                        </div>'''

new_form_header = '''                    // WRAPPER FOR INFO OR FORM
                    <>
                    {/* Header Info (Information View) */}
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
                                Layanan Permohonan Informasi Publik (PPID) KPU Kota Palu berdasarkan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
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
                        {/* Header Info */}
                        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 text-kpu-primary rounded-[16px] flex items-center justify-center shrink-0 border border-red-100">
                                    <Info className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-1 leading-tight tracking-tight">
                                        Formulir {layanan.nama_layanan}
                                    </h1>
                                    <p className="text-[13px] sm:text-sm text-neutral-500 leading-relaxed">
                                        Layanan Permohonan Informasi Publik (PPID) KPU Kota Palu berdasarkan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
                                    </p>
                                </div>
                            </div>
                        </div>'''

content = content.replace(form_header, new_form_header)

info_view = """
                ) : (
                    <div className="bg-white rounded-[24px] shadow-sm border border-neutral-200/60 overflow-hidden mt-6">
                        
                        {/* Persyaratan Layanan */}
                        <div className="p-6 sm:p-8 border-b border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-kpu-primary" />
                                Persyaratan Layanan
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3">Permohonan Informasi Publik</h3>
                                    <div className="space-y-4 pl-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">1</div>
                                            <div className="pt-1 sm:pt-1.5">
                                                <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed mb-2">
                                                    Pemohon Informasi wajib menyerahkan/mengunggah identitas diri yang sah.
                                                </p>
                                                <ul className="list-disc pl-5 space-y-1.5 text-[13px] sm:text-sm text-neutral-600">
                                                    <li><span className="font-semibold">Perorangan:</span> Fotokopi/Scan Kartu Tanda Penduduk Elektronik (KTP-el).</li>
                                                    <li><span className="font-semibold">Lembaga/Organisasi Masyarakat:</span> Fotokopi/Scan Akta Notaris/Pengesahan Badan Hukum dari Kemenkumham, SKT, dan KTP-el Ketua/Penanggung Jawab Lembaga.</li>
                                                    <li><span className="font-semibold">Kuasa Pemohon:</span> Surat Kuasa Bermaterai cukup disertai KTP-el Pemberi dan Penerima Kuasa.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">2</div>
                                            <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                                Mengisi Formulir Permohonan Informasi Publik, baik secara fisik di Ruang PPID maupun secara daring/online melalui portal e-PPID.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">3</div>
                                            <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                                Mencantumkan tujuan penggunaan informasi secara jelas dan rinci.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3">Pengajuan Keberatan Informasi Publik</h3>
                                    <div className="space-y-4 pl-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">1</div>
                                            <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                                Pemohon menyerahkan Formulir Keberatan Informasi yang telah diisi.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">2</div>
                                            <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed pt-1 sm:pt-1.5">
                                                Melampirkan tanda terima permohonan informasi awal dan/atau Surat Pemberitahuan Tertulis dari PPID.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sistem, Mekanisme dan Prosedur */}
                        <div className="p-6 sm:p-8 bg-neutral-50/50">
                            <h2 className="text-lg font-bold text-neutral-800 mb-8 flex items-center gap-2">
                                <Target className="w-5 h-5 text-kpu-primary" />
                                Sistem, Mekanisme dan Prosedur
                            </h2>
                            <div className="space-y-6">
                                <h3 className="font-bold text-[15px] text-neutral-800 mb-2">A. PROSEDUR PERMOHONAN INFORMASI</h3>
                                {[
                                    { title: "PENGAJUAN PERMOHONAN", desc: "Pemohon datang langsung ke KPU Kota Palu atau mengakses aplikasi e-PPID KPU Kota Palu." },
                                    { title: "PEMERIKSAAN BERKAS DAN REGISTRASI", desc: "Petugas PPID memeriksa kelengkapan syarat administratif dan mencatat permohonan serta memberikan tanda terima." },
                                    { title: "PROSES PENGOLAHAN INFORMASI", desc: "PPID melakukan pengujian konsekuensi jika diperlukan dan mengoordinasikan ketersediaan informasi dengan Subbagian teknis terkait." },
                                    { title: "PENYAMPAIAN PEMBERITAHUAN TERTULIS", desc: "PPID menerbitkan Surat Pemberitahuan Tertulis yang memuat status permohonan, format penyampaian dan rincian biaya apabila ada penggandaan." },
                                    { title: "PENYERAHAN INFORMASI", desc: "Pemohon menerima informasi publik sesuai media yang dipilih." }
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

                                <h3 className="font-bold text-[15px] text-neutral-800 mb-2 mt-8 pt-4 border-t border-neutral-200">B. PROSEDUR PENGAJUAN KEBERATAN</h3>
                                {[
                                    { title: "PENGAJUAN KEBERATAN", desc: "Pemohon menyampaikan Formulir Keberatan kepada Atasan PPID paling lambat 30 hari kerja sejak ditemukannya alasan keberatan." },
                                    { title: "TANGGAPAN ATAS KEBERATAN", desc: "Atasan PPID memberikan tanggapan atas keberatan paling lambat 30 hari kerja sejak register keberatan." }
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
                                <li><span className="font-semibold text-neutral-800">Tanggapan Atasan PPID atas Keberatan:</span> Paling lambat 30 (tiga puluh) hari kerja sejak pengajuan keberatan diregister.</li>
                                <li><span className="font-semibold text-neutral-800">Khusus Informasi Tahapan Pemilu dan Pemilihan:</span> Atasan PPID memberikan jawaban tertulis paling lambat 3 (tiga) hari kerja setelah diterimanya keberatan.</li>
                            </ul>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-[#f8fafc] border border-neutral-200/60 rounded-[16px] p-5 sm:p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-kpu-primary shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-[14px] sm:text-[15px] text-neutral-800 mb-1">Biaya / Tarif</h3>
                                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">Tidak dipungut biaya</p>
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
                                            <span className="text-sm">✉</span>
                                        </div>
                                        <p className="text-[13px] sm:text-sm font-semibold text-neutral-700">palukota.kpu@gmail.com</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#f8fafc] p-3 rounded-xl border border-neutral-100">
                                        <div className="w-8 h-8 rounded-full bg-red-50 text-kpu-primary flex items-center justify-center shrink-0">
                                            <span className="text-sm">☎</span>
                                        </div>
                                        <p className="text-[13px] sm:text-sm font-semibold text-neutral-700">(0451) 457271</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </>"""

end_marker = '''                            </form>
                        </div>
                    </div>
                )}'''
                
new_end_marker = '''                            </form>
                        </div>
                    </div>''' + info_view + '\n                )}'

content = content.replace(end_marker, new_end_marker)

with open('resources/js/pages/layanan/ppid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
