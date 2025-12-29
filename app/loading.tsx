import { SkeletonRow } from "@/components/ui/skeleton-card";

export default function Loading() {
    return (
        <div className="container py-8 px-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
            <SkeletonRow />
        </div>
    );
}
