import { scrapeDailyBoxOffice } from '../lib/scraper';

async function main() {
    const movie = "Jawan";
    const year = "2023";
    console.log(`Testing scraper for ${movie} (${year})...`);

    const data = await scrapeDailyBoxOffice(movie, year);
    console.log(`Found ${data.length} daily entries.`);
    if (data.length > 0) {
        console.log("First 3 entries:", data.slice(0, 3));
        console.log("Last 3 entries:", data.slice(-3));
    } else {
        console.error("Scraper returned no data.");
    }
}

main();
