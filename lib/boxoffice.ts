import { db } from '@/lib/db';

// Simulate "live" growth for demo purposes if no real API
export async function getLiveBoxOffice(movieId: number, baseStartRevenue: number) {
    try {
        // Try to find in DB
        let stats = await db.boxOfficeStats.findUnique({
            where: { movieId }
        });

        if (!stats) {
            // Initial Seed
            stats = await db.boxOfficeStats.create({
                data: {
                    movieId,
                    revenue: BigInt(baseStartRevenue)
                }
            });
        }

        // Check if update needed (simulate live data)
        const now = new Date();
        const diffInSeconds = (now.getTime() - stats.updatedAt.getTime()) / 1000;

        // Update if more than 5 seconds have passed
        if (diffInSeconds > 5) {
            // Simulate increment: e.g., $50-$200 per second
            const ratePerSecond = 100 + Math.random() * 100;
            const increment = Math.floor(ratePerSecond * diffInSeconds);
            const newRevenue = BigInt(stats.revenue) + BigInt(increment);

            stats = await db.boxOfficeStats.update({
                where: { movieId },
                data: {
                    revenue: newRevenue,
                }
            });
        }

        return {
            movieId: stats.movieId,
            revenue: stats.revenue.toString(), // Serialize BigInt for JSON
            lastUpdated: stats.updatedAt
        };
    } catch (error) {
        console.error("Database error in getLiveBoxOffice:", error);
        // Fallback if DB fails
        return {
            movieId,
            revenue: baseStartRevenue.toString(),
            lastUpdated: new Date()
        };
    }
}
