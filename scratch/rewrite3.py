import re

with open('resources/js/pages/layanan/muparpol.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("<ServiceInfoLayout")
div_mt10 = content.find('<div className="mt-10')
end_idx = content.rfind(")}", 0, div_mt10)

new_layout = '''<ServiceInfoLayout
                        showTabs={true}
                        aboutContent={
                            <div className="space-y-4">
                                <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
                                    Layanan ini digunakan untuk menerima dan menindaklanjuti laporan terkait pemutakhiran data Partai Politik pada tingkat Kota Palu sesuai ketentuan peraturan perundang-undangan dan mekanisme yang ditetapkan oleh KPU.
                                </p>
                                <div className="bg-neutral-50/80 p-4 rounded-xl border border-neutral-200/60 mt-4">
                                    <h4 className="font-bold text-[13px] text-neutral-800 mb-2">Laporan dapat berkaitan dengan:</h4>
                                    <ul className="list-disc pl-4 space-y-1 text-[12px] sm:text-[13px] text-neutral-600">
                                        <li>Perubahan data kepengurusan;</li>
                                        <li>Perubahan data keanggotaan;</li>
                                        <li>Perubahan domisili/kantor;</li>
                                        <li>Perubahan atau ketidaksesuaian data Partai Politik;</li>
                                        <li>Laporan lainnya yang berkaitan dengan pemutakhiran data Partai Politik.</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        miniCards={[
                            {
                                title: "Persyaratan",
                                content: "Dokumen dan data pelaporan",
                                icon: <FileText className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Prosedur",
                                content: "7 Tahapan penyelesaian",
                                icon: <Activity className="w-5 h-5" />,
                                colorClass: "amber"
                            },
                            {
                                title: "Waktu",
                                content: "1 hari (Pemeriksaan awal)",
                                icon: <Clock className="w-5 h-5" />,
                                colorClass: "indigo"
                            },
                            {
                                title: "Biaya",
                                content: "Rp 0,- (GRATIS)",
                                icon: <CheckCircle2 className="w-5 h-5" />,
                                colorClass: "green"
                            }
                        ]}
                        requirementsSubtitle="Laporan Pemutakhiran Data Partai Politik"
                        requirementsContent={
                            <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60 max-w-3xl">
                                <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-kpu-primary" />
                                    Persyaratan Laporan
                                </h3>
                                <ul className="space-y-3 mt-4 mb-4">
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">1</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Surat pengantar/permohonan resmi dari pimpinan partai politik tingkat Kota Palu.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">2</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Identitas pimpinan/operator partai politik.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">3</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Surat penunjukan operator SIPOL.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">4</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">KTP operator/pengurus yang berkaitan.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">5</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen/data pendukung sesuai jenis perubahan atau pemutakhiran.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">6</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Data kepengurusan, keanggotaan, dan/atau domisili yang akan diperbarui.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">7</div>
                                        <span className="text-[13px] sm:text-sm text-neutral-600">Dokumen pendukung perubahan apabila diperlukan.</span>
                                    </li>
                                </ul>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-[12px] text-blue-700 italic">Catatan: Dokumen pendukung disesuaikan dengan jenis laporan dan perubahan data yang disampaikan.</p>
                                </div>
                            </div>
                        }
                        procedures={[
                            { title: "Pengajuan Laporan", desc: "Pimpinan/operator partai politik menyampaikan laporan pemutakhiran data melalui kanal pelayanan yang tersedia." },
                            { title: "Penerimaan & Verifikasi Awal", desc: "Petugas menerima dokumen dan memeriksa kelengkapan administrasi." },
                            { title: "Disposisi / Penugasan", desc: "Laporan diteruskan kepada pejabat/petugas terkait untuk proses pemeriksaan." },
                            { title: "Verifikasi Administrasi", desc: "Pemeriksaan kesesuaian dokumen, data kepengurusan, keanggotaan, domisili, dan dokumen pendukung." },
                            { title: "Verifikasi Faktual", desc: "Dilakukan apabila diperlukan sesuai jenis laporan/perubahan." },
                            { title: "Input / Update Data", desc: "Data yang telah memenuhi ketentuan diperbarui pada SIPOL." },
                            { title: "Penerbitan Bukti Pelayanan", desc: "Petugas memberikan tanda terima/bukti hasil pelayanan kepada pelapor." }
                        ]}
                        flowchartContent={
                            <div className="min-w-[700px] py-4 flex flex-col items-center">
                                <div className="bg-neutral-800 text-white font-bold px-6 py-2 rounded-full text-xs shadow-sm">MULAI</div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                    <h4 className="font-bold text-[13px] text-neutral-800">Pengajuan Laporan</h4>
                                </div>
                                <div className="h-6 w-0.5 bg-neutral-300"></div>
                                
                                <div className="w-full max-w-sm bg-amber-50 border border-amber-200 rounded-xl p-4 text-center relative shadow-sm rotate-45 transform origin-center my-6 scale-75 flex items-center justify-center">
                                    <div className="-rotate-45 transform origin-center w-32">
                                        <h4 className="font-bold text-[11px] text-amber-800 text-center leading-tight">Penerimaan & Verifikasi Berkas</h4>
                                    </div>
                                </div>
                                
                                {/* Branching */}
                                <div className="flex w-full max-w-lg justify-between relative mt-[-10px] mb-6">
                                    <div className="absolute top-0 left-1/2 w-1/2 h-0.5 bg-neutral-300"></div>
                                    <div className="absolute top-0 right-1/2 w-1/2 h-0.5 bg-neutral-300"></div>
                                    
                                    <div className="flex flex-col items-center w-1/2 pr-4 relative">
                                        <div className="h-6 w-0.5 bg-neutral-300 absolute right-0 top-0"></div>
                                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded mt-[-10px] mb-2 absolute right-4">TIDAK LENGKAP</span>
                                        <div className="mt-6 w-full bg-white border border-neutral-200 rounded-xl p-3 text-center shadow-sm">
                                            <h4 className="font-bold text-[11px] text-neutral-800 mb-1">Berkas dikembalikan untuk dilengkapi</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        <div className="bg-neutral-800 text-white font-bold px-6 py-2 rounded-full text-xs shadow-sm">Selesai</div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center w-1/2 pl-4 relative">
                                        <div className="h-6 w-0.5 bg-neutral-300 absolute left-0 top-0"></div>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mt-[-10px] mb-2 absolute left-4">YA</span>
                                        <div className="mt-6 w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <h4 className="font-bold text-[13px] text-neutral-800">Verifikasi Administrasi</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        
                                        <div className="w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <h4 className="font-bold text-[13px] text-neutral-800">Verifikasi Faktual (Jika Diperlukan)</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        
                                        <div className="w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <h4 className="font-bold text-[13px] text-neutral-800">Input / Update Data SIPOL</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        
                                        <div className="w-full max-w-[200px] bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                            <h4 className="font-bold text-[13px] text-neutral-800">Penerbitan Bukti Pelayanan</h4>
                                        </div>
                                        <div className="h-6 w-0.5 bg-neutral-300"></div>
                                        <div className="bg-neutral-800 text-white font-bold px-6 py-2 rounded-full text-xs shadow-sm">SELESAI</div>
                                    </div>
                                </div>
                            </div>
                        }
                        timeContent={
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200/60">
                                    <h4 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-500" /> Jangka Waktu
                                    </h4>
                                    <ul className="list-disc pl-4 space-y-2 text-[13px] sm:text-sm text-neutral-700 leading-relaxed font-semibold">
                                        <li>Penerimaan dan verifikasi awal administrasi: maksimal 1 hari kerja.</li>
                                        <li>Penelitian dokumen dan proses pemutakhiran/input data: menyesuaikan kelengkapan dokumen dan tahapan pemutakhiran melalui SIPOL.</li>
                                    </ul>
                                </div>
                                <div className="bg-neutral-50/60 p-5 rounded-2xl border border-neutral-200/60 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[15px] text-neutral-800 mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Biaya/Tarif
                                    </h4>
                                    <div className="text-3xl font-black text-green-600 mb-1">Rp 0,-</div>
                                    <div className="text-lg font-bold text-green-700 mb-3">(GRATIS)</div>
                                    <p className="text-[13px] text-neutral-500 max-w-[200px]">Seluruh proses pelayanan tidak dipungut biaya.</p>
                                </div>
                            </div>
                        }
                        productsContent={
                            <ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Tanda Terima Laporan/Pemutakhiran Data Partai Politik.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Bukti/Surat Keterangan Hasil Verifikasi apabila diperlukan.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Status pemutakhiran data pada SIPOL sesuai hasil proses pelayanan.</span>
                                </li>
                            </ul>
                        }
                    />'''

content = content[:start_idx] + new_layout + content[end_idx:]

with open('resources/js/pages/layanan/muparpol.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
