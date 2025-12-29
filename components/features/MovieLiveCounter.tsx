import { db } from "@/lib/db";
import { TrendingUp, Zap, IndianRupee, Calendar } from "lucide-react";
import { formatINR } from "@/lib/format";

interface MovieLiveCounterProps {
    movieId: number;
}

export async function MovieLiveCounter({ movieId }: MovieLiveCounterProps) {
    // Get totals and latest day's collection
    const aggregate = await db.dailyBoxOffice.aggregate({
        where: { movieId },
        _sum: { amount: true },
        _count: true,
        _max: { dayNumber: true, date: true }
    });

    const latestDay = await db.dailyBoxOffice.findFirst({
        where: { movieId },
        orderBy: { date: 'desc' }
    });

    if (!latestDay || !aggregate._sum.amount) {
        return null;
    }

    const totalCollection = aggregate._sum.amount;
    const totalDays = aggregate._count;
    const latestDayNumber = aggregate._max.dayNumber || 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 border border-green-500/30 p-6 backdrop-blur-sm">
            {/* Animated Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                        <Zap className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Box Office Performance</h3>
                        <p className="text-sm text-muted-foreground">India Net Collection</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-500 uppercase tracking-wider">Live</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total Collection */}
                <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <IndianRupee className="h-4 w-4" />
                        <span>Total Collection</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-green-500 tabular-nums tracking-tight">
                        {formatINR(totalCollection)}
                    </div>
                </div>

                {/* Days Running */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Days Running</span>
                    </div>
                    <div className="text-3xl font-bold">{totalDays}</div>
                </div>
            </div>

            {/* Latest Day Card */}
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Day {latestDayNumber}</span>
                    </div>
                    <div className="text-xl font-bold text-green-500">{formatINR(latestDay.amount)}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground">Recorded on</div>
                    <div className="text-sm font-medium">
                        {latestDay.date.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
