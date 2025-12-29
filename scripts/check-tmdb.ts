
import { fetchFromTMDB } from '../lib/tmdb';

async function checkMovies() {
    console.log("Checking TMDB for late 2025 movies...");
    // Manually constructing URL since lib might not expose everything I want
    // But I can try to use the fetchFromTMDB

    // We need to bypass the specific functions and use fetch directly if possible, 
    // but fetchFromTMDB is exported.

    // Note: The lib reads process.env, so Bun should load .env

    try {
        const data = await fetchFromTMDB('/discover/movie', {
            'primary_release_date.gte': '2025-10-01',
            'primary_release_date.lte': '2025-12-30',
            'with_original_language': 'hi',
            'sort_by': 'popularity.desc'
        });

        if (data && data.results) {
            console.log("Found movies:", data.results.length);
            data.results.slice(0, 5).forEach((m: any) => {
                console.log(`- ${m.title} (${m.release_date}) [ID: ${m.id}]`);
            });
        } else {
            console.error("No data returned or error.", data);
        }
    } catch (e) {
        console.error("TMDB Fetch Error:", e);
    }
}

async function checkScraping() {
    console.log("\nChecking access to Box Office India...");
    try {
        const res = await fetch("https://boxofficeindia.com/assets/api/json/s_date/all_india/collection.json"); // Guessing or just checking main page
        // Actually usually strict. Let's try main page.
        const res2 = await fetch("https://boxofficeindia.com/");
        console.log("BoxOfficeIndia Status:", res2.status);
    } catch (e) {
        console.log("BOI Error:", e.message);
    }

    console.log("\nChecking access to Sacnilk...");
    try {
        const res = await fetch("https://www.sacnilk.com/");
        console.log("Sacnilk Status:", res.status);
    } catch (e) {
        console.log("Sacnilk Error:", e.message);
    }
}

async function main() {
    await checkMovies();
    await checkScraping();
}

main();
