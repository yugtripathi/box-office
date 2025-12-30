'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Star, Zap, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
    autoPlayInterval?: number;
}

// Floating particle component - renders only on client to avoid hydration mismatch
function FloatingParticles() {
    const [particles, setParticles] = React.useState<Array<{
        left: string;
        top: string;
        duration: string;
        delay: string;
    }>>([]);

    React.useEffect(() => {
        // Generate random positions only on client
        const generated = [...Array(20)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
            duration: `${8 + Math.random() * 10}s`,
            delay: `${Math.random() * 8}s`,
        }));
        setParticles(generated);
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        animation: `float-particle ${particle.duration} linear infinite`,
                        animationDelay: particle.delay,
                    }}
                />
            ))}
        </div>
    );
}

export function HeroCarousel({ movies, autoPlayInterval = 8000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    const validMovies = movies.filter(m => m.backdrop_path);
    const currentMovie = validMovies[currentIndex] || movies[0];

    // Auto-rotate with transition state
    React.useEffect(() => {
        if (!isAutoPlaying || validMovies.length <= 1) return;

        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % validMovies.length);
                setIsTransitioning(false);
            }, 500);
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [isAutoPlaying, validMovies.length, autoPlayInterval]);

    const goToPrev = () => {
        setIsAutoPlaying(false);
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => (prev - 1 + validMovies.length) % validMovies.length);
            setIsTransitioning(false);
        }, 300);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % validMovies.length);
            setIsTransitioning(false);
        }, 300);
    };

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 300);
    };

    if (!currentMovie) return null;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <section className="relative min-h-[100vh] flex items-center overflow-hidden">
            {/* Background Image with Ken Burns Effect */}
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
                            className={`w-full h-full object-cover ${idx === currentIndex ? 'animate-ken-burns' : ''
                                }`}
                        />
                    </div>
                ))}

                {/* Multi-layer gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan/5" />

                {/* Cinematic vignette effect */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
                }} />

                {/* Animated noise texture overlay for film grain effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Animated Glow Orbs */}
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-primary/40 to-violet-500/30 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-cyan/30 to-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-pink/20 to-primary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

            {/* Main Content */}
            <div className="container mx-auto px-4 relative z-10 py-20">
                <div className="max-w-3xl">
                    {/* Animated Badge */}
                    <div className={`flex items-center gap-3 mb-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                        }`}>
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/30 via-violet-500/20 to-cyan/30 border border-primary/30 backdrop-blur-md animate-border-glow">
                            <Zap className="h-4 w-4 text-cyan" />
                            <span className="text-sm font-bold text-gradient uppercase tracking-widest">Now Trending</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-400">LIVE</span>
                        </div>
                    </div>

                    {/* Title with enhanced styling */}
                    <h1
                        key={currentMovie.id}
                        className={`font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05] text-white transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                            }`}
                        style={{
                            textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.2)'
                        }}
                    >
                        {currentMovie.title}
                    </h1>

                    {/* Description with glass pill styling */}
                    <div className={`transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
                        }`}>
                        <p
                            key={`desc-${currentMovie.id}`}
                            className="text-lg md:text-xl text-gray-300 mb-10 line-clamp-3 leading-relaxed max-w-2xl"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                            {currentMovie.overview}
                        </p>
                    </div>

                    {/* CTA Buttons with glow */}
                    <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-500 delay-150 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
                        }`}>
                        <Link href={`/movie/${currentMovie.id}`}>
                            <Button size="lg" className="gap-2 rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105">
                                <Play className="h-5 w-5 fill-current" /> View Details
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button size="lg" variant="outline" className="gap-2 rounded-full px-10 py-6 text-lg font-semibold border-white/20 hover:bg-white/10 hover:border-primary/50 transition-all hover:scale-105">
                                <Sparkles className="h-5 w-5" /> Explore All
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Card with enhanced glass effect */}
                    <div className={`inline-flex items-center gap-8 p-6 rounded-3xl glass-strong border border-white/10 transition-all duration-500 delay-200 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
                        }`}>
                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                                <Star className="h-6 w-6 fill-black text-black" />
                            </div>
                            <div>
                                <div className="font-heading font-bold text-2xl text-white">
                                    {currentMovie.vote_average?.toFixed(1)}
                                    <span className="text-sm text-muted-foreground font-normal">/10</span>
                                </div>
                                <div className="text-xs text-muted-foreground">IMDb Rating</div>
                            </div>
                        </div>

                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                        {/* Release Date */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan/30 to-blue-500/30 border border-cyan/30">
                                <Calendar className="h-5 w-5 text-cyan" />
                            </div>
                            <div>
                                <div className="font-heading font-semibold text-lg text-white">
                                    {formatDate(currentMovie.release_date)}
                                </div>
                                <div className="text-xs text-muted-foreground">Release Date</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows - Enhanced */}
            {validMovies.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full glass border border-white/10 hover:border-primary/50 hover:bg-primary/20 transition-all hover:scale-110 group"
                        aria-label="Previous movie"
                    >
                        <ChevronLeft className="h-6 w-6 group-hover:text-primary transition-colors" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full glass border border-white/10 hover:border-primary/50 hover:bg-primary/20 transition-all hover:scale-110 group"
                        aria-label="Next movie"
                    >
                        <ChevronRight className="h-6 w-6 group-hover:text-primary transition-colors" />
                    </button>
                </>
            )}

            {/* Enhanced Slide Indicators */}
            {validMovies.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-full glass">
                        {validMovies.slice(0, 5).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`relative rounded-full transition-all duration-500 ${idx === currentIndex
                                    ? 'w-10 h-3 bg-gradient-to-r from-primary to-cyan'
                                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {idx === currentIndex && (
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-cyan animate-pulse opacity-50" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Fade for seamless transition to content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
}
