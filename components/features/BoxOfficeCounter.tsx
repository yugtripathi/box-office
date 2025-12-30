"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/format";

// Mock data for simulation - kept for list of what to track
const MOCK_LIVE_MOVIES = [
    { id: 1, title: "Pathaan" },
    { id: 2, title: "Jawan" },
    { id: 3, title: "Animal" },
];

export function BoxOfficeCounter() {
    const [collections, setCollections] = React.useState<Record<number, number>>({
        1: 1540320000,
        2: 890400000,
        3: 450100000,
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
            {MOCK_LIVE_MOVIES.map((movie, idx) => (
                <div
                    key={movie.id}
                    className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-[hsl(45,93%,52%)] text-black' :
                                idx === 1 ? 'bg-gray-400 text-black' :
                                    'bg-amber-700 text-white'
                            }`}>
                            #{idx + 1}
                        </div>
                    </div>

                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs text-primary font-medium uppercase tracking-wider">Live</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h3>

                    {/* Collection Amount */}
                    <div className="text-2xl md:text-3xl font-black text-primary tabular-nums">
                        {formatINR(collections[movie.id] || 0)}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 mt-3 text-muted-foreground text-sm">
                        <TrendingUp className="h-4 w-4 text-[hsl(142,71%,45%)]" />
                        <span>Today&apos;s Estimate</span>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            ))}
        </div>
    );
}
