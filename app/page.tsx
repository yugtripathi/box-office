import { MovieCard } from "@/components/features/MovieCard";
import { getLatestReleases, TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, Play, Star, Sparkles, Film, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/format";

export default async function Home() {
  const latestData = await getLatestReleases();
  const latestMovies = latestData?.results?.slice(0, 12) || [];

  // Get featured movie (first one with backdrop)
  const featuredMovie = latestMovies.find((m: any) => m.backdrop_path) || latestMovies[0];

  // Get movies with daily collections from DB for live counter
  const moviesWithCollections = await db.dailyBoxOffice.groupBy({
    by: ['movieId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3
  });

  // Map movie IDs to titles from TMDB data
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
                CINEMATIC HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        {featuredMovie?.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`${TMDB_IMAGE_BASE_URL}${featuredMovie.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays for Cinematic Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-background/30" />
          </div>
        )}

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[hsl(45,93%,52%)]" />
                <span className="text-sm font-semibold text-[hsl(45,93%,52%)] uppercase tracking-wider">Now Showing</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              {featuredMovie?.title || "Box Office Tracker"}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
              {featuredMovie?.overview || "Track real-time box office collections of the latest Bollywood releases."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${featuredMovie?.id}`}>
                <Button size="lg" className="gap-2 rounded-full px-8 shadow-lg shadow-primary/30">
                  <Play className="h-5 w-5 fill-current" /> View Details
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-8">
                  <Film className="h-5 w-5" /> Browse Movies
                </Button>
              </Link>
            </div>

            {/* Featured Movie Stats */}
            {featuredMovie && (
              <div className="flex items-center gap-6 mt-12 p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 max-w-fit">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-[hsl(45,93%,52%)] text-[hsl(45,93%,52%)]" />
                  <span className="font-bold text-xl">{featuredMovie.vote_average?.toFixed(1)}</span>
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
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                LIVE BOX OFFICE COUNTER SECTION
            ═══════════════════════════════════════════════════════════════ */}
      {liveCounterData.length > 0 && (
        <section className="container mx-auto px-4 -mt-20 relative z-20 mb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {liveCounterData.map((movie: { id: number; title: string; total: bigint; poster: string | undefined }, idx: number) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${idx === 0
                  ? 'bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
                  : 'bg-gradient-to-br from-[hsl(142,71%,45%)]/10 via-card to-card border border-[hsl(142,71%,45%)]/20 hover:border-[hsl(142,71%,45%)]/40'
                  }`}>
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${idx === 0 ? 'bg-[hsl(45,93%,52%)] text-black' :
                      idx === 1 ? 'bg-gray-400 text-black' :
                        'bg-amber-700 text-white'
                      }`}>
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${idx === 0 ? 'bg-primary' : 'bg-[hsl(142,71%,45%)]'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${idx === 0 ? 'bg-primary' : 'bg-[hsl(142,71%,45%)]'}`}></span>
                    </span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${idx === 0 ? 'text-primary' : 'text-[hsl(142,71%,45%)]'}`}>Live Collection</span>
                  </div>

                  {/* Movie Title */}
                  <h3 className="text-lg font-bold truncate mb-3 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>

                  {/* Collection Amount */}
                  <div className={`text-3xl md:text-4xl font-black tabular-nums ${idx === 0 ? 'text-primary' : 'text-[hsl(142,71%,45%)]'}`}>
                    {formatINR(movie.total)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-1.5 mt-4 text-muted-foreground text-sm">
                    <TrendingUp className={`h-4 w-4 ${idx === 0 ? 'text-primary' : 'text-[hsl(142,71%,45%)]'}`} />
                    <span>Total Collection</span>
                  </div>

                  {/* Background Glow */}
                  <div className={`absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${idx === 0 ? 'bg-primary/20' : 'bg-[hsl(142,71%,45%)]/20'}`} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
                LATEST RELEASES SECTION
            ═══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">In Theaters</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Latest Releases</h2>
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

      {/* ═══════════════════════════════════════════════════════════════
                MORE MOVIES SECTION
            ═══════════════════════════════════════════════════════════════ */}
      {latestMovies.length > 6 && (
        <section className="container mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-5 w-5 text-[hsl(45,93%,52%)]" />
            <h2 className="text-2xl md:text-3xl font-bold">More Movies</h2>
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
