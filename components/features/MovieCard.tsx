import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
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
                "group relative block overflow-hidden rounded-2xl bg-card/50 border border-border/30 transition-all duration-300",
                "hover:scale-[1.03] hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20",
                className
            )}
        >
            {/* Poster Container */}
            <div className="relative aspect-[2/3] w-full overflow-hidden">
                {posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${TMDB_IMAGE_LOW_RES_BASE_URL}${posterPath}`}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
                        No Image
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Rating Badge - Gradient Gold */}
                {rating && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg">
                        <Star className="h-3 w-3 fill-black text-black" />
                        <span className="text-xs font-bold text-black">{rating}</span>
                    </div>
                )}

                {/* Year Badge */}
                {year && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass text-xs font-medium text-white">
                        {year}
                    </div>
                )}

                {/* Bottom Content on Poster */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-semibold text-sm leading-tight line-clamp-2 text-white group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {/* Revenue Display */}
                    {revenue && revenue > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
                            <Sparkles className="h-3 w-3" />
                            ₹{(revenue / 10000000).toFixed(1)} Cr
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Glow Ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none group-hover:ring-primary/30 transition-all" />
        </Link>
    );
}
