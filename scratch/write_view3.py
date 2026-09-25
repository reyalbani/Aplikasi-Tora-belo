import os

def write_chunk(filename, content, mode='a'):
    with open(filename, mode, encoding='utf-8') as f:
        f.write(content)

filename = "resources/js/Pages/layanan/pengaduan-masyarakat.tsx"

chunk3 = """                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Persyaratan</h2>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-neutral-600 prose-li:marker:text-kpu-primary space-y-6">
                                        <div>
                                            <h4 className="font-bold text-neutral-800 mb-2">Persyaratan Identitas Pelapor/Pengadu</h4>
                                            <ol className="pl-4 space-y-2">
                                                <li>Fotokopi/Scan Kartu Tanda Penduduk Elektronik (KTP-el) atau Identitas Kependudukan Digital (IKD) yang sah.</li>
                                                <li>Apabila pengaduan disampaikan oleh kuasa pelapor, wajib melampirkan Surat Kuasa Khusus bermaterai cukup beserta KTP-el Penerima Kuasa.</li>
                                            </ol>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-800 mb-2">Persyaratan Materi Pengaduan</h4>
                                            <ol className="pl-4 space-y-2">
                                                <li>Mengisi Formulir Pengaduan Masyarakat.</li>
                                                <li>Uraian kronologis kejadian pengaduan memuat prinsip 4W1H (What, Who, Where, When, How) secara mendetail.</li>
                                                <li>Melampirkan bukti pendukung yang relevan seperti foto, rekaman, dokumen/surat pendukung, bukti transaksi, atau tangkapan layar.</li>
                                                <li>Pengaduan dapat disampaikan secara anonim/rahasia dengan tetap menyertakan bukti awal yang kuat.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-neutral-200/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Sistem, Mekanisme dan Prosedur</h2>
                                    </div>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                                        {procedures.map((proc, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-neutral-200 text-neutral-500 group-[.is-active]:bg-kpu-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <span className="text-[10px] font-bold">{idx + 1}</span>
                                                </div>
                                                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-neutral-200 bg-white shadow-sm">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-neutral-800 text-sm">{proc.title}</div>
                                                    </div>
                                                    <div className="text-neutral-500 text-[13px] leading-relaxed">{proc.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white rounded-[24px] p-6 sm:p-7 shadow-sm border border-neutral-200/60">
                                    <h3 className="font-bold text-neutral-800 text-base mb-5 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-orange-500" /> Waktu Penyelesaian
                                    </h3>
                                    <ul className="space-y-4 text-sm text-neutral-600">
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">1</span></div>
                                            <span>Pemberian Tanda Terima Pengaduan: paling lambat <strong className="text-neutral-800">1 hari kerja</strong>.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">2</span></div>
                                            <span>Kategori regular/layanan administrasi: maksimal <strong className="text-neutral-800">5 hari kerja</strong>.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">3</span></div>
                                            <span>Pengaduan kompleks/WBS: maksimal <strong className="text-neutral-800">14 hari kerja</strong>.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-[24px] p-6 sm:p-7 shadow-sm border border-neutral-200/60">
                                    <h3 className="font-bold text-neutral-800 text-base mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-green-500" /> Biaya / Tarif
                                    </h3>
                                    <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-center">
                                        <span className="font-extrabold text-green-700 text-lg">Tidak dipungut biaya</span>
                                        <p className="text-xs text-green-600 mt-1">Layanan ini 100% gratis</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[24px] p-6 sm:p-7 shadow-sm border border-neutral-200/60">
                                    <h3 className="font-bold text-neutral-800 text-base mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-500" /> Pengaduan Pelayanan
                                    </h3>
                                    <div className="text-sm text-neutral-600 space-y-2">
                                        <p><strong>Meja Layanan:</strong> PTSP KPU Kota Palu</p>
                                        <p><strong>Call Center:</strong> 0451-457721</p>
                                        <p><strong>Link Pengaduan:</strong> https://bit.ly/4wlmWDC</p>
                                        <p><strong>Email Resmi:</strong> hukum.kpukotapalu@gmail.com</p>
                                        <p><strong>SP4N-LAPOR!:</strong> lapor.go.id</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-[24px] p-6 sm:p-10 shadow-sm border border-neutral-200/60">
                        {serverErrors._global && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm font-medium">{serverErrors._global}</div>
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-8">
"""
write_chunk(filename, chunk3)
