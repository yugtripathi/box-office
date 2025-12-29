import { searchMovies } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";

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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8">
                {query ? `Search results for "${query}"` : "Search Movies"}
            </h1>

            {query && movies.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No results found for "{query}". Try a different search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
    );
}
