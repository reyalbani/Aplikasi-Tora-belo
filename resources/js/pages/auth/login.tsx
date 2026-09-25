import { Form, Head, Link } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const inputClasses = (hasError: boolean) => 
        `w-full h-[50px] rounded-[12px] border ${
            hasError 
                ? 'border-red-500 bg-red-50/20 focus-visible:border-red-500 focus-visible:ring-red-500/20' 
                : 'border-border/90 bg-card hover:border-slate-300 focus-visible:border-kpu-primary focus-visible:ring-kpu-primary/15'
        } px-4 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-4 transition-all duration-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]`;

    return (
        <>
            <Head title="Masuk - TORA BELO KPU Kota Palu" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 mt-2"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[13px] font-semibold text-foreground/80">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="Masukkan alamat email Anda"
                                className={inputClasses(!!errors.email)}
                            />
                            {errors.email && <InputError message={errors.email} className="mt-1" />}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[13px] font-semibold text-foreground/80">Kata Sandi</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Masukkan kata sandi Anda"
                                className={inputClasses(!!errors.password)}
                            />
                            {errors.password && <InputError message={errors.password} className="mt-1" />}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-y-3 pt-2">
                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="w-5 h-5 sm:w-4 sm:h-4 rounded border-slate-300 data-[state=checked]:bg-kpu-primary data-[state=checked]:border-kpu-primary text-white transition-colors duration-200 cursor-pointer"
                                />
                                <Label htmlFor="remember" className="text-[13px] font-medium text-muted-foreground cursor-pointer select-none">
                                    Ingat sesi saya
                                </Label>
                            </div>

                            <Link
                                href="/forgot-password"
                                className="text-[13px] font-semibold text-kpu-primary hover:text-kpu-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kpu-primary/20 rounded-sm"
                            >
                                Lupa kata sandi?
                            </Link>
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="h-[52px] w-full rounded-[12px] bg-kpu-primary text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(var(--kpu-primary-rgb),0.25)] transition-all duration-200 hover:bg-kpu-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(var(--kpu-primary-rgb),0.23)] active:translate-y-0 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-kpu-primary/20 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-5 w-5 text-white animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    "Masuk ke TORA BELO"
                                )}
                            </Button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="flex-shrink-0 mx-4 text-muted-foreground/70 text-[12px] font-medium">Belum memiliki akun?</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link 
                                    href="/permohonan-akun"
                                    className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] border border-border bg-card text-[14px] font-semibold text-foreground/80 hover:bg-muted/50 hover:text-foreground transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    BUAT AKUN BARU
                                </Link>

                                <div className="text-center pt-2">
                                    <span className="text-muted-foreground/70 text-[12px] font-medium">Sudah mengajukan permohonan?</span>
                                </div>
                                <Link 
                                    href="/permohonan-akun/status"
                                    className="inline-flex items-center justify-center h-[48px] w-full rounded-[12px] border border-border bg-slate-50 text-[14px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                                >
                                    CEK STATUS PERMOHONAN
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-6 rounded-xl bg-green-50 p-4 text-center text-[13px] font-medium text-green-700 border border-green-200/60 shadow-xs">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang',
    description: 'Silakan masuk menggunakan akun resmi Anda untuk mengakses layanan.',
};



