import re

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ServiceInfoLayout arguments
start_idx = content.find("<ServiceInfoLayout")
end_idx = content.find(")}", start_idx)

new_layout = '''<ServiceInfoLayout
                        miniCards={[
                            {
                                title: "Pemohon",
                                content: "Masyarakat Umum, Partai Politik, Instansi",
                                icon: <Users className="w-5 h-5" />,
                                colorClass: "blue"
                            },
                            {
                                title: "Waktu Penyelesaian",
                                content: <><span className="text-sm font-semibold text-neutral-900 leading-snug">Sesuai Tahapan</span><br/><span className="text-xs text-neutral-500 font-normal">Ketentuan Peraturan KPU</span></>,
                                icon: <Clock className="w-5 h-5" />,
                                colorClass: "amber"
                            },
                            {
                                title: "Biaya Layanan",
                                content: <><span className="text-lg font-black text-green-600 leading-none">GRATIS</span><br/><span className="text-xs text-neutral-500 font-normal mt-1 block">Rp 0 (Tidak dipungut biaya)</span></>,
                                icon: <CheckCircle2 className="w-5 h-5" />,
                                colorClass: "green"
                            }
                        ]}
                        requirementsSubtitle="Pemutakhiran Data Pemilih"
                        requirementsContent={
                            <div className="space-y-4">
                                <div className="bg-neutral-50/60 rounded-2xl p-5 border border-neutral-200/60">
                                    <h3 className="font-bold text-[15px] text-neutral-800 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-kpu-primary" />
                                        Persyaratan Pendaftaran/Perbaikan Data
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2 text-[13px] sm:text-sm text-neutral-600">
                                        <li>Fotokopi/Scan Kartu Tanda Penduduk Elektronik (KTP-el).</li>
                                        <li>Fotokopi/Scan Kartu Keluarga (KK).</li>
                                        <li>Dokumen pendukung lainnya (seperti Akta Kematian untuk pemilih meninggal dunia, SK Pensiun TNI/Polri, dll) jika diperlukan.</li>
                                        <li>Mengisi formulir tanggapan/masukan masyarakat (Model A-Tanggapan) yang disediakan.</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        procedures={[
                            { title: "PENGAJUAN PERMOHONAN", desc: "Pemohon mengambil nomor antrian dan mengajukan permohonan/laporan beserta dokumen persyaratan." },
                            { title: "PENERIMAAN & VERIFIKASI BERKAS", desc: "Petugas menerima berkas, menunggu proses verifikasi, lalu melakukan verifikasi kelengkapan dokumen persyaratan." },
                            { title: "PENGUMPULAN & VALIDASI DATA", desc: "Tim melakukan pengumpulan data, verifikasi, dan validasi data pemilih. Koordinasi dilakukan jika diperlukan." },
                            { title: "CEK LAPANGAN (OPSIONAL)", desc: "Melakukan verifikasi elemen data atau cek lapangan/verifikasi faktual apabila diperlukan untuk memastikan kebenaran data." },
                            { title: "PEMUTAKHIRAN & PENETAPAN", desc: "Petugas melakukan input dan pemutakhiran data ke dalam Sistem Informasi Data Pemilih (Sidalih) untuk kemudian ditetapkan." },
                            { title: "SELESAI", desc: "Penerbitan bukti pelayanan (tanda terima) diberikan kepada pemohon." }
                        ]}
                        timeContent={
                            <>
                                <ul className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed list-disc pl-4 space-y-2 mb-4">
                                    <li><span className="font-semibold text-neutral-800">Waktu Pelayanan:</span> Sesuai jam kerja (Senin - Jumat, 08:00 - 16:00 WITA).</li>
                                    <li><span className="font-semibold text-neutral-800">Jangka Waktu Penyelesaian:</span> Menyesuaikan dengan jadwal dan tahapan Pemutakhiran Data Pemilih yang diatur dalam Peraturan KPU.</li>
                                </ul>
                                <div className="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-[13px] text-blue-800 mb-2">Prinsip Pelayanan:</h4>
                                    <p className="text-[12px] sm:text-[13px] text-blue-700 leading-relaxed">Cepat, Transparan, Akuntabel, Profesional, dan Tidak diskriminatif.</p>
                                </div>
                            </>
                        }
                        productsContent={
                            <ul className="text-[13px] sm:text-sm text-neutral-600 space-y-3 mt-4">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Tanda Terima Laporan/Tanggapan Masyarakat.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Data Pemilih yang telah dimutakhirkan (terdaftar/diperbaiki/dihapus) dalam Daftar Pemilih.</span>
                                </li>
                            </ul>
                        }
                    />
'''

content = content[:start_idx] + new_layout + content[end_idx:]

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
