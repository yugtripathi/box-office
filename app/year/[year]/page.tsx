import { getMoviesByYear } from "@/lib/tmdb";
import { MovieCard } from "@/components/features/MovieCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface YearPageProps {
    params: Promise<{ year: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
    const { year } = await params;
    const data = await getMoviesByYear(year);
    const movies = data?.results || [];

    const currentYear = parseInt(year);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Box Office: {year}</h1>
                    <p className="text-muted-foreground">Top movies released in {year} by revenue.</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/year/${currentYear - 1}`}>
                        <Button variant="outline" size="sm">Previous</Button>
                    </Link>
                    <Link href={`/year/${currentYear + 1}`}>
                        <Button variant="outline" size="sm">Next</Button>
                    </Link>
                </div>
            </div>

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
        </div>
    );
}
