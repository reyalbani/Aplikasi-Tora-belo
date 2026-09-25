import re

with open('resources/js/pages/layanan/muparpol.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Mini Cards
old_layout = content[content.find("<ServiceInfoLayout"):content.rfind("/>") + 2]

new_layout = '''<ServiceInfoLayout
                        showTabs={true}
                        aboutContent={
                            <div className="space-y-6">
                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
                                    Layanan ini merupakan sarana bagi Partai Politik untuk menyampaikan laporan pemutakhiran data dan dokumen Partai Politik secara berkelanjutan kepada KPU Kota Palu.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                                        <h4 className="font-bold text-[13px] text-neutral-800 mb-1">SASARAN LAYANAN</h4>
                                        <p className="text-[12px] text-neutral-600">Partai Politik tingkat Kota Palu.</p>
                                    </div>
                                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                                        <h4 className="font-bold text-[13px] text-neutral-800 mb-1">MEDIA LAYANAN</h4>
                                        <p className="text-[12px] text-neutral-600">SIPOL dan pelayanan langsung melalui PTSP KPU Kota Palu sesuai ketentuan.</p>
                                    </div>
                                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                                        <h4 className="font-bold text-[13px] text-neutral-800 mb-1">TUJUAN</h4>
                                        <p className="text-[12px] text-neutral-600">Menjamin data Partai Politik tetap mutakhir, akurat, dan sesuai kondisi administrasi/faktual.</p>
                                    </div>
                                </div>
                            </div>
                        }
                        miniCards={[
                            {
                                title: "Persyaratan",
                                content: "Dokumen dan data yang perlu disiapkan.",
                                icon: <FileText className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Prosedur",
                                content: "Tahapan penyampaian dan verifikasi laporan.",
                                icon: <Activity className="w-5 h-5" />,
                                colorClass: "amber"
                            },
                            {
                                title: "Waktu",
                                content: "Sesuai jadwal dan tahapan pemutakhiran.",
                                icon: <Clock className="w-5 h-5" />,
                                colorClass: "indigo"
                            },
                            {
                                title: "Biaya",
                                content: "Rp0 / GRATIS",
                                icon: <CheckCircle2 className="w-5 h-5" />,
                                colorClass: "green"
                            }
                        ]}
                        requirementsSubtitle="Laporan Pemutakhiran Data Partai Politik"
                        requirementsContent={
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                        DOKUMEN UTAMA
                                    </h3>
                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Surat pengantar/penyampaian laporan dari Pimpinan Partai Politik atau pengurus yang berwenang.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Akun/operator SIPOL yang aktif.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Data pemutakhiran yang telah diperbarui melalui SIPOL.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                        DOKUMEN PENDUKUNG
                                    </h3>
                                    <ul className="space-y-3 mt-4">
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen perubahan kepengurusan.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen perubahan keanggotaan.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen keterwakilan perempuan.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen perubahan domisili kantor tetap.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen pendukung perubahan lainnya sesuai kebutuhan.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        procedures={[
                            { title: "PENYAMPAIAN LAPORAN", desc: "Partai Politik menyampaikan laporan pemutakhiran data dan dokumen melalui SIPOL sesuai jadwal." },
                            { title: "PENERIMAAN & PEMERIKSAAN AWAL", desc: "Petugas menerima dan memeriksa kelengkapan laporan." },
                            { title: "VERIFIKASI ADMINISTRASI", desc: "KPU melakukan pencermatan terhadap kepengurusan, keanggotaan, keterwakilan perempuan, domisili kantor, dan dokumen pendukung." },
                            { title: "PERBAIKAN DATA/DOKUMEN", desc: "Apabila ditemukan kekurangan atau ketidaksesuaian, Partai Politik melakukan perbaikan sesuai ketentuan." },
                            { title: "PENETAPAN HASIL", desc: "Hasil verifikasi dituangkan dalam Berita Acara/rekapitulasi hasil pemutakhiran." },
                            { title: "PENGUMUMAN HASIL", desc: "Hasil pemutakhiran diumumkan melalui media informasi resmi KPU." },
                            { title: "PENYAMPAIAN HASIL", desc: "Hasil disampaikan kepada Bawaslu sesuai tingkatannya dan didokumentasikan." }
                        ]}
                        flowchartContent={
                            <div className="min-w-[600px] py-4 flex flex-col items-center">
                                {/* Simple text-based flowchart using flex and arrows */}
                                <div className="bg-neutral-800 text-white font-bold px-6 py-2 rounded-full text-xs">MULAI</div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">01</div>
                                    <h4 className="font-bold text-[13px] text-neutral-800 mb-1">PENYAMPAIAN LAPORAN</h4>
                                    <p className="text-[11px] text-neutral-500">Partai Politik menyampaikan laporan melalui SIPOL.</p>
                                </div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">02</div>
                                    <h4 className="font-bold text-[13px] text-neutral-800 mb-1">PENERIMAAN & PEMERIKSAAN AWAL</h4>
                                    <p className="text-[11px] text-neutral-500">Pemeriksaan kelengkapan data dan dokumen.</p>
                                </div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">03</div>
                                    <h4 className="font-bold text-[13px] text-neutral-800 mb-1">VERIFIKASI ADMINISTRASI</h4>
                                    <p className="text-[11px] text-neutral-500">Pencermatan data kepengurusan, keanggotaan, keterwakilan perempuan, domisili kantor, dan dokumen pendukung.</p>
                                </div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-amber-50 border border-amber-200 rounded-xl p-4 text-center relative shadow-sm rotate-45 transform origin-center my-4 scale-75">
                                    <div className="-rotate-45 transform origin-center">
                                        <h4 className="font-bold text-[11px] text-amber-800">DATA / DOKUMEN SESUAI?</h4>
                                    </div>
                                </div>
                                
                                {/* Branching */}
                                <div className="flex w-full max-w-lg justify-between relative mt-2">
                                    <div className="absolute top-0 left-1/2 w-1/2 h-0.5 bg-neutral-300"></div>
                                    <div className="absolute top-0 right-1/2 w-1/2 h-0.5 bg-neutral-300"></div>
                                    
                                    <div className="flex flex-col items-center w-1/2 pr-4 relative">
                                        <div className="h-6 w-0.5 bg-neutral-300 absolute right-0 top-0"></div>
                                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded mt-[-10px] mb-2 absolute right-4">TIDAK</span>
                                        <div className="mt-6 w-full bg-white border border-neutral-200 rounded-xl p-3 text-center shadow-sm">
                                            <h4 className="font-bold text-[11px] text-neutral-800 mb-1">PERBAIKAN DATA / DOKUMEN</h4>
                                        </div>
                                        <div className="text-[10px] text-neutral-400 mt-2 flex flex-col items-center">
                                            <span>kembali ke</span>
                                            <span>VERIFIKASI ADMINISTRASI</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center w-1/2 pl-4 relative">
                                        <div className="h-6 w-0.5 bg-neutral-300 absolute left-0 top-0"></div>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mt-[-10px] mb-2 absolute left-4">YA</span>
                                        <div className="mt-6 w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">04</div>
                                            <h4 className="font-bold text-[13px] text-neutral-800 mb-1">PENETAPAN HASIL</h4>
                                            <p className="text-[11px] text-neutral-500">Hasil verifikasi dan rekapitulasi.</p>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        
                                        <div className="w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">05</div>
                                            <h4 className="font-bold text-[13px] text-neutral-800 mb-1">PENGUMUMAN HASIL</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        
                                        <div className="w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-kpu-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">06</div>
                                            <h4 className="font-bold text-[13px] text-neutral-800 mb-1">PENYAMPAIAN HASIL</h4>
                                            <p className="text-[11px] text-neutral-500">Kepada Bawaslu sesuai tingkatannya.</p>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        <div className="bg-neutral-800 text-white font-bold px-6 py-2 rounded-full text-xs">SELESAI</div>
                                    </div>
                                </div>
                            </div>
                        }
                        timeContent={
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200/60">
                                    <h4 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-500" /> JANGKA WAKTU
                                    </h4>
                                    <ul className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed list-disc pl-4 space-y-2">
                                        <li><span className="font-semibold text-neutral-800">Pemeriksaan awal:</span> maksimal 1 hari kerja sejak laporan diterima lengkap.</li>
                                        <li><span className="font-semibold text-neutral-800">Verifikasi dan proses pemutakhiran:</span> mengikuti jadwal/tahapan pemutakhiran data Partai Politik yang ditetapkan KPU.</li>
                                        <li><span className="font-semibold text-neutral-800">Perbaikan:</span> sesuai batas waktu yang ditentukan.</li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200/60 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[15px] text-neutral-800 mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> BIAYA
                                    </h4>
                                    <div className="text-3xl font-black text-green-600 mb-1">Rp0,-</div>
                                    <div className="text-lg font-bold text-green-700 mb-3">GRATIS</div>
                                    <p className="text-[13px] text-neutral-500 max-w-[200px]">"Seluruh proses pelayanan tidak dipungut biaya."</p>
                                </div>
                            </div>
                        }
                        productsContent={
                            <ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Tanda Terima/Registrasi Laporan Pemutakhiran Data Partai Politik.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Hasil Verifikasi Pemutakhiran Data Partai Politik.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Berita Acara/Rekapitulasi Hasil Pemutakhiran Data Partai Politik.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Pengumuman Hasil Pemutakhiran Data Partai Politik.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Status data Partai Politik yang telah diperbarui pada SIPOL.</span>
                                </li>
                            </ul>
                        }
                        legalContent={
                            <div className="space-y-3">
                                {[
                                    "Undang-Undang Nomor 7 Tahun 2017 tentang Pemilihan Umum.",
                                    "Peraturan KPU Nomor 4 Tahun 2022 tentang Pendaftaran, Verifikasi, dan Penetapan Partai Politik Peserta Pemilu Anggota DPR dan DPRD.",
                                    "Peraturan KPU Nomor 11 Tahun 2022 tentang Perubahan atas PKPU Nomor 4 Tahun 2022.",
                                    "Keputusan KPU Nomor 1365 Tahun 2023 tentang Pedoman Teknis Pemutakhiran Data Partai Politik Secara Berkelanjutan melalui SIPOL.",
                                    "Keputusan KPU Nomor 658 Tahun 2024 tentang Perubahan atas Keputusan KPU Nomor 1365 Tahun 2023.",
                                    "Surat Ketua KPU RI Nomor 99/PL.01-SD/06/2026 tentang Mekanisme Pemutakhiran Data Partai Politik Secara Berkelanjutan melalui SIPOL Tahun 2026.",
                                    "Surat Ketua KPU RI Nomor 464/PL.01.1-SD/06/2026 tentang Pelaksanaan Pemutakhiran Data Partai Politik Secara Berkelanjutan melalui SIPOL Semester I Tahun 2026."
                                ].map((hukum, idx) => (
                                    <details key={idx} className="group bg-white border border-neutral-200 rounded-xl">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-[13px] sm:text-sm text-neutral-800 group-open:text-kpu-primary group-open:border-b group-open:border-neutral-100">
                                            {idx + 1}. {hukum.split("tentang")[0].strip() if "tentang" in hukum else hukum}
                                        </summary>
                                        <div className="p-4 text-[12px] sm:text-[13px] text-neutral-600 bg-neutral-50/50 rounded-b-xl">
                                            {hukum}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        }
                        ctaContent={
                            <div className="bg-kpu-primary text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                <h3 className="text-2xl sm:text-3xl font-black mb-3">Butuh Informasi atau Bantuan?</h3>
                                <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8">Sampaikan laporan atau konsultasikan kebutuhan pemutakhiran data Partai Politik kepada KPU Kota Palu.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="w-full sm:w-auto bg-white text-kpu-primary hover:bg-neutral-50 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-sm"
                                    >
                                        LAPORKAN PEMUTAKHIRAN DATA
                                    </button>
                                    <a 
                                        href="https://wa.me/6281234567890" 
                                        target="_blank"
                                        className="w-full sm:w-auto bg-red-800/40 hover:bg-red-800/60 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-red-400/20"
                                    >
                                        <PhoneCall className="w-4 h-4" />
                                        HUBUNGI HELP DESK
                                    </a>
                                </div>
                            </div>
                        }
                    />'''

# Need to fix python mapping syntax in legalContent map
new_layout = new_layout.replace('hukum.split("tentang")[0].strip() if "tentang" in hukum else hukum', 'hukum')

content = content.replace(old_layout, new_layout)

with open('resources/js/pages/layanan/muparpol.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated muparpol")
