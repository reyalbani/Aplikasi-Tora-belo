import re

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Persyaratan
old_req = """[
                                "Nama pelapor",
                                "NIK pelapor",
                                "Email aktif",
                                "Nomor telepon/WhatsApp",
                                "Alamat pelapor",
                                "Jenis laporan/pengaduan",
                                "Ringkasan/uraian aduan",
                                "Bukti pendukung apabila tersedia"
                            ]"""
new_req = """[
                                "Nama Pelapor",
                                "NIK Pelapor",
                                "Alamat Pelapor",
                                "Jenis Laporan",
                                "Ringkasan Aduan",
                                "Bukti Pendukung Aduan apabila tersedia"
                            ]"""
content = content.replace(old_req, new_req)

# Update Prosedur
old_proc = """procedures={[
                        { title: "Penyampaian Pengaduan", desc: "Pelapor menyampaikan pengaduan melalui formulir layanan yang tersedia." },
                        { title: "Penerimaan dan Pemeriksaan Awal", desc: "Petugas menerima dan memeriksa kelengkapan informasi pengaduan." },
                        { title: "Verifikasi dan Penanganan", desc: "Pengaduan diverifikasi dan ditindaklanjuti sesuai jenis serta kewenangan KPU Kota Palu." },
                        { title: "Tindak Lanjut dan Penyampaian Hasil", desc: "Pengaduan ditindaklanjuti dan hasil/tanggapan disampaikan sesuai ketentuan." }
                    ]}"""
new_proc = """procedures={[
                        { title: "Penyampaian Pengaduan", desc: "Pelapor mengisi dan mengirimkan formulir pengaduan." },
                        { title: "Penerimaan dan Pemeriksaan Awal", desc: "Petugas menerima dan memeriksa kelengkapan informasi pengaduan." },
                        { title: "Verifikasi dan Tindak Lanjut", desc: "Pengaduan diverifikasi dan ditindaklanjuti sesuai jenis serta kewenangan." },
                        { title: "Penyampaian Hasil", desc: "Hasil atau tanggapan pengaduan disampaikan sesuai ketentuan." }
                    ]}"""
content = content.replace(old_proc, new_proc)

# Update Alur Layanan
old_flow = """<div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">1. AJUKAN PENGADUAN</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">2. PENERIMAAN & PEMERIKSAAN</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">3. VERIFIKASI / PENANGANAN</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">4. TINDAK LANJUT</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>

                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">5. HASIL / TANGGAPAN</h4>
                            </div>"""
new_flow = """<div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">1. AJUKAN PENGADUAN</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">2. PEMERIKSAAN AWAL</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">3. VERIFIKASI</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>
                            
                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">4. TINDAK LANJUT</h4>
                            </div>
                            <div className="h-6 w-0.5 bg-neutral-300"></div>

                            <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-4 text-center relative shadow-sm">
                                <h4 className="font-bold text-[13px] text-neutral-800">5. HASIL / TANGGAPAN</h4>
                            </div>"""
content = content.replace(old_flow, new_flow)

# Update Produk Layanan
old_prod = """<ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Tanda terima/pencatatan pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Informasi status atau tindak lanjut pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Tanggapan/hasil penanganan pengaduan</span>
                            </li>
                        </ul>"""
new_prod = """<ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Penerimaan/pencatatan pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Informasi tindak lanjut pengaduan</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>Tanggapan atau hasil penanganan pengaduan</span>
                            </li>
                        </ul>"""
content = content.replace(old_prod, new_prod)

with open('resources/js/pages/layanan/pengaduan-pelayanan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
