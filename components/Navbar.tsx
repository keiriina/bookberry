"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { BookOpen, User } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { StrawberryLogo } from './ui/StrawberryLogo';

export function Navbar() {
    const pathname = usePathname();

    const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
        const isActive = pathname === href;
        return (
            <Link href={href} className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold",
                isActive
                    ? "bg-[var(--color-primary-pink)] text-white shadow-sm"
                    : "text-[var(--color-text-muted)] hover:bg-white/50 hover:text-[var(--color-primary-green)]"
            )}>
                <Icon size={18} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-primary-pink)]/20 px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-10 relative">
                        <StrawberryLogo className="w-full h-full" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-[var(--color-text-main)]">
                        Book<span className="text-[var(--color-primary-pink)]">berry</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <NavItem href="/" icon={BookOpen} label="Discover" />
                    <NavItem href="/profile" icon={User} label="My Shelf" />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav >
    );
}
