import { getLatestReleases } from '@/lib/tmdb';
import { scrapeDailyBoxOffice } from '@/lib/scraper';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log("Starting Daily Sync...");
        const data = await getLatestReleases();

        if (!data || !data.results) {
            return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
        }

        const results = [];

        for (const movie of data.results) {
            // Only process if we have a valid release date
            if (!movie.release_date) continue;

            const releaseYear = movie.release_date.split('-')[0];
            console.log(`Syncing ${movie.title} (${releaseYear})...`);

            const dailyData = await scrapeDailyBoxOffice(movie.title, releaseYear);

            if (dailyData.length > 0) {
                let count = 0;
                for (const item of dailyData) {
                    const actualDate = new Date(movie.release_date);
                    actualDate.setDate(actualDate.getDate() + (item.day - 1));

                    await db.dailyBoxOffice.upsert({
                        where: {
                            movieId_date: {
                                movieId: movie.id,
                                date: actualDate
                            }
                        },
                        update: {
                            amount: item.amount,
                            dayNumber: item.day
                        },
                        create: {
                            movieId: movie.id,
                            date: actualDate,
                            amount: item.amount,
                            dayNumber: item.day
                        }
                    });
                    count++;
                }
                results.push({ id: movie.id, title: movie.title, daysSynced: count });
            } else {
                results.push({ id: movie.id, title: movie.title, status: 'No data found' });
            }

            // Be nice to the source
            await new Promise(r => setTimeout(r, 500));
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error("Sync Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
