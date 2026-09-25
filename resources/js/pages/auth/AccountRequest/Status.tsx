import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    contact: {
        whatsapp: string;
        email: string;
    };
};

export default function Status({ contact }: Props) {
    const [method, setMethod] = useState<'phone' | 'code'>('phone');
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        method: 'phone',
        phone: '',
        request_code: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        data.method = method;
        post('/permohonan-akun/status');
    };

    const switchMethod = (m: 'phone' | 'code') => {
        setMethod(m);
        setData('method', m);
        clearErrors();
    };

    return (
        <>
            <Head title="Cek Status Permohonan" />

            <div className="mb-6 flex flex-col gap-2">
                <Link href="/login" className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Login
                </Link>
                <div className="flex items-center justify-center bg-red-50 text-red-600 w-12 h-12 rounded-full mb-2">
                    <Search className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Cek Status Permohonan Akun</h1>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Pantau proses verifikasi permohonan akun TORA BELO menggunakan nomor HP atau kode permohonan.
                </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                <button
                    type="button"
                    onClick={() => switchMethod('phone')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                        method === 'phone' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Nomor HP / WA
                </button>
                <button
                    type="button"
                    onClick={() => switchMethod('code')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                        method === 'code' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Kode Permohonan
                </button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-5">
                {method === 'phone' ? (
                    <div className="space-y-2">
                        <Label htmlFor="phone">Nomor HP / WhatsApp</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            required={method === 'phone'}
                            placeholder="Masukkan nomor HP yang digunakan saat mengajukan"
                            className="text-center"
                        />
                        <p className="text-[11px] text-muted-foreground text-center mt-1">
                            Gunakan nomor HP yang sama dengan yang Anda masukkan pada formulir permohonan akun.
                        </p>
                        <InputError message={errors.phone} />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="request_code">Kode Permohonan</Label>
                        <Input
                            id="request_code"
                            value={data.request_code}
                            onChange={e => setData('request_code', e.target.value)}
                            required={method === 'code'}
                            placeholder="Contoh: TB-AKUN-2026-00001"
                            className="font-mono text-center uppercase tracking-wider"
                        />
                        <p className="text-[11px] text-muted-foreground text-center mt-1">
                            Gunakan kode permohonan yang diberikan setelah Anda mengirim formulir permohonan akun.
                        </p>
                        <InputError message={errors.request_code} />
                    </div>
                )}

                <Button type="submit" className="w-full h-[52px] bg-red-600 text-white mt-2 font-bold hover:bg-red-700" disabled={processing}>
                    {processing ? <Spinner className="w-5 h-5 mr-2 animate-spin text-white" /> : null}
                    {processing ? 'MEMERIKSA...' : 'CEK STATUS'}
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

Status.layout = {
    title: 'Cek Status',
    description: 'TORA BELO KPU KOTA PALU',
};
