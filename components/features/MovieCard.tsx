import Link from "next/link";
import { Star, Sparkles, Play } from "lucide-react";
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
                "group relative block overflow-hidden rounded-2xl bg-card/50 border border-white/5 transition-all duration-500",
                "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20",
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
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
                        No Image
                    </div>
                )}

                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                    <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-primary/30 border border-white/20">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Rating Badge - Premium Gradient */}
                {rating && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg shadow-amber-500/30 transform group-hover:scale-110 transition-transform">
                        <Star className="h-3.5 w-3.5 fill-black text-black" />
                        <span className="text-xs font-bold text-black">{rating}</span>
                    </div>
                )}

                {/* Year Badge */}
                {year && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl glass text-xs font-semibold text-white shadow-lg transform group-hover:scale-110 transition-transform">
                        {year}
                    </div>
                )}

                {/* Bottom Content on Poster */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform group-hover:translate-y-0 transition-transform">
                    <h3 className="font-heading font-bold text-sm leading-tight line-clamp-2 text-white group-hover:text-primary transition-colors drop-shadow-lg">
                        {title}
                    </h3>

                    {/* Revenue Display */}
                    {revenue && revenue > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                            <Sparkles className="h-3 w-3" />
                            ₹{(revenue / 10000000).toFixed(1)} Cr
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative glow on hover */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-transparent group-hover:to-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />

            {/* Hover Glow Ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none group-hover:ring-primary/30 transition-all duration-500" />
        </Link>
    );
}
