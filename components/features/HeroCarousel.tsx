'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '@/lib/tmdb';

interface Movie {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
}

interface HeroCarouselProps {
    movies: Movie[];
    autoPlayInterval?: number; // in milliseconds
}

export function HeroCarousel({ movies, autoPlayInterval = 8000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

    // Filter movies with backdrop
    const validMovies = movies.filter(m => m.backdrop_path);
    const currentMovie = validMovies[currentIndex] || movies[0];

    // Auto-rotate
    React.useEffect(() => {
        if (!isAutoPlaying || validMovies.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % validMovies.length);
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [isAutoPlaying, validMovies.length, autoPlayInterval]);

    const goToPrev = () => {
        setIsAutoPlaying(false);
        setCurrentIndex(prev => (prev - 1 + validMovies.length) % validMovies.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex(prev => (prev + 1) % validMovies.length);
    };

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    if (!currentMovie) return null;

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Image with Transition */}
            <div className="absolute inset-0">
                {validMovies.map((movie, idx) => (
                    <div
                        key={movie.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={`${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {/* Gradient Overlays - Strong dark overlay for text visibility on any image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                {/* Extra dark patch on left for text area */}
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/80 to-transparent" />
                {/* Subtle color tint */}
                <div className="absolute inset-0 bg-primary/5" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 py-20">
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-cyan/20 border border-primary/30 backdrop-blur-sm">
                            <Zap className="h-4 w-4 text-cyan" />
                            <span className="text-sm font-semibold text-gradient uppercase tracking-wider">Now Trending</span>
                        </div>
                    </div>

                    {/* Title with fade transition - text shadow for extra visibility */}
                    <h1
                        key={currentMovie.id}
                        className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] animate-in fade-in-0 slide-in-from-bottom-4 duration-500 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                        {currentMovie.title}
                    </h1>

                    {/* Description - with text shadow for readability */}
                    <p
                        key={`desc-${currentMovie.id}`}
                        className="text-lg md:text-xl text-gray-200 mb-10 line-clamp-3 leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                        {currentMovie.overview}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link href={`/movie/${currentMovie.id}`}>
                            <Button size="lg" className="gap-2 rounded-full px-8">
                                <Play className="h-5 w-5 fill-current" /> Watch Details
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button size="lg" variant="outline" className="gap-2 rounded-full px-8">
                                <Sparkles className="h-5 w-5" /> Explore
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-14 p-5 rounded-2xl glass-strong max-w-fit">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                            <span className="font-heading font-bold text-2xl">{currentMovie.vote_average?.toFixed(1)}</span>
                            <span className="text-muted-foreground text-sm">/10</span>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                            <span className="font-semibold">{currentMovie.release_date}</span>
                            <span className="text-muted-foreground text-sm ml-2">Release</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {validMovies.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
                        aria-label="Previous movie"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
                        aria-label="Next movie"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Slide Indicators */}
            {validMovies.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {validMovies.slice(0, 5).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Animated gradient orb */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-primary/30 to-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
        </section>
    );
}
