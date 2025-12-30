import { MovieCard } from "@/components/features/MovieCard";
import { getLatestReleases, TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, Play, Star, Sparkles, Film, Zap, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/format";

export default async function Home() {
  const latestData = await getLatestReleases();
  const latestMovies = latestData?.results?.slice(0, 12) || [];

  const featuredMovie = latestMovies.find((m: any) => m.backdrop_path) || latestMovies[0];

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
                GEN-Z HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        {featuredMovie?.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`${TMDB_IMAGE_BASE_URL}${featuredMovie.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Gen-Z Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            {/* Subtle color tint */}
            <div className="absolute inset-0 bg-primary/5" />
          </div>
        )}

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            {/* Trending Badge */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-cyan/20 border border-primary/30 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-cyan" />
                <span className="text-sm font-semibold text-gradient uppercase tracking-wider">Now Trending</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              {featuredMovie?.title || "Box Office Tracker"}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 line-clamp-3 leading-relaxed">
              {featuredMovie?.overview || "Track real-time box office collections of the latest releases."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${featuredMovie?.id}`}>
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

            {/* Stats Row */}
            {featuredMovie && (
              <div className="flex items-center gap-6 mt-14 p-5 rounded-2xl glass-strong max-w-fit">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-heading font-bold text-2xl">{featuredMovie.vote_average?.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">/10</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <span className="font-semibold">{featuredMovie.release_date}</span>
                  <span className="text-muted-foreground text-sm ml-2">Release</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animated gradient orb */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-primary/30 to-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                LIVE COLLECTION CARDS
            ═══════════════════════════════════════════════════════════════ */}
      {liveCounterData.length > 0 && (
        <section className="container mx-auto px-4 -mt-24 relative z-20 mb-20">
          <div className="grid gap-4 md:grid-cols-3">
            {liveCounterData.map((movie: { id: number; title: string; total: bigint; poster: string | undefined }, idx: number) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] glass-strong ${idx === 0
                    ? 'border-2 border-primary/40 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20'
                    : 'border border-border/50 hover:border-cyan/40 hover:shadow-xl hover:shadow-cyan/10'
                  }`}>
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-lg ${idx === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black' :
                        idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                          'bg-gradient-to-r from-amber-700 to-orange-700 text-white'
                      }`}>
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${idx === 0 ? 'bg-primary' : 'bg-emerald-500'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${idx === 0 ? 'bg-primary' : 'bg-emerald-500'}`}></span>
                    </span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${idx === 0 ? 'text-primary' : 'text-emerald-500'}`}>Live Collection</span>
                  </div>

                  {/* Movie Title */}
                  <h3 className="font-heading text-lg font-bold truncate mb-3 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>

                  {/* Collection Amount */}
                  <div className={`font-heading text-3xl md:text-4xl font-bold tabular-nums ${idx === 0 ? 'text-gradient' : 'text-emerald-400'}`}>
                    {formatINR(movie.total)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-1.5 mt-4 text-muted-foreground text-sm">
                    <TrendingUp className={`h-4 w-4 ${idx === 0 ? 'text-primary' : 'text-emerald-500'}`} />
                    <span>Total Collection</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
                LATEST RELEASES
            ═══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">In Theaters</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">Latest Releases</h2>
          </div>
          <Link href="/top" className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-semibold group">
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {latestMovies.slice(0, 6).map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              voteAverage={movie.vote_average}
              releaseDate={movie.release_date}
            />
          ))}
        </div>
      </section>

      {/* More Movies */}
      {latestMovies.length > 6 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold">More Movies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {latestMovies.slice(6).map((movie: any) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                releaseDate={movie.release_date}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
