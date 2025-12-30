import { SkeletonRow, SkeletonHero } from "@/components/ui/skeleton-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <SkeletonHero />

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
                <SkeletonRow />
            </div>
        </div>
    );
}
