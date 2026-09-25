import { MousePointerClick, FileEdit, Send, Activity } from 'lucide-react';

export function ServiceSteps() {
    const steps = [
        {
            num: 1,
            title: 'Pilih Layanan',
            desc: 'Pilih layanan sesuai kebutuhan Anda.',
            icon: MousePointerClick
        },
        {
            num: 2,
            title: 'Lengkapi Data',
            desc: 'Isi formulir pengajuan dengan benar.',
            icon: FileEdit
        },
        {
            num: 3,
            title: 'Kirim Pengajuan',
            desc: 'Submit dan dapatkan nomor tiket.',
            icon: Send
        },
        {
            num: 4,
            title: 'Pantau Status',
            desc: 'Cek progres secara berkala online.',
            icon: Activity
        }
    ];

    return (
        <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-neutral-100">
            <div className="mb-10 text-center">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800">
                    Bagaimana cara menggunakan TORA BELO?
                </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group">
                        <div className="relative mb-4">
                            <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-kpu-primary/10 transition-colors">
                                <step.icon className="h-7 w-7 text-neutral-500 group-hover:text-kpu-primary transition-colors" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-kpu-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                                0{step.num}
                            </div>
                        </div>
                        <h3 className="font-bold text-sm text-neutral-800 mb-1">{step.title}</h3>
                        <p className="text-xs text-neutral-500 max-w-[140px]">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
