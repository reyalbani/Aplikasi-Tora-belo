import os

def write_chunk(filename, content, mode='a'):
    with open(filename, mode, encoding='utf-8') as f:
        f.write(content)

filename = "resources/js/Pages/layanan/pengaduan-masyarakat.tsx"

chunk4 = """                            {step === 1 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <User className="w-5 h-5 text-kpu-primary" /> Identitas Pelapor
                                    </h2>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Status Pelapor <span className="text-red-500">*</span></label>
                                        <select value={data.status_pelapor} onChange={e => updateData('status_pelapor', e.target.value)} className={inputClasses(serverErrors.status_pelapor)}>
                                            <option value="Perorangan">Perorangan</option>
                                            <option value="Kuasa Pelapor">Kuasa Pelapor</option>
                                            <option value="Anonim/Rahasia">Anonim/Rahasia</option>
                                        </select>
                                    </div>
                                    
                                    {data.status_pelapor !== 'Anonim/Rahasia' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">NIK <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.nik} onChange={e => updateData('nik', e.target.value)} className={inputClasses(serverErrors.nik)} placeholder="16 Digit NIK" />
                                                    {serverErrors.nik && <p className="mt-1 text-xs text-red-500">{serverErrors.nik}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.nama} onChange={e => updateData('nama', e.target.value)} className={inputClasses(serverErrors.nama)} placeholder="Nama Lengkap Sesuai KTP" />
                                                    {serverErrors.nama && <p className="mt-1 text-xs text-red-500">{serverErrors.nama}</p>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} className={inputClasses(serverErrors.email)} placeholder="Alamat Email Aktif" />
                                                    {serverErrors.email && <p className="mt-1 text-xs text-red-500">{serverErrors.email}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Nomor HP/WhatsApp <span className="text-red-500">*</span></label>
                                                    <input type="text" value={data.no_hp} onChange={e => updateData('no_hp', e.target.value)} className={inputClasses(serverErrors.no_hp)} placeholder="08xxxxxxxxxx" />
                                                    {serverErrors.no_hp && <p className="mt-1 text-xs text-red-500">{serverErrors.no_hp}</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Alamat Lengkap <span className="text-red-500">*</span></label>
                                                <textarea value={data.alamat} onChange={e => updateData('alamat', e.target.value)} rows={3} className={inputClasses(serverErrors.alamat)} placeholder="Alamat Lengkap Domisili" />
                                                {serverErrors.alamat && <p className="mt-1 text-xs text-red-500">{serverErrors.alamat}</p>}
                                            </div>
                                        </>
                                    )}

                                    {data.status_pelapor === 'Anonim/Rahasia' && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm">
                                            <strong>Mode Anonim:</strong> Identitas Anda tidak akan diminta dan akan dirahasiakan oleh sistem. Pastikan bukti awal yang Anda lampirkan cukup kuat untuk ditindaklanjuti.
                                        </div>
                                    )}

                                    <div className="pt-6 border-t flex justify-end">
                                        <Button type="button" onClick={nextStep} className="px-8 h-12 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold">Selanjutnya</Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <FileText className="w-5 h-5 text-kpu-primary" /> Detail Pengaduan
                                    </h2>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Kategori Pengaduan <span className="text-red-500">*</span></label>
                                        <select value={data.kategori_pengaduan} onChange={e => updateData('kategori_pengaduan', e.target.value)} className={inputClasses(serverErrors.kategori_pengaduan)}>
                                            <option value="">-- Pilih Kategori --</option>
                                            <option value="Administrasi Pelayanan">Administrasi Pelayanan</option>
                                            <option value="Kode Etik">Kode Etik</option>
                                            <option value="Sengketa">Sengketa</option>
                                            <option value="WBS / Dugaan Pelanggaran">WBS / Dugaan Pelanggaran</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Judul Pengaduan <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.judul_pengaduan} onChange={e => updateData('judul_pengaduan', e.target.value)} className={inputClasses(serverErrors.judul_pengaduan)} placeholder="Singkat dan jelas, misal: Dugaan Pungli di PTSP" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Pihak yang Dilaporkan <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.pihak_dilaporkan} onChange={e => updateData('pihak_dilaporkan', e.target.value)} className={inputClasses(serverErrors.pihak_dilaporkan)} placeholder="Nama/Jabatan petugas atau instansi terkait" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Lokasi Kejadian <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.lokasi_kejadian} onChange={e => updateData('lokasi_kejadian', e.target.value)} className={inputClasses(serverErrors.lokasi_kejadian)} placeholder="Tempat kejadian perkara" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Waktu Kejadian <span className="text-red-500">*</span></label>
                                            <input type="text" value={data.waktu_kejadian} onChange={e => updateData('waktu_kejadian', e.target.value)} className={inputClasses(serverErrors.waktu_kejadian)} placeholder="Tanggal / Waktu kejadian" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Uraian / Kronologi (4W1H) <span className="text-red-500">*</span></label>
                                        <textarea value={data.uraian_pengaduan} onChange={e => updateData('uraian_pengaduan', e.target.value)} rows={6} className={inputClasses(serverErrors.uraian_pengaduan)} placeholder="Jelaskan secara detail kejadian memuat unsur What, Who, Where, When, How" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Harapan / Tuntutan <span className="text-red-500">*</span></label>
                                        <textarea value={data.tuntutan} onChange={e => updateData('tuntutan', e.target.value)} rows={3} className={inputClasses(serverErrors.tuntutan)} placeholder="Tindak lanjut apa yang Anda harapkan dari pengaduan ini" />
                                    </div>

                                    <div className="pt-6 border-t flex justify-between">
                                        <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 rounded-xl text-neutral-700 font-semibold border-neutral-200">Kembali</Button>
                                        <Button type="button" onClick={nextStep} className="px-8 h-12 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold">Selanjutnya</Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-fade-in space-y-6">
                                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2 border-b pb-4">
                                        <UploadCloud className="w-5 h-5 text-kpu-primary" /> Dokumen & Bukti Pendukung
                                    </h2>
                                    
                                    {data.status_pelapor !== 'Anonim/Rahasia' && (
                                        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Scan/Foto KTP-el <span className="text-red-500">*</span></label>
                                            <p className="text-xs text-neutral-500 mb-3">Format: PDF/JPG/PNG, Maks. 5MB</p>
                                            <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f) updateData('dokumen_ktp', f); }} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-kpu-primary hover:file:bg-red-100 transition-colors" />
                                        </div>
                                    )}

                                    {data.status_pelapor === 'Kuasa Pelapor' && (
                                        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                            <label className="block text-[13px] font-bold text-neutral-800 mb-2">Surat Kuasa Khusus <span className="text-red-500">*</span></label>
                                            <p className="text-xs text-neutral-500 mb-3">Format: PDF/JPG/PNG, Maks. 5MB</p>
                                            <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if(f) updateData('dokumen_surat_kuasa', f); }} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-kpu-primary hover:file:bg-red-100 transition-colors" />
                                        </div>
                                    )}

                                    <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                        <label className="block text-[13px] font-bold text-neutral-800 mb-2">Bukti Pendukung <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-neutral-500 mb-3">Bisa lebih dari 1 file (Foto, Dokumen, Rekaman). Maks 10MB per file.</p>
                                        <input type="file" multiple onChange={handleMultipleFileChange} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors" />
                                        {data.bukti_pendukung.length > 0 && (
                                            <ul className="mt-3 space-y-2">
                                                {data.bukti_pendukung.map((file, idx) => (
                                                    <li key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border">
                                                        <span className="truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                                                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded">Hapus</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t flex justify-between">
                                        <Button type="button" onClick={prevStep} variant="outline" className="px-6 h-12 rounded-xl text-neutral-700 font-semibold border-neutral-200">Kembali</Button>
                                        <Button type="submit" disabled={isSubmitting} className="px-8 h-12 rounded-xl bg-kpu-primary hover:bg-kpu-primary-dark text-white font-bold shadow-md shadow-kpu-primary/20 flex items-center gap-2">
                                            {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
"""
write_chunk(filename, chunk4)
