import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { edit } from '@/routes/security';
import { CheckCircle2, MonitorSmartphone, KeyRound, ShieldAlert } from 'lucide-react';

type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Keamanan - TORA BELO" />

            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-[18px] font-semibold text-foreground">Keamanan</h2>
                    <p className="text-[14px] text-muted-foreground mt-1">Kelola password dan keamanan akun Anda.</p>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <div className="h-10 w-10 rounded-[10px] bg-kpu-primary/10 flex items-center justify-center text-kpu-primary">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[15px]">Ubah Password</span>
                                <span className="text-[13px] text-muted-foreground">Pastikan akun Anda menggunakan password yang panjang dan acak.</span>
                            </div>
                        </div>

                        <Form
                            {...SecurityController.update.form()}
                            options={{ preserveScroll: true }}
                            resetOnError={['password', 'password_confirmation', 'current_password']}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) passwordInput.current?.focus();
                                if (errors.current_password) currentPasswordInput.current?.focus();
                            }}
                            className="flex flex-col gap-6 max-w-xl"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="current_password">Password Saat Ini</Label>
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="h-11 rounded-[8px] border-border focus-visible:ring-kpu-primary"
                                            autoComplete="current-password"
                                            placeholder="Masukkan password saat ini"
                                        />
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password">Password Baru</Label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="h-11 rounded-[8px] border-border focus-visible:ring-kpu-primary"
                                            autoComplete="new-password"
                                            placeholder="Masukkan password baru"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="h-11 rounded-[8px] border-border focus-visible:ring-kpu-primary"
                                            autoComplete="new-password"
                                            placeholder="Konfirmasi password baru"
                                            passwordrules={props.passwordRules}
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            disabled={processing}
                                            className="bg-kpu-primary hover:bg-kpu-primary/90 text-white rounded-[8px] px-6 h-11"
                                        >
                                            Perbarui Password
                                        </Button>
                                        {recentlySuccessful && (
                                            <div className="flex items-center gap-1.5 text-[14px] text-emerald-600 font-medium transition-opacity">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>Berhasil Diperbarui</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <div className="h-10 w-10 rounded-[10px] bg-amber-50 flex items-center justify-center text-amber-500">
                                <MonitorSmartphone className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[15px]">Sesi Aktif</span>
                                <span className="text-[13px] text-muted-foreground">Kelola dan amankan sesi akun Anda di perangkat lain.</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 max-w-xl">
                            <div className="flex flex-col gap-1 p-4 rounded-[8px] bg-muted/50 border border-border">
                                <span className="text-[14px] font-semibold text-foreground">Perangkat saat ini</span>
                                <span className="text-[13px] text-muted-foreground">Windows / Chrome</span>
                                <span className="text-[12px] font-medium text-emerald-600 mt-1">Aktif sekarang</span>
                            </div>

                            <div className="pt-2">
                                <Button variant="outline" className="border-border text-foreground/80 hover:bg-muted/50 h-11 px-6 rounded-[8px]">
                                    Keluar dari perangkat lain
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <div className="h-10 w-10 rounded-[10px] bg-muted/50 flex items-center justify-center text-muted-foreground">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[15px]">Aktivitas Login</span>
                                <span className="text-[13px] text-muted-foreground">Riwayat login akan tersedia setelah sistem pencatatan aktivitas diaktifkan.</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center py-6 text-[13px] text-muted-foreground/70">
                            Belum ada riwayat aktivitas yang tersimpan.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan',
            href: edit(),
        },
        {
            title: 'Keamanan',
            href: edit(),
        },
    ],
};



