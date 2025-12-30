'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchSuggestions } from '@/components/features/SearchSuggestions';

export function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? 'glass-strong shadow-lg shadow-black/10'
                    : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto flex h-16 items-center px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 mr-8 group">
                    <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-cyan group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:flex items-baseline gap-1">
                        <span className="font-heading font-bold text-xl tracking-tight">Box</span>
                        <span className="font-heading font-bold text-xl tracking-tight text-gradient">Office</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1 mr-auto">
                    <Link href="/top">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Trending</span>
                        </Button>
                    </Link>
                    <Link href="/year/2025">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                            <Sparkles className="h-4 w-4" />
                            <span className="hidden sm:inline">2025</span>
                        </Button>
                    </Link>
                    <Link href="/year/2024" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/10">
                            2024
                        </Button>
                    </Link>
                </nav>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <SearchSuggestions />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden hover:bg-primary/10"
                        onClick={() => router.push('/search')}
                    >
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
