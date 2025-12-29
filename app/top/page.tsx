import { getTopGrossingMovies, TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { formatINR } from "@/lib/format";

interface TopGrossingPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function TopGrossingPage(props: TopGrossingPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const data = await getTopGrossingMovies(page);
    const movies = data?.results || [];

    // Get featured movie for hero section
    const featuredMovie = movies[0];

    return (
        <div className="min-h-screen pb-10">
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-end overflow-hidden">
                {featuredMovie?.backdrop_path && (
                    <div className="absolute inset-0">
                        <img
                            src={`${TMDB_IMAGE_BASE_URL}${featuredMovie.backdrop_path}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                    </div>
                )}
                <div className="container mx-auto px-4 pb-8 relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-yellow-500/20">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                        </div>
                        <span className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Highest Grossing</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Top Grossing Bollywood Movies</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">The biggest box office hits from Bollywood cinema.</p>
                </div>
            </section>

            {/* Movies Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                    {movies.map((movie: any, idx: number) => (
                        <div key={movie.id} className="relative group">
                            {/* Rank Badge */}
                            {page === 1 && idx < 3 && (
                                <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${idx === 0 ? 'bg-yellow-500 text-black' :
                                        idx === 1 ? 'bg-gray-300 text-black' :
                                            'bg-amber-600 text-white'
                                    }`}>
                                    #{idx + 1}
                                </div>
                            )}
                            <MovieCard
                                id={movie.id}
                                title={movie.title}
                                posterPath={movie.poster_path}
                                voteAverage={movie.vote_average}
                                releaseDate={movie.release_date}
                            />
                            {/* Revenue Badge */}
                            {movie.revenue > 0 && (
                                <div className="mt-2 text-center">
                                    <span className="text-xs text-green-500 font-medium">
                                        {formatINR(movie.revenue)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4">
                    <Link href={`/top?page=${page > 1 ? page - 1 : 1}`}>
                        <Button
                            variant="outline"
                            disabled={page <= 1}
                            className="gap-2 rounded-full px-6"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                    </Link>
                    <span className="flex items-center px-6 py-2 rounded-full bg-muted font-medium">
                        Page {page}
                    </span>
                    <Link href={`/top?page=${page + 1}`}>
                        <Button variant="outline" className="gap-2 rounded-full px-6">
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
