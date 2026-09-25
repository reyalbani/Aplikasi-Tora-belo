import { Search } from 'lucide-react';

interface SearchServicesProps {
    value: string;
    onChange: (val: string) => void;
}

export function SearchServices({ value, onChange }: SearchServicesProps) {
    return (
        <div className="relative max-w-lg mx-auto mt-6 mb-8 sm:mb-10 w-full px-2 sm:px-0">
            <div className="group relative flex items-center w-full h-[52px] rounded-full bg-white border border-neutral-200/80 shadow-sm hover:border-neutral-300 hover:shadow-md focus-within:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.12)] focus-within:border-kpu-primary/40 focus-within:ring-4 focus-within:ring-kpu-primary/10 transition-all duration-300">
                <div className="grid place-items-center h-full w-14 text-neutral-400 group-focus-within:text-kpu-primary transition-colors duration-300">
                    <Search className="h-[20px] w-[20px]" strokeWidth={2} />
                </div>
                <input
                    className="peer h-full w-full outline-none text-[15px] text-neutral-800 bg-transparent pr-5 placeholder:text-neutral-400 font-medium rounded-r-full"
                    type="text"
                    id="search"
                    placeholder="Cari layanan yang Anda butuhkan..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
