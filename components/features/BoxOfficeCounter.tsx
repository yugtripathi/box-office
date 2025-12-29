"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for simulation - kept for list of what to track
const MOCK_LIVE_MOVIES = [
    { id: 1, title: "Pathaan" },
    { id: 2, title: "Jawan" },
    { id: 3, title: "Animal" },
];

export function BoxOfficeCounter() {
    const [collections, setCollections] = React.useState<Record<number, number>>({
        1: 1540320,
        2: 890400,
        3: 450100,
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/boxoffice/today');
                if (res.ok) {
                    const data = await res.json();
                    const cleanData: Record<number, number> = {};
                    Object.keys(data).forEach(key => {
                        cleanData[Number(key)] = Number(data[key]);
                    });
                    setCollections(cleanData);
                }
            } catch (error) {
                console.error("Failed to fetch live stats", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_LIVE_MOVIES.map((movie) => (
                <Card key={movie.id} className="overflow-hidden border-l-4 border-l-primary/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {movie.title}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tabular-nums">
                            ${Math.floor(collections[movie.id] || 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                            Live estimate (Today)
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
