import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyCollectionsProps {
    movieId: number;
}

export async function DailyCollections({ movieId }: DailyCollectionsProps) {
    const dailyData = await db.dailyBoxOffice.findMany({
        where: { movieId },
        orderBy: { dayNumber: 'asc' }
    });

    if (dailyData.length === 0) {
        return null;
    }

    // Format currency
    const formatCurrency = (val: bigint) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(val));
    };

    return (
        <Card className="mt-8 border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
            <CardHeader className="px-0 sm:px-6">
                <CardTitle>Daily Box Office Collections</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="h-10 px-4 align-middle font-medium">Day</th>
                                <th className="h-10 px-4 align-middle font-medium">Date</th>
                                <th className="h-10 px-4 align-middle font-medium text-right">Collection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyData.map((day: any) => (
                                <tr key={day.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">Day {day.dayNumber}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="p-4 align-middle text-right font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(day.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
