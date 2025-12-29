'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
    const router = useRouter();
    const [query, setQuery] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <MonitorPlay className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg hidden md:inline-block">BoxOffice</span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium mr-auto">
                    <Link href="/top" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Top Grossing
                    </Link>
                    <Link href="/year/2025" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:inline-block">
                        2025
                    </Link>
                    <Link href="/year/2024" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:inline-block">
                        2024
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search movies..."
                            className="w-[200px] pl-9 md:w-[300px]"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                    {/* Mobile Search Button (could expand) */}
                    <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => router.push('/search')}>
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
