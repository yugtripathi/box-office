
import { JSDOM } from 'jsdom';

// Note: I need jsdom. I don't know if it's installed. 
// If not, I'll use simple regex or string search for the test script unless I install it.
// I'll assume standard string parsing for now to avoid installing deps without permission yet.

async function testScraping() {
    const movieName = "Jawan"; // Known movie
    console.log(`Searching Sacnilk for ${movieName}...`);

    // Sacnilk doesn't have a simple GET query param search easily guessable sometimes, 
    // but let's try 'https://www.sacnilk.com/search' or google.
    // Actually, let's try to just fetch a direct likely URL or use a site search.
    // A common pattern: https://www.sacnilk.com/quicknews/[movie_name_slug]

    // Let's try to fetch the home page and see if we can find a search box or recent links.
    // Better: use a Google search via SERP API in the actual app? No, expensive.

    // Let's try to fetch a known URL format. 
    // "Jawan Box Office Collection" -> usually https://www.sacnilk.com/quicknews/Jawan_2023_Box_Office_Collection?hl=en

    const likelyUrl = "https://www.sacnilk.com/quicknews/Jawan_2023_Box_Office_Collection";
    console.log("Fetching likely URL:", likelyUrl);

    try {
        const res = await fetch(likelyUrl);
        if (!res.ok) {
            console.log("Failed to fetch specific URL:", res.status);
            return;
        }
        const html = await res.text();
        console.log("Page fetched. Length:", html.length);

        // Look for table data
        if (html.includes("Day 1")) {
            console.log("Found 'Day 1' in content. Parsing potential table...");
            // Simple regex to find "Day 1 [capture] [capture]"
            const day1Match = html.match(/Day 1\s*\[.*?\]\s*[:\s]*([\d,]+)/i) || html.match(/Day 1\s*[:\s]*([\d,]+)/i);
            // This is very loose. HTML structure is complex.

            // Check if we can find "Day 1" and surrounding text
            const index = html.indexOf("Day 1");
            console.log("Snippet around 'Day 1':", html.substring(index, index + 200));
        } else {
            console.log("'Day 1' not found in text.");
        }

    } catch (e) {
        console.error("Scrape Error:", e);
    }
}

testScraping();
