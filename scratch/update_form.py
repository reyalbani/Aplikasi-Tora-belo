import re

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the form fields.
# 1. Update the useForm hook
old_form = "const { data, setData, post, processing, errors: serverErrors, reset, clearErrors } = useForm({"
new_form = "const { data, setData, post, processing, errors: serverErrors, reset, clearErrors } = useForm({"
# Find the useForm block
start_form = content.find(old_form)
end_form = content.find("});", start_form) + 3

new_form_content = '''const { data, setData, post, processing, errors: serverErrors, reset, clearErrors } = useForm({
        id_layanan: layanan.id_layanan,
        nama_lembaga: '',
        kategori_pemohon: '',
        ktp_attachment: null as File | null,
        kk_attachment: null as File | null,
        dokumen_tambahan: null as File | null,
    });'''

content = content[:start_form] + new_form_content + content[end_form:]

# Replace form JSX
start_jsx = content.find("{/* INFORMASI LEMBAGA & KEGIATAN */}")
end_jsx = content.find("{/* DOKUMEN PERSYARATAN */}")

new_jsx = '''{/* INFORMASI PEMOHON */}
                                            <div className="space-y-5">
                                                <div className="bg-neutral-50/50 rounded-2xl p-4 sm:p-5 border border-neutral-100">
                                                    <h3 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-kpu-primary" />
                                                        Informasi Pemohon Mutarlih
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                                                                Nama Lembaga/Instansi/Perwakilan <span className="text-red-500">*</span>
                                                            </label>
                                                            <input 
                                                                type="text"
                                                                value={data.nama_lembaga}
                                                                onChange={e => updateData('nama_lembaga', e.target.value)}
                                                                className={inputClasses(serverErrors.nama_lembaga)}
                                                                placeholder="Misal: Bawaslu Kota Palu, Partai XYZ, atau Nama Anda"
                                                            />
                                                            {serverErrors.nama_lembaga && <p className="mt-1.5 text-xs text-red-500 font-medium">{serverErrors.nama_lembaga}</p>}
                                                        </div>
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
                                                                <option value="Masyarakat Umum">Masyarakat Umum / Individu</option>
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

content = content[:start_jsx] + new_jsx + content[end_jsx:]

# Fix uploads
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

content = content[:start_upload] + new_upload + content[end_upload:]

with open('resources/js/pages/layanan/pemutakhiran-data-pemilih.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated pemutakhiran-data-pemilih.tsx")
