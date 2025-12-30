import { getMovieDetails } from "@/lib/tmdb";
import { MoveLeft, Star, Calendar, Clock, IndianRupee, Users, Film, Play, ExternalLink } from "lucide-react";
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Movie not found</h1>
                    <p className="text-muted-foreground mb-6">The movie you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/">
                        <Button className="gap-2">
                            <MoveLeft className="h-4 w-4" /> Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const backdropUrl = movie.backdrop_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
        : null;

    return (
        <div className="min-h-screen pb-20">
            {/* ═══════════════════════════════════════════════════════════════
                HERO / BACKDROP SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
                {backdropUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={backdropUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="h-full w-full bg-muted" />
                )}

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/70">
                            <MoveLeft className="h-4 w-4" /> Back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════════════════════════════════════ */}
            <div className="container mx-auto px-4 -mt-40 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 w-52 md:w-72 mx-auto md:mx-0">
                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-card">
                            {movie.poster_path ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center text-muted-foreground">
                                    No Poster
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-16">
                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">{movie.title}</h1>

                        {/* Tagline */}
                        {movie.tagline && (
                            <p className="text-lg text-muted-foreground mb-6 italic">{movie.tagline}</p>
                        )}

                        {/* Meta Pills */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <div className="flex items-center gap-2 bg-[hsl(45,93%,52%)]/10 border border-[hsl(45,93%,52%)]/30 px-4 py-2 rounded-full text-sm">
                                <Star className="h-4 w-4 fill-[hsl(45,93%,52%)] text-[hsl(45,93%,52%)]" />
                                <span className="font-bold text-[hsl(45,93%,52%)]">{movie.vote_average.toFixed(1)}</span>
                                <span className="text-muted-foreground">/ 10</span>
                                <span className="text-muted-foreground text-xs">({movie.vote_count.toLocaleString()})</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{movie.release_date}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{movie.runtime} min</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-3">Overview</h3>
                            <p className="text-muted-foreground leading-relaxed text-base">{movie.overview}</p>
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            TRAILER
                        ═══════════════════════════════════════════════════════ */}
                        {movie.videos?.results?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Play className="h-5 w-5 text-primary" /> Trailer
                                </h3>
                                <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl">
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

                        {/* ═══════════════════════════════════════════════════════
                            FINANCIAL STATS
                        ═══════════════════════════════════════════════════════ */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-border/50 mb-8">
                            <div className="p-4 rounded-xl bg-card border border-border/50">
                                <div className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                    <IndianRupee className="h-3.5 w-3.5" /> Budget
                                </div>
                                <div className="font-bold text-lg">{movie.budget > 0 ? formatINR(movie.budget * 83) : 'N/A'}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-[hsl(142,71%,45%)]/10 border border-[hsl(142,71%,45%)]/20">
                                <div className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                    <IndianRupee className="h-3.5 w-3.5" /> Revenue
                                </div>
                                <div className="font-bold text-lg text-[hsl(142,71%,45%)]">{movie.revenue > 0 ? formatINR(movie.revenue * 83) : 'N/A'}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-card border border-border/50">
                                <div className="text-sm text-muted-foreground mb-1.5">Status</div>
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
                                <span key={g.id} className="px-4 py-2 rounded-full bg-secondary border border-border/50 text-sm font-medium">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    CAST SECTION
                ═══════════════════════════════════════════════════════════════ */}
                {movie.credits?.cast?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" /> Top Cast
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movie.credits.cast.slice(0, 6).map((actor: any) => (
                                <div key={actor.id} className="group bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                                    <div className="aspect-[2/3] bg-muted overflow-hidden">
                                        {actor.profile_path ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="font-semibold text-sm truncate">{actor.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{actor.character}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    SIMILAR MOVIES SECTION
                ═══════════════════════════════════════════════════════════════ */}
                {movie.similar?.results?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Film className="h-6 w-6 text-primary" /> Similar Movies
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
