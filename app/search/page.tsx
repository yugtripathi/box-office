import { searchMovies } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";
import { Search, Film } from "lucide-react";

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = params.q || "";

    let movies = [];
    if (query) {
        const data = await searchMovies(query);
        movies = data?.results || [];
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-card to-background border-b border-border/50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                            <Search className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Search Results</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        {query ? (
                            <>Results for <span className="text-primary">&quot;{query}&quot;</span></>
                        ) : (
                            "Search Movies"
                        )}
                    </h1>
                    {query && movies.length > 0 && (
                        <p className="text-muted-foreground mt-2">{movies.length} movies found</p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {!query ? (
                    <div className="text-center py-20">
                        <Film className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Enter a search term to find movies</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-20">
                        <Film className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground">No movies found for &quot;{query}&quot;. Try a different search term.</p>
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
