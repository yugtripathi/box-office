import { db } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { CalendarDays, TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";

interface DailyCollectionsProps {
    movieId: number;
}

export async function DailyCollections({ movieId }: DailyCollectionsProps) {
    const dailyData = await db.dailyBoxOffice.findMany({
        where: { movieId },
        orderBy: { dayNumber: 'desc' } // Show newest first
    });

    if (dailyData.length === 0) {
        return null;
    }

    // Find max for progress bar scaling
    const maxAmount = Math.max(...dailyData.map((d: any) => Number(d.amount)));

    // Calculate trend between consecutive days
    const getTrend = (current: any, previous: any) => {
        if (!previous) return 'neutral';
        const curr = Number(current.amount);
        const prev = Number(previous.amount);
        if (curr > prev) return 'up';
        if (curr < prev) return 'down';
        return 'neutral';
    };

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Daily Collections</h3>
                    <p className="text-sm text-muted-foreground">{dailyData.length} days tracked</p>
                </div>
            </div>

            {/* Collection Cards Grid */}
            <div className="grid gap-3">
                {dailyData.map((day: any, idx: number) => {
                    const percentage = (Number(day.amount) / maxAmount) * 100;
                    const previousDay = dailyData[idx + 1]; // Since sorted desc
                    const trend = getTrend(day, previousDay);
                    const isTopDay = Number(day.amount) === maxAmount;

                    return (
                        <div
                            key={day.id}
                            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01] ${isTopDay
                                    ? 'bg-gradient-to-r from-[hsl(45,93%,52%)]/10 via-card to-card border-[hsl(45,93%,52%)]/30 hover:border-[hsl(45,93%,52%)]/50'
                                    : 'bg-card border-border/50 hover:border-primary/30'
                                }`}
                        >
                            {/* Progress Bar Background */}
                            <div
                                className={`absolute inset-y-0 left-0 transition-all duration-500 ${isTopDay ? 'bg-[hsl(45,93%,52%)]/10' : 'bg-primary/5'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            />

                            {/* Content */}
                            <div className="relative flex items-center justify-between p-4">
                                {/* Left: Day Info */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${isTopDay
                                            ? 'bg-[hsl(45,93%,52%)]/20 text-[hsl(45,93%,52%)]'
                                            : 'bg-muted text-foreground'
                                        }`}>
                                        <span className="text-[10px] uppercase tracking-wider opacity-70">Day</span>
                                        <span className="text-xl">{day.dayNumber}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {day.date.toLocaleDateString('en-IN', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {day.date.toLocaleDateString('en-IN', { year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Amount & Trend */}
                                <div className="flex items-center gap-4">
                                    {/* Trend Indicator */}
                                    {previousDay && (
                                        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-[hsl(142,71%,45%)]' :
                                                trend === 'down' ? 'text-[hsl(0,84%,60%)]' : 'text-muted-foreground'
                                            }`}>
                                            {trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                            {trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                            {trend === 'neutral' && <Minus className="h-4 w-4" />}
                                        </div>
                                    )}

                                    {/* Amount */}
                                    <div className={`text-right ${isTopDay ? 'text-[hsl(45,93%,52%)]' : ''}`}>
                                        <div className="text-lg md:text-xl font-bold tabular-nums">
                                            {formatINR(day.amount)}
                                        </div>
                                        {isTopDay && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-[hsl(45,93%,52%)] uppercase tracking-wider">
                                                <Trophy className="h-3 w-3" />
                                                Best Day
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
