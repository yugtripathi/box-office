import Link from "next/link";
import { Star } from "lucide-react";
import { TMDB_IMAGE_LOW_RES_BASE_URL } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string | null;
    voteAverage: number;
    releaseDate: string;
    className?: string; // Add className prop
}

export function MovieCard({ id, title, posterPath, voteAverage, releaseDate, className }: MovieCardProps) {
    return (
        <Link href={`/movie/${id}`} className={cn("group relative block overflow-hidden rounded-lg bg-card border shadow-sm transition-all hover:scale-[1.02] hover:shadow-md", className)}>
            <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
                {posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${posterPath}`}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-3">
                <h3 className="line-clamp-1 font-semibold text-sm leading-none">{title}</h3>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                    <div className="flex items-center gap-1 text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        <span>{voteAverage ? voteAverage.toFixed(1) : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
