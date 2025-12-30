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
    revenue?: number;
    className?: string;
}

export function MovieCard({ id, title, posterPath, voteAverage, releaseDate, revenue, className }: MovieCardProps) {
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
    const rating = voteAverage ? voteAverage.toFixed(1) : null;

    return (
        <Link
            href={`/movie/${id}`}
            className={cn(
                "group relative block overflow-hidden rounded-2xl bg-card border border-border/30 transition-all duration-300",
                "hover:scale-[1.03] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
                className
            )}
        >
            {/* Poster Container */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                {posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${posterPath}`}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No Image
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating Badge - Gold */}
                {rating && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-[hsl(45,93%,52%)]/30">
                        <Star className="h-3 w-3 fill-[hsl(45,93%,52%)] text-[hsl(45,93%,52%)]" />
                        <span className="text-xs font-bold text-[hsl(45,93%,52%)]">{rating}</span>
                    </div>
                )}

                {/* Year Badge */}
                {year && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-xs font-medium text-white/80">
                        {year}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Optional Revenue Display */}
                {revenue && revenue > 0 && (
                    <div className="text-xs font-medium text-primary">
                        ₹{(revenue / 10000000).toFixed(1)} Cr
                    </div>
                )}
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </Link>
    );
}
