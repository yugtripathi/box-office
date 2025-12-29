import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MovieLiveCounterProps {
    movieId: number;
}

export async function MovieLiveCounter({ movieId }: MovieLiveCounterProps) {
    // Get the latest day's collection
    const latestDay = await db.dailyBoxOffice.findFirst({
        where: { movieId },
        orderBy: { date: 'desc' }
    });

    if (!latestDay) {
        return null;
    }

    const formatCurrency = (val: bigint) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(val));
    };

    return (
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Latest Collection (Day {latestDay.dayNumber})
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                    {formatCurrency(latestDay.amount)}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                    Recorded on {latestDay.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            </CardContent>
        </Card>
    );
}
