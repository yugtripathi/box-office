import { getMovieDetails } from "@/lib/tmdb";
import { MoveLeft, Star, Calendar, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TMDB_IMAGE_BASE_URL, TMDB_IMAGE_LOW_RES_BASE_URL } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";
import { DailyCollections } from "@/components/features/DailyCollections";
import { MovieLiveCounter } from "@/components/features/MovieLiveCounter";
import { formatINR } from "@/lib/format";

interface MoviePageProps {
    params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
    const { id } = await params;
    const movie = await getMovieDetails(id);

    if (!movie) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Movie not found</h1>
                <Link href="/" className="text-primary hover:underline mt-4 block">
                    Return Home
                </Link>
            </div>
        );
    }

    const backdropUrl = movie.backdrop_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
        : null;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero / Backdrop */}
            <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden bg-muted">
                {backdropUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover opacity-50 dark:opacity-30"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute top-4 left-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-1">
                            <MoveLeft className="h-4 w-4" /> Back
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 w-48 md:w-72 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl border-4 border-background">
                        {movie.poster_path ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-auto"
                            />
                        ) : (
                            <div className="w-full h-[400px] bg-muted flex items-center justify-center text-muted-foreground">No Poster</div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-12">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-lg text-muted-foreground mb-6 italic">{movie.tagline}</p>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span>{movie.vote_average.toFixed(1)} / 10 ({movie.vote_count})</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                                <Calendar className="h-4 w-4" />
                                <span>{movie.release_date}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                                <Clock className="h-4 w-4" />
                                <span>{movie.runtime} min</span>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-8">
                            <h3 className="text-xl font-semibold mb-2">Overview</h3>
                            <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                        </div>

                        {/* Trailer */}
                        {movie.videos?.results?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black/50">
                                    {(() => {
                                        const trailer = movie.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || movie.videos.results[0];
                                        return trailer ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                                title={trailer.name}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-border mb-8">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                    <IndianRupee className="h-3 w-3" /> Budget
                                </div>
                                <div className="font-bold text-lg">{formatINR(movie.budget)}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/10">
                                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                    <IndianRupee className="h-3 w-3" /> Revenue
                                </div>
                                <div className="font-bold text-lg text-green-500">{formatINR(movie.revenue)}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <div className="text-sm text-muted-foreground mb-1">Status</div>
                                <div className="font-bold text-lg">{movie.status}</div>
                            </div>
                        </div>

                        {/* Live Counter (Movie Specific) */}
                        <div className="mb-8">
                            <MovieLiveCounter movieId={movie.id} />
                        </div>

                        {/* Daily Collections */}
                        <div className="mb-8">
                            <DailyCollections movieId={movie.id} />
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {movie.genres.map((g: any) => (
                                <span key={g.id} className="px-3 py-1 rounded-full border border-border text-xs font-medium">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cast */}
                {movie.credits?.cast?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movie.credits.cast.slice(0, 6).map((actor: any) => (
                                <div key={actor.id} className="bg-card rounded-lg overflow-hidden border">
                                    <div className="aspect-[2/3] bg-muted">
                                        {actor.profile_path ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <div className="font-medium text-sm truncate">{actor.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{actor.character}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Movies */}
                {movie.similar?.results?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {movie.similar.results.slice(0, 5).map((m: any) => (
                                <MovieCard
                                    key={m.id}
                                    id={m.id}
                                    title={m.title}
                                    posterPath={m.poster_path}
                                    voteAverage={m.vote_average}
                                    releaseDate={m.release_date}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
