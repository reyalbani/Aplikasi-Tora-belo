import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    token: string;
    name: string;
};

export default function Activate({ token, name }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/aktivasi-akun/${token}`);
    };

    return (
        <>
            <Head title="Aktivasi Akun" />

            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Aktivasi Akun</h1>
                <p className="text-[14px] text-muted-foreground leading-relaxed mt-2">
                    Halo, <strong>{name}</strong>! Silakan buat kata sandi untuk akun TORA BELO Anda.
                </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Kata Sandi Baru</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                    <p className="text-xs text-muted-foreground mt-1">Minimal 12 karakter, mengandung huruf besar, kecil, angka, dan simbol.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            required
                            className="pr-10"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button type="submit" className="w-full h-[52px] bg-kpu-primary text-white mt-4 font-bold hover:bg-kpu-primary-dark" disabled={processing}>
                    {processing ? <Spinner className="w-5 h-5 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                    {processing ? 'MENGAKTIFKAN...' : 'AKTIFKAN AKUN'}
                </Button>
            </form>
        </>
    );
}

Activate.layout = {
    title: 'Aktivasi Akun',
    description: 'TORA BELO KPU KOTA PALU',
};
