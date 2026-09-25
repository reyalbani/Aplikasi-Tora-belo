import { Form, Head, usePage, Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { CheckCircle2 } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil - TORA BELO" />

            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-[18px] font-semibold text-foreground">Informasi Profil</h2>
                    <p className="text-[14px] text-muted-foreground mt-1">Perbarui nama lengkap dan alamat email akun Anda.</p>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                            <div className="h-16 w-16 rounded-full bg-kpu-primary/10 flex items-center justify-center text-kpu-primary font-bold text-2xl border border-kpu-primary/20">
                                {auth.user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[16px]">{auth.user.name}</span>
                                <span className="text-[14px] text-muted-foreground">{auth.user.email}</span>
                            </div>
                        </div>

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="flex flex-col gap-6 max-w-xl"
                        >
                            {({ processing, errors, recentlySuccessful }) => (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name" className="text-foreground/80">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            className="h-11 rounded-[8px] border-border focus-visible:ring-kpu-primary"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email" className="text-foreground/80">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-11 rounded-[8px] border-border focus-visible:ring-kpu-primary"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Masukkan alamat email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="bg-amber-50 p-4 rounded-[8px] border border-amber-100">
                                            <p className="text-[13px] text-amber-800">
                                                Alamat email Anda belum diverifikasi.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-medium underline hover:text-amber-900"
                                                >
                                                    Klik di sini untuk mengirim ulang email verifikasi.
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-[13px] font-medium text-emerald-600 flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            disabled={processing}
                                            className="bg-kpu-primary hover:bg-kpu-primary/90 text-white rounded-[8px] px-6 h-11"
                                        >
                                            Simpan Perubahan
                                        </Button>
                                        
                                        {recentlySuccessful && (
                                            <div className="flex items-center gap-1.5 text-[14px] text-emerald-600 font-medium transition-opacity">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>Tersimpan</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan',
            href: edit(),
        },
        {
            title: 'Profil',
            href: edit(),
        },
    ],
};



