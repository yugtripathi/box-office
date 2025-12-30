import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Get movies with daily box office collections, grouped by movieId
        const moviesWithCollections = await db.dailyBoxOffice.groupBy({
            by: ['movieId'],
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 10 // Return top 10 movies by collection
        });

        // Convert to object key-value for easy frontend consumption
        const responseData: Record<number, string> = {};
        moviesWithCollections.forEach((item: { movieId: number; _sum: { amount: bigint | null } }) => {
            if (item._sum.amount) {
                responseData[item.movieId] = item._sum.amount.toString();
            }
        });

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error fetching box office data:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
