'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, X, Loader2, Sparkles } from 'lucide-react';
import { TMDB_IMAGE_LOW_RES_BASE_URL } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
}

export function SearchSuggestions() {
    const router = useRouter();
    const [query, setQuery] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<Movie[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const timeoutId = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                const results = data?.results?.slice(0, 6) || [];
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Search failed:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' && query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    router.push(`/movie/${suggestions[selectedIndex].id}`);
                    setIsOpen(false);
                    setQuery('');
                } else if (query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleSuggestionClick = (movieId: number) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/movie/${movieId}`);
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative hidden sm:block">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search movies..."
                    className={cn(
                        "w-[280px] md:w-[320px] h-10 pl-10 pr-10 rounded-xl text-sm font-medium",
                        "bg-secondary/50 border border-border/50 text-foreground",
                        "placeholder:text-muted-foreground",
                        "hover:bg-secondary/70 hover:border-primary/30",
                        "focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-200"
                    )}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <X className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#12121a] border border-border/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                        {suggestions.map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleSuggestionClick(movie.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150",
                                    "hover:bg-primary/10 group",
                                    selectedIndex === index && "bg-primary/10"
                                )}
                            >
                                {/* Movie Poster */}
                                <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                    {movie.poster_path ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${movie.poster_path}`}
                                            alt={movie.title}
                                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                            N/A
                                        </div>
                                    )}
                                </div>

                                {/* Movie Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-heading font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                        {movie.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                        </span>
                                        {movie.vote_average > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                <span className="text-xs font-semibold text-yellow-500">
                                                    {movie.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* View All Results Footer */}
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="flex items-center justify-center gap-2 p-3 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors border-t border-border/30"
                        onClick={() => setIsOpen(false)}
                    >
                        <Sparkles className="h-4 w-4" />
                        View all results for &quot;{query}&quot;
                    </Link>
                </div>
            )}

            {/* No Results State */}
            {isOpen && query.length >= 2 && suggestions.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-[#12121a] border border-border/50 rounded-2xl shadow-2xl z-50 text-center animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <p className="text-sm text-muted-foreground">No movies found for &quot;{query}&quot;</p>
                </div>
            )}
        </div>
    );
}
