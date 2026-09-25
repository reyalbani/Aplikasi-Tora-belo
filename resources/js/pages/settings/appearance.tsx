import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { Card, CardContent } from '@/components/ui/card';
import { edit as editAppearance } from '@/routes/appearance';
import { Palette, PanelLeftDashed } from 'lucide-react';

export default function Appearance() {
    return (
        <>
            <Head title="Tampilan - TORA BELO" />

            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-[18px] font-semibold text-foreground">Tampilan</h2>
                    <p className="text-[14px] text-muted-foreground mt-1">Sesuaikan tampilan TORA BELO dengan preferensi Anda.</p>
                </div>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <div className="h-10 w-10 rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[15px]">Tema UI</span>
                                <span className="text-[13px] text-muted-foreground">Ubah gaya visual antarmuka sistem.</span>
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <AppearanceTabs />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm dark:shadow-none rounded-[16px] overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                            <div className="h-10 w-10 rounded-[10px] bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <PanelLeftDashed className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-[15px]">Preferensi Sidebar</span>
                                <span className="text-[13px] text-muted-foreground">Atur perilaku navigasi sidebar pada desktop.</span>
                            </div>
                        </div>

                        <div className="max-w-xl flex flex-col gap-3">
                            <label className="flex items-center gap-3 p-4 rounded-[8px] border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                                <input type="radio" name="sidebar" className="h-4 w-4 text-kpu-primary focus:ring-kpu-primary" defaultChecked />
                                <span className="text-[14px] font-medium text-foreground/80">Selalu terbuka</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 rounded-[8px] border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                                <input type="radio" name="sidebar" className="h-4 w-4 text-kpu-primary focus:ring-kpu-primary" />
                                <span className="text-[14px] font-medium text-foreground/80">Terakhir digunakan</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan',
            href: editAppearance(),
        },
        {
            title: 'Tampilan',
            href: editAppearance(),
        },
    ],
};



