import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col space-y-3", className)}>
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonHero() {
    return (
        <div className="relative min-h-[60vh] flex items-end">
            <Skeleton className="absolute inset-0 rounded-none" />
            <div className="container mx-auto px-4 pb-12 relative z-10 space-y-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-16 w-3/4 rounded-xl" />
                <Skeleton className="h-6 w-1/2 rounded-lg" />
                <div className="flex gap-4 pt-4">
                    <Skeleton className="h-12 w-40 rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
