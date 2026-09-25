import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Save, Settings, Globe, Server, Bell, Shield, Wrench, Link as LinkIcon, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/layouts/app-layout';

interface SettingsProps {
    settings: Record<string, any>;
}

export default function GlobalSettingsIndex({ settings }: SettingsProps) {
    const [activeTab, setActiveTab] = useState('general');
    const [isDirty, setIsDirty] = useState(false);

    // Section Forms
    const generalForm = useForm<Record<string, any>>({
        'app.name': settings['app.name'] || '',
        'app.institution': settings['app.institution'] || '',
        'app.description': settings['app.description'] || '',
        'app.email': settings['app.email'] || '',
        'app.phone': settings['app.phone'] || '',
        'app.address': settings['app.address'] || '',
        'app.website': settings['app.website'] || '',
        'app.logo': null as File | null,
        'app.favicon': null as File | null,
    });

    const portalForm = useForm<Record<string, any>>({
        'portal.title': settings['portal.title'] || '',
        'portal.subtitle': settings['portal.subtitle'] || '',
        'portal.welcome_text': settings['portal.welcome_text'] || '',
        'portal.description': settings['portal.description'] || '',
        'portal.email': settings['portal.email'] || '',
        'portal.phone': settings['portal.phone'] || '',
        'portal.address': settings['portal.address'] || '',
        'portal.website': settings['portal.website'] || '',
        'portal.facebook': settings['portal.facebook'] || '',
        'portal.instagram': settings['portal.instagram'] || '',
        'portal.youtube': settings['portal.youtube'] || '',
        'portal.x': settings['portal.x'] || '',
        'portal.footer_text': settings['portal.footer_text'] || '',
        'portal.hero_active': settings['portal.hero_active'] ?? true,
    });

    const servicesForm = useForm<Record<string, any>>({
        'service.is_open': settings['service.is_open'] ?? true,
        'service.closed_message': settings['service.closed_message'] || '',
        'service.start_time': settings['service.start_time'] || '08:00',
        'service.end_time': settings['service.end_time'] || '16:00',
        'service.days': settings['service.days'] || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    });

    const notifForm = useForm<Record<string, any>>({
        'notification.new_request': settings['notification.new_request'] ?? true,
        'notification.status_change': settings['notification.status_change'] ?? true,
        'notification.new_skm': settings['notification.new_skm'] ?? true,
        'notification.new_guest': settings['notification.new_guest'] ?? true,
        'notification.system_alerts': settings['notification.system_alerts'] ?? true,
    });

    const securityForm = useForm<Record<string, any>>({
        'security.session_timeout': settings['security.session_timeout'] || 120,
        'security.max_login_attempts': settings['security.max_login_attempts'] || 5,
        'security.lockout_duration': settings['security.lockout_duration'] || 15,
        'security.password_min_length': settings['security.password_min_length'] || 8,
        'security.require_uppercase': settings['security.require_uppercase'] ?? true,
        'security.require_number': settings['security.require_number'] ?? true,
        'security.require_special': settings['security.require_special'] ?? false,
    });

    const maintenanceForm = useForm<Record<string, any>>({
        'maintenance.is_active': settings['maintenance.is_active'] ?? false,
        'maintenance.message': settings['maintenance.message'] || 'sistem TORA BELO sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.',
    });

    const integrationForm = useForm<Record<string, any>>({
        'integration.smtp_host': settings['integration.smtp_host'] || '',
        'integration.smtp_port': settings['integration.smtp_port'] || 587,
        'integration.smtp_username': settings['integration.smtp_username'] || '',
        'integration.smtp_password': settings['integration.smtp_password'] || '',
        'integration.smtp_encryption': settings['integration.smtp_encryption'] || 'tls',
        'integration.mail_from_address': settings['integration.mail_from_address'] || '',
        'integration.mail_from_name': settings['integration.mail_from_name'] || '',
    });

    // Check unsaved changes
    useEffect(() => {
        setIsDirty(
            generalForm.isDirty || portalForm.isDirty || servicesForm.isDirty || 
            notifForm.isDirty || securityForm.isDirty || maintenanceForm.isDirty || 
            integrationForm.isDirty
        );
    }, [
        generalForm.isDirty, portalForm.isDirty, servicesForm.isDirty, 
        notifForm.isDirty, securityForm.isDirty, maintenanceForm.isDirty, integrationForm.isDirty
    ]);

    // Navigation confirmation if dirty
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handleInertiaStart = (e: any) => {
            if (isDirty && !window.confirm('Perubahan belum disimpan. Apakah Anda yakin ingin meninggalkan halaman?')) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('inertia:before', handleInertiaStart);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('inertia:before', handleInertiaStart);
        };
    }, [isDirty]);

    const submit = (e: React.FormEvent, formName: string, url: string, formInstance: any) => {
        e.preventDefault();
        
        formInstance.post(url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan berhasil disimpan.');
                formInstance.reset();
            },
            onError: () => {
                toast.error('Gagal menyimpan pengaturan. Periksa kembali data yang dimasukkan.');
            }
        });
    };

    return (
        <>
            <Head title="Pengaturan Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 lg:gap-8 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/50/50 dark:bg-transparent">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-foreground">Pengaturan Sistem</h1>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                            Sistem Online
                        </span>
                    </div>
                    <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">
                        Kelola konfigurasi global aplikasi TORA BELO, portal publik, layanan, notifikasi, keamanan, pemeliharaan, dan integrasi sistem.
                    </p>
                </div>

                {isDirty && (
                    <Alert variant="default" className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-900">
                        <AlertCircle className="h-4 w-4" color="currentColor" />
                        <AlertTitle>Perubahan belum disimpan</AlertTitle>
                        <AlertDescription>
                            Anda memiliki perubahan yang belum disimpan. Pastikan klik tombol "Simpan Perubahan" pada tab yang Anda ubah.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Navigation Sidebar / Dropdown */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="lg:hidden mb-4">
                            <select 
                                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                            >
                                <option value="general">Umum</option>
                                <option value="portal">Portal Publik</option>
                                <option value="services">Layanan</option>
                                <option value="notifications">Notifikasi</option>
                                <option value="security">Keamanan</option>
                                <option value="maintenance">Pemeliharaan</option>
                                <option value="integration">Integrasi</option>
                            </select>
                        </div>

                        <Card className="hidden lg:block overflow-hidden sticky top-6">
                            <TabsList className="flex flex-col h-auto w-full bg-transparent p-0">
                                <TabsTrigger value="general" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Settings className="w-4 h-4" /> Umum
                                </TabsTrigger>
                                <TabsTrigger value="portal" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Globe className="w-4 h-4" /> Portal Publik
                                </TabsTrigger>
                                <TabsTrigger value="services" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Server className="w-4 h-4" /> Layanan
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Bell className="w-4 h-4" /> Notifikasi
                                </TabsTrigger>
                                <TabsTrigger value="security" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Shield className="w-4 h-4" /> Keamanan
                                </TabsTrigger>
                                <TabsTrigger value="maintenance" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <Wrench className="w-4 h-4" /> Pemeliharaan
                                </TabsTrigger>
                                <TabsTrigger value="integration" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-l-4 border-transparent data-[state=active]:border-kpu-primary text-muted-foreground data-[state=active]:text-foreground">
                                    <LinkIcon className="w-4 h-4" /> Integrasi
                                </TabsTrigger>
                            </TabsList>
                        </Card>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full min-w-0">
                        {/* GENERAL SETTINGS */}
                        <TabsContent value="general" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'general', '/admin/settings/general', generalForm)}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Pengaturan Umum</CardTitle>
                                        <CardDescription>Kelola identitas utama aplikasi TORA BELO.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Nama Aplikasi</Label>
                                                <Input 
                                                    value={generalForm.data['app.name']} 
                                                    onChange={e => generalForm.setData('app.name', e.target.value)} 
                                                    placeholder="TORA BELO KPU"
                                                />
                                                {generalForm.errors['app.name'] && <p className="text-sm text-destructive">{generalForm.errors['app.name']}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nama Instansi</Label>
                                                <Input 
                                                    value={generalForm.data['app.institution']} 
                                                    onChange={e => generalForm.setData('app.institution', e.target.value)} 
                                                    placeholder="KPU Kota Palu"
                                                />
                                                {generalForm.errors['app.institution'] && <p className="text-sm text-destructive">{generalForm.errors['app.institution']}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Deskripsi Aplikasi</Label>
                                            <Textarea 
                                                value={generalForm.data['app.description']} 
                                                onChange={e => generalForm.setData('app.description', e.target.value)} 
                                                rows={3}
                                            />
                                            {generalForm.errors['app.description'] && <p className="text-sm text-destructive">{generalForm.errors['app.description']}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Email Resmi</Label>
                                                <Input 
                                                    type="email"
                                                    value={generalForm.data['app.email']} 
                                                    onChange={e => generalForm.setData('app.email', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nomor Telepon</Label>
                                                <Input 
                                                    value={generalForm.data['app.phone']} 
                                                    onChange={e => generalForm.setData('app.phone', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Alamat Kantor</Label>
                                                <Textarea 
                                                    value={generalForm.data['app.address']} 
                                                    onChange={e => generalForm.setData('app.address', e.target.value)} 
                                                    rows={2}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border">
                                            <div className="space-y-2 max-w-sm">
                                                <Label>Upload Logo Baru (Opsional)</Label>
                                                <Input 
                                                    type="file" 
                                                    accept="image/png, image/jpeg, image/svg+xml"
                                                    onChange={e => generalForm.setData('app.logo', e.target.files ? e.target.files[0] : null)}
                                                />
                                                <p className="text-[12px] text-muted-foreground">Maks. 2MB. Format: PNG, JPG, SVG.</p>
                                                {generalForm.errors['app.logo'] && <p className="text-sm text-destructive">{generalForm.errors['app.logo']}</p>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={generalForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {generalForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* PORTAL PUBLIK */}
                        <TabsContent value="portal" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'portal', '/admin/settings/portal', portalForm)}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Portal Publik</CardTitle>
                                        <CardDescription>Atur informasi yang ditampilkan pada halaman utama (landing page) masyarakat.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
                                            <div>
                                                <h4 className="font-medium text-foreground">Status Banner/Hero</h4>
                                                <p className="text-sm text-muted-foreground">Tampilkan bagian hero section di portal.</p>
                                            </div>
                                            <Switch 
                                                checked={portalForm.data['portal.hero_active']} 
                                                onCheckedChange={v => portalForm.setData('portal.hero_active', v)} 
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Judul Portal</Label>
                                                <Input 
                                                    value={portalForm.data['portal.title']} 
                                                    onChange={e => portalForm.setData('portal.title', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Subjudul Portal</Label>
                                                <Input 
                                                    value={portalForm.data['portal.subtitle']} 
                                                    onChange={e => portalForm.setData('portal.subtitle', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Teks Sambutan</Label>
                                                <Textarea 
                                                    value={portalForm.data['portal.welcome_text']} 
                                                    onChange={e => portalForm.setData('portal.welcome_text', e.target.value)} 
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border space-y-4">
                                            <h4 className="font-semibold text-sm text-foreground">Sosial Media</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Facebook URL</Label>
                                                    <Input type="url" value={portalForm.data['portal.facebook']} onChange={e => portalForm.setData('portal.facebook', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Instagram URL</Label>
                                                    <Input type="url" value={portalForm.data['portal.instagram']} onChange={e => portalForm.setData('portal.instagram', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>YouTube URL</Label>
                                                    <Input type="url" value={portalForm.data['portal.youtube']} onChange={e => portalForm.setData('portal.youtube', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>X / Twitter URL</Label>
                                                    <Input type="url" value={portalForm.data['portal.x']} onChange={e => portalForm.setData('portal.x', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={portalForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {portalForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* LAYANAN */}
                        <TabsContent value="services" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'services', '/admin/settings/services', servicesForm)}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Pengaturan Layanan</CardTitle>
                                        <CardDescription>Atur jam kerja, penerimaan permohonan, dan operasional layanan TORA BELO.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-muted/20">
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-foreground">Status Penerimaan Permohonan</h4>
                                                <p className="text-sm text-muted-foreground">Jika ditutup, masyarakat tidak dapat mengajukan permohonan baru pada portal publik.</p>
                                            </div>
                                            <Switch 
                                                checked={servicesForm.data['service.is_open']} 
                                                onCheckedChange={v => servicesForm.setData('service.is_open', v)} 
                                            />
                                        </div>

                                        {!servicesForm.data['service.is_open'] && (
                                            <div className="space-y-2">
                                                <Label>Pesan Saat Layanan Ditutup</Label>
                                                <Textarea 
                                                    value={servicesForm.data['service.closed_message']} 
                                                    onChange={e => servicesForm.setData('service.closed_message', e.target.value)} 
                                                    placeholder="Maaf, layanan permohonan sedang ditutup."
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-6 max-w-lg">
                                            <div className="space-y-2">
                                                <Label>Jam Mulai Pelayanan</Label>
                                                <Input 
                                                    type="time"
                                                    value={servicesForm.data['service.start_time']} 
                                                    onChange={e => servicesForm.setData('service.start_time', e.target.value)} 
                                                />
                                                {servicesForm.errors['service.start_time'] && <p className="text-sm text-destructive">{servicesForm.errors['service.start_time']}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Jam Selesai Pelayanan</Label>
                                                <Input 
                                                    type="time"
                                                    value={servicesForm.data['service.end_time']} 
                                                    onChange={e => servicesForm.setData('service.end_time', e.target.value)} 
                                                />
                                                {servicesForm.errors['service.end_time'] && <p className="text-sm text-destructive">{servicesForm.errors['service.end_time']}</p>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={servicesForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {servicesForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* NOTIFIKASI */}
                        <TabsContent value="notifications" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'notifications', '/admin/settings/notifications', notifForm)}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Pengaturan Notifikasi</CardTitle>
                                        <CardDescription>Aktifkan atau matikan modul notifikasi yang dikirimkan sistem.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            { id: 'notification.new_request', label: 'Notifikasi Permohonan Baru', desc: 'Memberitahu petugas saat ada permohonan masuk.' },
                                            { id: 'notification.status_change', label: 'Notifikasi Perubahan Status', desc: 'Memberitahu masyarakat dan petugas saat status berubah.' },
                                            { id: 'notification.new_skm', label: 'Notifikasi SKM Baru', desc: 'Peringatan saat ada pengisian Survei Kepuasan Masyarakat.' },
                                            { id: 'notification.new_guest', label: 'Notifikasi Buku Tamu', desc: 'Peringatan saat ada pengunjung fisik mengisi buku tamu.' },
                                            { id: 'notification.system_alerts', label: 'Notifikasi Peringatan Sistem', desc: 'Notifikasi keamanan dan alert kritis.' },
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base cursor-pointer">{item.label}</Label>
                                                    <p className="text-[13px] text-muted-foreground">{item.desc}</p>
                                                </div>
                                                <Switch 
                                                    checked={notifForm.data[item.id as keyof typeof notifForm.data]} 
                                                    onCheckedChange={v => notifForm.setData(item.id as any, v)} 
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={notifForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {notifForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* KEAMANAN */}
                        <TabsContent value="security" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'security', '/admin/settings/security', securityForm)}>
                                <Card className="border-t-4 border-t-amber-500">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><Lock className="w-5 h-5 text-amber-500" /> Keamanan Sistem</CardTitle>
                                        <CardDescription>Konfigurasi keamanan berdampak langsung pada sesi pengguna dan kebijakan kata sandi.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label>Session Timeout (menit)</Label>
                                                <Input 
                                                    type="number"
                                                    min="1"
                                                    max="1440"
                                                    value={securityForm.data['security.session_timeout']} 
                                                    onChange={e => securityForm.setData('security.session_timeout', parseInt(e.target.value) || 0)} 
                                                />
                                                {securityForm.errors['security.session_timeout'] && <p className="text-sm text-destructive">{securityForm.errors['security.session_timeout']}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Max Login Attempts</Label>
                                                <Input 
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={securityForm.data['security.max_login_attempts']} 
                                                    onChange={e => securityForm.setData('security.max_login_attempts', parseInt(e.target.value) || 0)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Lockout Duration (menit)</Label>
                                                <Input 
                                                    type="number"
                                                    min="1"
                                                    value={securityForm.data['security.lockout_duration']} 
                                                    onChange={e => securityForm.setData('security.lockout_duration', parseInt(e.target.value) || 0)} 
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border">
                                            <h4 className="font-medium text-sm text-foreground mb-4">Kebijakan Password Default</h4>
                                            
                                            <div className="space-y-4 max-w-sm">
                                                <div className="space-y-2">
                                                    <Label>Minimum Length</Label>
                                                    <Input 
                                                        type="number"
                                                        min="8"
                                                        value={securityForm.data['security.password_min_length']} 
                                                        onChange={e => securityForm.setData('security.password_min_length', parseInt(e.target.value) || 0)} 
                                                    />
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <Label>Wajib Huruf Besar (Uppercase)</Label>
                                                    <Switch 
                                                        checked={securityForm.data['security.require_uppercase']} 
                                                        onCheckedChange={v => securityForm.setData('security.require_uppercase', v)} 
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label>Wajib Angka (Number)</Label>
                                                    <Switch 
                                                        checked={securityForm.data['security.require_number']} 
                                                        onCheckedChange={v => securityForm.setData('security.require_number', v)} 
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label>Wajib Karakter Unik (Special)</Label>
                                                    <Switch 
                                                        checked={securityForm.data['security.require_special']} 
                                                        onCheckedChange={v => securityForm.setData('security.require_special', v)} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={securityForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {securityForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* PEMELIHARAAN (DANGER ZONE) */}
                        <TabsContent value="maintenance" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'maintenance', '/admin/settings/maintenance', maintenanceForm)}>
                                <Card className="border-destructive/50 border-t-4 border-t-destructive">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                                            <AlertCircle className="w-5 h-5" /> Mode Pemeliharaan
                                        </CardTitle>
                                        <CardDescription>
                                            Jika diaktifkan, portal publik akan menampilkan halaman maintenance. <strong>Admin tetap dapat mengakses sistem backend.</strong>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-foreground">Aktifkan Maintenance Mode</h4>
                                                <p className="text-sm text-muted-foreground">Tutup akses publik sementara waktu.</p>
                                            </div>
                                            <Switch 
                                                checked={maintenanceForm.data['maintenance.is_active']} 
                                                onCheckedChange={v => maintenanceForm.setData('maintenance.is_active', v)} 
                                            />
                                        </div>

                                        {maintenanceForm.data['maintenance.is_active'] && (
                                            <div className="space-y-2">
                                                <Label>Pesan Maintenance</Label>
                                                <Textarea 
                                                    value={maintenanceForm.data['maintenance.message']} 
                                                    onChange={e => maintenanceForm.setData('maintenance.message', e.target.value)} 
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="bg-destructive/5 border-t border-destructive/20 flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={maintenanceForm.processing} variant="destructive">
                                            {maintenanceForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Terapkan Pemeliharaan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                        {/* INTEGRASI */}
                        <TabsContent value="integration" className="mt-0 outline-none">
                            <form onSubmit={(e) => submit(e, 'integration', '/admin/settings/integration', integrationForm)}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Integrasi SMTP / Email</CardTitle>
                                        <CardDescription>Konfigurasi server pengiriman email sistem.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>SMTP Host</Label>
                                                <Input 
                                                    value={integrationForm.data['integration.smtp_host']} 
                                                    onChange={e => integrationForm.setData('integration.smtp_host', e.target.value)} 
                                                    placeholder="smtp.mailtrap.io"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Port</Label>
                                                <Input 
                                                    type="number"
                                                    value={integrationForm.data['integration.smtp_port']} 
                                                    onChange={e => integrationForm.setData('integration.smtp_port', parseInt(e.target.value) || 0)} 
                                                    placeholder="587"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Encryption</Label>
                                                <select 
                                                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    value={integrationForm.data['integration.smtp_encryption']}
                                                    onChange={e => integrationForm.setData('integration.smtp_encryption', e.target.value)}
                                                >
                                                    <option value="tls">TLS</option>
                                                    <option value="ssl">SSL</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Username</Label>
                                                <Input 
                                                    value={integrationForm.data['integration.smtp_username']} 
                                                    onChange={e => integrationForm.setData('integration.smtp_username', e.target.value)} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>SMTP Password</Label>
                                                <Input 
                                                    type="password"
                                                    value={integrationForm.data['integration.smtp_password']} 
                                                    onChange={e => integrationForm.setData('integration.smtp_password', e.target.value)} 
                                                    placeholder="••••••••"
                                                />
                                                <p className="text-[11px] text-muted-foreground">Kosongkan jika tidak ingin mengubah password.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Mail From Address</Label>
                                                <Input 
                                                    type="email"
                                                    value={integrationForm.data['integration.mail_from_address']} 
                                                    onChange={e => integrationForm.setData('integration.mail_from_address', e.target.value)} 
                                                    placeholder="noreply@kpu-palu.go.id"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Mail From Name</Label>
                                                <Input 
                                                    value={integrationForm.data['integration.mail_from_name']} 
                                                    onChange={e => integrationForm.setData('integration.mail_from_name', e.target.value)} 
                                                    placeholder="TORA BELO KPU Kota Palu"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end px-6 py-4">
                                        <Button type="submit" disabled={integrationForm.processing} className="bg-kpu-primary hover:bg-kpu-primary-dark text-white">
                                            {integrationForm.processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>

                    </div>
                </Tabs>
            </div>
        </>
    );
}

GlobalSettingsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Admin', href: '/admin/area' },
        { title: 'Sistem', href: '#' },
        { title: 'Pengaturan', href: '/admin/settings' },
    ]}>
        {page}
    </AppLayout>
);



