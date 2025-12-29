import { MovieCard } from "@/components/features/MovieCard";
import { getLatestReleases, TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, Play, Star, Sparkles } from "lucide-react";
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
  const liveCounterData = moviesWithCollections.map((item) => {
    const movie = latestMovies.find((m: any) => m.id === item.movieId);
    return {
      id: item.movieId,
      title: movie?.title || `Movie ${item.movieId}`,
      total: item._sum.amount || BigInt(0),
      poster: movie?.poster_path
    };
  }).filter(m => m.total > 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        {featuredMovie?.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`${TMDB_IMAGE_BASE_URL}${featuredMovie.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          </div>
        )}

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Now Showing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              {featuredMovie?.title || "Box Office Tracker"}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 line-clamp-3">
              {featuredMovie?.overview || "Track real-time box office collections of the latest Bollywood releases."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${featuredMovie?.id}`}>
                <Button size="lg" className="gap-2 rounded-full px-8 bg-primary hover:bg-primary/90">
                  <Play className="h-5 w-5 fill-current" /> View Details
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 border-white/20 hover:bg-white/10">
                  Search Movies
                </Button>
              </Link>
            </div>

            {/* Featured Movie Stats */}
            {featuredMovie && (
              <div className="flex items-center gap-6 mt-10 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-fit">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-lg">{featuredMovie.vote_average?.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">Rating</span>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="font-bold">{featuredMovie.release_date}</span>
                  <span className="text-muted-foreground text-sm ml-2">Release</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Box Office Counter Section */}
      {liveCounterData.length > 0 && (
        <section className="container mx-auto px-4 -mt-20 relative z-20">
          <div className="grid gap-4 md:grid-cols-3">
            {liveCounterData.map((movie, idx) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-background to-background border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300 hover:scale-[1.02]">
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 font-bold">#{idx + 1}</span>
                  </div>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-green-500 font-medium uppercase tracking-wider">Live Collection</span>
                  </div>

                  <h3 className="text-lg font-bold truncate mb-2 group-hover:text-green-500 transition-colors">
                    {movie.title}
                  </h3>

                  <div className="text-3xl font-black text-green-500 tabular-nums">
                    {formatINR(movie.total)}
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Total Collection</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Releases Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Latest Releases</h2>
            <p className="text-muted-foreground text-lg">New in theaters now</p>
          </div>
          <Link href="/top" className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium group">
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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

      {/* More Movies Grid */}
      {latestMovies.length > 6 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold mb-8">More Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
