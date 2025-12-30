import { getMoviesByYear } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Film } from "lucide-react";

interface YearPageProps {
    params: Promise<{ year: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
    const { year } = await params;
    const data = await getMoviesByYear(year);
    const movies = data?.results || [];

    const currentYear = parseInt(year);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-card to-background border-b border-border/50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Yearly Collection</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Box Office <span className="text-primary">{year}</span>
                            </h1>
                            <p className="text-muted-foreground mt-2">Top movies released in {year} by revenue.</p>
                        </div>

                        {/* Year Navigation */}
                        <div className="flex items-center gap-3">
                            <Link href={`/year/${currentYear - 1}`}>
                                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">{currentYear - 1}</span>
                                </Button>
                            </Link>
                            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 font-bold text-primary">
                                {year}
                            </div>
                            <Link href={`/year/${currentYear + 1}`}>
                                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                                    <span className="hidden sm:inline">{currentYear + 1}</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {movies.length === 0 ? (
                    <div className="text-center py-20">
                        <Film className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                        <p className="text-muted-foreground">No movies found for {year}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {movies.map((movie: any) => (
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
                )}
            </div>
        </div>
    );
}
