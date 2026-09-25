import re

# 1. Copy file
import shutil
shutil.copyfile('resources/js/pages/layanan/pendidikan-pemilih.tsx', 'resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx')

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Rename component and routes
content = content.replace("PendidikanPemilih", "PemutakhiranDataPemilih")
content = content.replace("pendidikan_pemilih", "pemutakhiran_data_pemilih")
content = content.replace("pendidikan-pemilih.store", "mutarlih.store")
content = content.replace("Layanan fasilitasi sosialisasi kepemiluan, narasumber, dan edukasi pemilih resmi KPU Kota Palu.", "Layanan Pemutakhiran Data Pemilih Berkelanjutan resmi KPU Kota Palu.")

# 3. Fix data state
old_data_state = '''    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama: bukuTamu?.nama || '',
        lembaga: bukuTamu?.instansi || '',
        email: bukuTamu?.email || '',
        no_hp: bukuTamu?.no_hp || '',
        tanggal_kegiatan: '',
        waktu_kegiatan: '',
        lokasi_kegiatan: '',
        jumlah_peserta: '',
        surat_permohonan: null as File | null,
        proposal: null as File | null,
    });'''

new_data_state = '''    const [data, setData] = useState({
        id_layanan: layanan.id_layanan,
        nama: bukuTamu?.nama || '',
        lembaga: bukuTamu?.instansi || '',
        email: bukuTamu?.email || '',
        no_hp: bukuTamu?.no_hp || '',
        kategori_pemohon: '',
        ktp_attachment: null as File | null,
        kk_attachment: null as File | null,
        dokumen_tambahan: null as File | null,
    });'''

content = content.replace(old_data_state, new_data_state)

# 4. Fix validation
old_validation = '''        if (!data.tanggal_kegiatan) newErrors.tanggal_kegiatan = 'Tanggal kegiatan wajib diisi';
        if (!data.lokasi_kegiatan) newErrors.lokasi_kegiatan = 'Lokasi kegiatan wajib diisi';
        
        if (!data.surat_permohonan) newErrors.surat_permohonan = 'Surat permohonan wajib diunggah';'''

new_validation = '''        if (!data.kategori_pemohon) newErrors.kategori_pemohon = 'Kategori pemohon wajib diisi';
        if (!data.ktp_attachment) newErrors.ktp_attachment = 'KTP wajib diunggah';
        if (!data.kk_attachment) newErrors.kk_attachment = 'KK wajib diunggah';'''

content = content.replace(old_validation, new_validation)

# 5. Fix form JSX block
# Replace from {/* INFORMASI LEMBAGA & KEGIATAN */} to {/* DOKUMEN PERSYARATAN */}
start_jsx = content.find("{/* INFORMASI LEMBAGA & KEGIATAN */}")
end_jsx = content.find("{/* DOKUMEN PERSYARATAN */}")

new_jsx = '''{/* INFORMASI PEMOHON */}
                                            <div className="space-y-5">
                                                <div className="bg-neutral-50/50 rounded-2xl p-4 sm:p-5 border border-neutral-100">
                                                    <h3 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                                        Informasi Pemohon
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                                Kategori Pemohon <span className="text-red-500">*</span>
                                                            </label>
                                                            <select 
                                                                value={data.kategori_pemohon}
                                                                onChange={e => updateData('kategori_pemohon', e.target.value)}
                                                                className={inputClasses(serverErrors.kategori_pemohon)}
                                                            >
                                                                <option value="" disabled>Pilih Kategori Pemohon...</option>
                                                                <option value="Masyarakat Umum">Masyarakat Umum</option>
                                                                <option value="Partai Politik">Partai Politik</option>
                                                                <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                                                                <option value="Lainnya">Lainnya</option>
                                                            </select>
                                                            {serverErrors.kategori_pemohon && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.kategori_pemohon}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            '''

if start_jsx != -1 and end_jsx != -1:
    content = content[:start_jsx] + new_jsx + content[end_jsx:]

