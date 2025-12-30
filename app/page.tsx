import { MovieCard } from "@/components/features/MovieCard";
import { HeroCarousel } from "@/components/features/HeroCarousel";
import { getLatestReleases } from "@/lib/tmdb";
import Link from "next/link";
import { ArrowRight, TrendingUp, Film, Trophy, Sparkles, Flame, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/format";

export default async function Home() {
  const latestData = await getLatestReleases();
  const latestMovies = latestData?.results?.slice(0, 12) || [];

  // Filter good movies for hero carousel (rated >= 6.0, has backdrop)
  const heroMovies = latestMovies.filter((m: any) =>
    m.backdrop_path &&
    m.vote_average >= 6.0 &&
    !m.title?.toLowerCase().includes('dhurandar')
  ).slice(0, 5);

  const moviesWithCollections = await db.dailyBoxOffice.groupBy({
    by: ['movieId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3
  });

  const liveCounterData = moviesWithCollections.map((item: { movieId: number; _sum: { amount: bigint | null } }) => {
    const movie = latestMovies.find((m: any) => m.id === item.movieId);
    return {
      id: item.movieId,
      title: movie?.title || `Movie ${item.movieId}`,
      total: item._sum.amount || BigInt(0),
      poster: movie?.poster_path
    };
  }).filter((m: { id: number; title: string; total: bigint; poster: string | undefined }) => m.total > 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════
                AUTO-ROTATING HERO CAROUSEL
            ═══════════════════════════════════════════════════════════════ */}
      <HeroCarousel movies={heroMovies} autoPlayInterval={8000} />

      {/* ═══════════════════════════════════════════════════════════════
                LIVE COLLECTION CARDS - Premium Floating Design
            ═══════════════════════════════════════════════════════════════ */}
      {liveCounterData.length > 0 && (
        <section className="container mx-auto px-4 -mt-28 relative z-20 mb-24">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-bold text-gradient uppercase tracking-wider">Box Office Champions</span>
            </div>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-primary/50" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {liveCounterData.map((movie: { id: number; title: string; total: bigint; poster: string | undefined }, idx: number) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.03] card-shine ${idx === 0
                    ? 'glass-strong border-2 border-primary/40 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/30 animate-border-glow'
                    : 'glass border border-white/10 hover:border-cyan/40 hover:shadow-2xl hover:shadow-cyan/15'
                  }`}>
                  {/* Decorative glow orb */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 opacity-30 group-hover:opacity-60 ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-cyan' : 'bg-orange-500'
                    }`} />

                  {/* Rank Badge - 3D Effect */}
                  <div className="absolute top-4 right-4">
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-lg shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-black shadow-yellow-500/30' :
                        idx === 1 ? 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-black shadow-gray-400/30' :
                          'bg-gradient-to-br from-amber-600 via-orange-600 to-orange-700 text-white shadow-orange-500/30'
                      }`}>
                      <span className="relative z-10">#{idx + 1}</span>
                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />
                    </div>
                  </div>

                  {/* Live Indicator - Enhanced */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${idx === 0 ? 'bg-primary' : 'bg-emerald-500'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${idx === 0 ? 'bg-primary' : 'bg-emerald-500'}`}></span>
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${idx === 0 ? 'text-primary' : 'text-emerald-500'}`}>
                      Live Collection
                    </span>
                  </div>

                  {/* Movie Title */}
                  <h3 className="font-heading text-xl font-bold truncate mb-4 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>

                  {/* Collection Amount - Big & Bold */}
                  <div className={`font-heading text-4xl md:text-5xl font-bold tabular-nums mb-2 ${idx === 0 ? 'text-gradient' : 'text-emerald-400'
                    }`}>
                    {formatINR(movie.total)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <TrendingUp className={`h-4 w-4 ${idx === 0 ? 'text-primary' : 'text-emerald-500'}`} />
                      <span>Total Collection</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
                LATEST RELEASES - Cinematic Grid
            ═══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-end justify-between mb-12 relative">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan/20 border border-primary/30">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-primary uppercase tracking-wider">In Theaters</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Latest <span className="text-gradient">Releases</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">Discover the newest blockbusters hitting the big screen</p>
          </div>
          <Link href="/top" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all group">
            <span className="text-sm font-semibold">View All</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {latestMovies.slice(0, 6).map((movie: any, idx: number) => (
            <div key={movie.id} className="hover-lift" style={{ animationDelay: `${idx * 100}ms` }}>
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                releaseDate={movie.release_date}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                MORE MOVIES - Extended Grid
            ═══════════════════════════════════════════════════════════════ */}
      {latestMovies.length > 6 && (
        <section className="container mx-auto px-4 pb-24 relative">
          {/* Decorative divider */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-2 px-5 py-2 rounded-full glass">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-heading text-lg font-bold">More to Explore</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {latestMovies.slice(6).map((movie: any, idx: number) => (
              <div key={movie.id} className="hover-lift" style={{ animationDelay: `${idx * 50}ms` }}>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  releaseDate={movie.release_date}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
                FOOTER CTA - Premium Call to Action
            ═══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 glass-strong border border-primary/20">
          {/* Background decorations */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-cyan/10 rounded-full blur-3xl animate-pulse-glow" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-cyan" />
              <span className="text-sm font-bold text-gradient uppercase tracking-wider">Discover More</span>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Ready to Explore the <span className="text-gradient">Box Office?</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              Track collections, discover trending movies, and stay updated with real-time box office data.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/search">
                <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all">
                  <Zap className="h-5 w-5" />
                  Start Exploring
                </button>
              </Link>
              <Link href="/top">
                <button className="flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/20 font-semibold hover:bg-white/10 hover:border-primary/40 transition-all hover:scale-105">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Movies
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
