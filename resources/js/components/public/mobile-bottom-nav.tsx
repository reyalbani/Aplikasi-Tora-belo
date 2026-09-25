import { Home, Grid, Search, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MobileBottomNav() {
    const [active, setActive] = useState('beranda');

    // Simple scroll spy for bottom nav
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['beranda', 'layanan', 'cek-status', 'informasi'];
            let current = 'beranda';
            
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 150) {
                        current = section;
                    }
                }
            }
            setActive(current);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'beranda', label: 'Beranda', icon: Home, href: '#beranda' },
        { id: 'layanan', label: 'Layanan', icon: Grid, href: '#layanan' },
        { id: 'cek-status', label: 'Status', icon: Search, href: '#cek-status' },
        { id: 'informasi', label: 'Info', icon: Info, href: '#informasi' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-neutral-200 pb-safe">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <a 
                            key={item.id}
                            href={item.href} 
                            onClick={() => setActive(item.id)}
                            className={`inline-flex flex-col items-center justify-center px-5 group transition-colors ${isActive ? 'bg-white' : 'hover:bg-neutral-50'}`}
                        >
                            <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-kpu-primary' : 'text-neutral-500 group-hover:text-kpu-primary transition-colors'}`} />
                            <span className={`text-[10px] ${isActive ? 'text-kpu-primary font-bold' : 'text-neutral-500 group-hover:text-kpu-primary transition-colors'}`}>
                                {item.label}
                            </span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
