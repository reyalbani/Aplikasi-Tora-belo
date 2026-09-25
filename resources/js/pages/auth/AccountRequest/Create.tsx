import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
    contact: {
        whatsapp: string;
        email: string;
    };
};

export default function Create({ contact }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        nik: '',
        nip: '',
        email: '',
        nomor_whatsapp: '',
        jabatan: '',
        unit_bagian: '',
        requested_role: '',
        alasan: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/permohonan-akun');
    };

    return (
        <>
            <Head title="Permohonan Akun TORA BELO" />

            <div className="mb-6 flex flex-col gap-2">
                <Link href="/login" className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Login
                </Link>
                <h1 className="text-xl font-bold text-foreground">Permohonan Akun TORA BELO</h1>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Ajukan permohonan akses sebagai Petugas atau Pimpinan. Akun akan dibuat setelah diverifikasi dan disetujui oleh Admin TORA BELO.
                </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input
                        id="nama_lengkap"
                        value={data.nama_lengkap}
                        onChange={e => setData('nama_lengkap', e.target.value)}
                        required
                        placeholder="Nama lengkap sesuai identitas"
                    />
                    <InputError message={errors.nama_lengkap} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nik">NIK <span className="text-red-500">*</span></Label>
                        <Input
                            id="nik"
                            value={data.nik}
                            onChange={e => setData('nik', e.target.value)}
                            required
                            placeholder="Nomor Induk Kependudukan"
                        />
                        <InputError message={errors.nik} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nip">NIP (Opsional)</Label>
                        <Input
                            id="nip"
                            value={data.nip}
                            onChange={e => setData('nip', e.target.value)}
                            placeholder="Nomor Induk Pegawai"
                        />
                        <InputError message={errors.nip} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Alamat Email <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            placeholder="Email aktif"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nomor_whatsapp">Nomor WhatsApp <span className="text-red-500">*</span></Label>
                        <Input
                            id="nomor_whatsapp"
                            value={data.nomor_whatsapp}
                            onChange={e => setData('nomor_whatsapp', e.target.value)}
                            required
                            placeholder="Contoh: 08123456789"
                        />
                        <InputError message={errors.nomor_whatsapp} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="jabatan">Jabatan (Opsional)</Label>
                        <Input
                            id="jabatan"
                            value={data.jabatan}
                            onChange={e => setData('jabatan', e.target.value)}
                            placeholder="Jabatan Anda saat ini"
                        />
                        <InputError message={errors.jabatan} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit_bagian">Unit / Bagian (Opsional)</Label>
                        <Input
                            id="unit_bagian"
                            value={data.unit_bagian}
                            onChange={e => setData('unit_bagian', e.target.value)}
                            placeholder="Unit kerja / instansi"
                        />
                        <InputError message={errors.unit_bagian} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="requested_role">Akses yang Dimohon <span className="text-red-500">*</span></Label>
                    <Select value={data.requested_role} onValueChange={v => setData('requested_role', v)} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis akses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="petugas">Petugas</SelectItem>
                            <SelectItem value="pimpinan">Pimpinan</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.requested_role} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="alasan">Alasan Membutuhkan Akses <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="alasan"
                        value={data.alasan}
                        onChange={e => setData('alasan', e.target.value)}
                        required
                        className="min-h-[100px]"
                        placeholder="Jelaskan secara singkat mengapa Anda membutuhkan akses ke sistem..."
                    />
                    <InputError message={errors.alasan} />
                </div>

                <Button type="submit" className="w-full h-[52px] bg-kpu-primary text-white mt-2 font-bold" disabled={processing}>
                    {processing ? <Spinner className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {processing ? 'MENGIRIM...' : 'KIRIM PERMOHONAN'}
                </Button>
            </form>

            <div className="mt-8 text-center border-t border-border pt-6">
                <p className="text-[12px] text-muted-foreground mb-2">Belum mendapatkan informasi atau butuh bantuan?</p>
                <a href={contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : `mailto:${contact.email}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-[13px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
                    HUBUNGI ADMIN
                </a>
            </div>
        </>
    );
}

Create.layout = {
    title: 'Permohonan Akun',
    description: 'TORA BELO KPU KOTA PALU',
};
