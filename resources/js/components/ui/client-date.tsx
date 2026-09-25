import { useEffect, useState } from 'react';

interface ClientDateProps {
    date: string | Date;
    format?: 'short' | 'long' | 'datetime';
    className?: string;
}

export function ClientDate({ date, format = 'short', className = '' }: ClientDateProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <span className={className}>...</span>;
    }

    const d = new Date(date);
    let options: Intl.DateTimeFormatOptions = {};

    if (format === 'short') {
        options = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Makassar' };
    } else if (format === 'long') {
        options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' };
    } else if (format === 'datetime') {
        options = { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Makassar' };
    }

    return (
        <span className={className}>
            {d.toLocaleString('id-ID', options)}
        </span>
    );
}