# 6. Fix file upload JSX
start_upload = content.find("{/* DOKUMEN PERSYARATAN */}")
end_upload = content.find("{/* Persetujuan */}")

new_upload = '''{/* DOKUMEN PERSYARATAN */}
                                            <div className="space-y-5">
                                                <div className="bg-neutral-50/50 rounded-2xl p-4 sm:p-5 border border-neutral-100">
                                                    <h3 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                                        Dokumen Persyaratan
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {/* KTP */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                                Unggah KTP-el <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input 
                                                                    type="file"
                                                                    onChange={e => updateData('ktp_attachment', e.target.files?.[0] || null)}
                                                                    className={lock w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 transition-colors cursor-pointer border rounded-xl focus:outline-none focus:ring-2 focus:ring-kpu-primary/20 }
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                />
                                                            </div>
                                                            <p className="mt-1.5 text-[11px] text-neutral-500">Format: PDF/JPG/PNG. Maks: 5MB.</p>
                                                            {serverErrors.ktp_attachment && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.ktp_attachment}</p>}
                                                        </div>
                                                        {/* KK */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                                Unggah Kartu Keluarga (KK) <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input 
                                                                    type="file"
                                                                    onChange={e => updateData('kk_attachment', e.target.files?.[0] || null)}
                                                                    className={lock w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 transition-colors cursor-pointer border rounded-xl focus:outline-none focus:ring-2 focus:ring-kpu-primary/20 }
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                />
                                                            </div>
                                                            <p className="mt-1.5 text-[11px] text-neutral-500">Format: PDF/JPG/PNG. Maks: 5MB.</p>
                                                            {serverErrors.kk_attachment && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.kk_attachment}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            '''

if start_upload != -1 and end_upload != -1:
    content = content[:start_upload] + new_upload + content[end_upload:]

# 7. Replace formData setup in handleSubmit
old_formdata = '''            if (data.surat_permohonan) formData.append('surat_permohonan', data.surat_permohonan);
            if (data.proposal) formData.append('proposal', data.proposal);
            formData.append('tanggal_kegiatan', data.tanggal_kegiatan);
            formData.append('waktu_kegiatan', data.waktu_kegiatan);
            formData.append('lokasi_kegiatan', data.lokasi_kegiatan);
            formData.append('jumlah_peserta', data.jumlah_peserta);'''

new_formdata = '''            if (data.ktp_attachment) formData.append('ktp_attachment', data.ktp_attachment);
            if (data.kk_attachment) formData.append('kk_attachment', data.kk_attachment);
            formData.append('kategori_pemohon', data.kategori_pemohon);'''

content = content.replace(old_formdata, new_formdata)

# 8. Fix ServiceInfoLayout
start_layout = content.find("<ServiceInfoLayout")
# To cleanly find the end of the file/layout without Regex matching greedily...
# Actually we can just find <ServiceInfoLayout and find )} and </main> 
end_layout = content.find(")}", start_layout)

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
                                        <li>Dokumen pendukung lainnya (seperti Akta Kematian untuk pemilih meninggal dunia, dll) jika diperlukan.</li>
                                        <li>Mengisi formulir tanggapan/masukan masyarakat (Model A-Tanggapan) yang disediakan.</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        procedures={[
                            { title: "PENGAJUAN PERMOHONAN", desc: "Pemohon mengambil nomor antrian dan mengajukan permohonan/laporan beserta dokumen persyaratan." },
                            { title: "PENERIMAAN & VERIFIKASI BERKAS", desc: "Petugas menerima berkas, menunggu proses verifikasi, lalu melakukan verifikasi kelengkapan dokumen persyaratan." },
                            { title: "PENGUMPULAN & VALIDASI DATA", desc: "Tim melakukan pengumpulan data, verifikasi, dan validasi data pemilih." },
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

if start_layout != -1 and end_layout != -1:
    content = content[:start_layout] + new_layout + content[end_layout:]

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Complete overhaul.")
