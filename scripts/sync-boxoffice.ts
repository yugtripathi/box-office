import { getLatestReleases } from '../lib/tmdb';
import { scrapeDailyBoxOffice } from '../lib/scraper';
import { db } from '../lib/db';

async function main() {
    console.log("Starting Daily Sync (CLI)...");

    try {
        const data = await getLatestReleases();

        if (!data || !data.results) {
            console.error("Failed to fetch movies from TMDB");
            return;
        }

        console.log(`Fetched ${data.results.length} movies from TMDB (Late 2025).`);

        for (const movie of data.results) {
            if (!movie.release_date) continue;

            const releaseYear = movie.release_date.split('-')[0];
            console.log(`Processing: ${movie.title} (${releaseYear})...`);

            const dailyData = await scrapeDailyBoxOffice(movie.title, releaseYear);

            if (dailyData.length > 0) {
                console.log(`  Found ${dailyData.length} records. Syncing to DB...`);
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
                console.log(`  Synced ${count} days.`);
            } else {
                console.log(`  No daily data found via scraper for ${movie.title}`);
            }

            await new Promise(r => setTimeout(r, 500));
        }
        console.log("Sync Complete");
    } catch (e) {
        console.error("Sync Error:", e);
    }
}

main().catch(console.error);
