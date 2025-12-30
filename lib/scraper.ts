import * as cheerio from 'cheerio';

interface DailyData {
    day: number;
    amount: number; // in bytes (raw number)
    date?: string;
}

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Check if the page is a valid movie page (not a generic homepage)
 * We're lenient here - if it has movie-specific elements, we accept it
 * even if the title doesn't exactly match (handles spelling variations)
 */
function isValidMoviePage($: cheerio.CheerioAPI, title: string): boolean {
    // First priority: Check for box office collection elements (most reliable)
    if ($('.boxofficecollection').length > 0) {
        return true;
    }

    // Second: Check for movie-specific page elements
    if ($('.movieinfo').length > 0) {
        return true;
    }

    // Third: Check if the page title indicates this is a movie page (not generic sacnilk homepage)
    const pageTitle = $('title').text().toLowerCase();

    // Reject if it's clearly the generic homepage
    if (pageTitle === 'sacnilk: all india box office collection news - sacnilk' ||
        pageTitle === 'sacnilk' ||
        pageTitle.includes('search results')) {
        return false;
    }

    // If page title contains " - sacnilk" (movie format), check for any title similarity
    if (pageTitle.includes(' - sacnilk')) {
        const sanitizedTitle = title.toLowerCase().replace(/[^\w\s]/g, '').split(' ')[0];
        // Be very lenient - just check if first few chars match (handles Thamma/Thama)
        const pageName = pageTitle.replace(' - sacnilk', '').trim();
        if (pageName.startsWith(sanitizedTitle.substring(0, 3)) ||
            sanitizedTitle.startsWith(pageName.substring(0, 3))) {
            return true;
        }
        // Even if title doesn't match, if it's a movie page format, accept it
        return true;
    }

    // Check h1 for movie name
    const h1Text = $('h1').text().toLowerCase();
    if (h1Text && h1Text.length > 0 && !h1Text.includes('trending') && !h1Text.includes('news')) {
        return true;
    }

    return false;
}


/**
 * Try to fetch with multiple URL patterns
 */
async function tryFetchMoviePage(title: string, year: string): Promise<{ html: string; url: string } | null> {
    // Sanitize title for URL - replace spaces with underscores, remove special chars
    const sanitizedTitle = title
        .replace(/[-–—:]/g, ' ')  // Replace dashes and colons with space first
        .replace(/\s+/g, '_')      // Then replace spaces with underscores
        .replace(/[^\w\d_]/g, ''); // Remove other special chars

    // Also try without double underscores
    const cleanSanitizedTitle = sanitizedTitle.replace(/__+/g, '_');

    // Year patterns to try
    const currentYear = parseInt(year);
    const altYears = [year, (currentYear - 1).toString(), (currentYear + 1).toString()];

    // Titles to try (original and cleaned)
    const titles = [sanitizedTitle, cleanSanitizedTitle];
    // Remove duplicates
    const uniqueTitles = [...new Set(titles)];

    // Try all combinations
    for (const titleVariant of uniqueTitles) {
        for (const yearVariant of altYears) {
            const url = `https://www.sacnilk.com/movie/${titleVariant}_${yearVariant}`;
            console.log(`[Scraper] Trying URL: ${url}`);

            try {
                const res = await fetch(url, {
                    headers: { 'User-Agent': USER_AGENT },
                    redirect: 'follow'
                });

                if (!res.ok) {
                    console.log(`[Scraper] URL returned ${res.status}: ${url}`);
                    continue;
                }

                const html = await res.text();
                const $ = cheerio.load(html);

                // Check if this is actually a movie page
                if (isValidMoviePage($, title)) {
                    console.log(`[Scraper] Found valid movie page at: ${url}`);
                    return { html, url };
                } else {
                    console.log(`[Scraper] URL returned generic page (not movie page): ${url}`);
                }
            } catch (e) {
                console.log(`[Scraper] Error fetching ${url}: ${e}`);
            }
        }
    }

    // If direct URLs fail, try search-based approach
    const searchUrl = `https://www.sacnilk.com/search?q=${encodeURIComponent(title + ' ' + year)}`;
    console.log(`[Scraper] Trying search fallback: ${searchUrl}`);

    try {
        const searchRes = await fetch(searchUrl, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (searchRes.ok) {
            const searchHtml = await searchRes.text();
            const $ = cheerio.load(searchHtml);

            // Look for movie links in search results
            const movieLinks: string[] = [];
            $('a[href*="/movie/"]').each((_, elem) => {
                const href = $(elem).attr('href');
                if (href && href.includes('/movie/')) {
                    movieLinks.push(href);
                }
            });

            // Try each found movie link
            for (const link of movieLinks.slice(0, 3)) { // Try first 3 matches
                const fullUrl = link.startsWith('http') ? link : `https://www.sacnilk.com${link}`;
                console.log(`[Scraper] Trying search result: ${fullUrl}`);

                try {
                    const pageRes = await fetch(fullUrl, {
                        headers: { 'User-Agent': USER_AGENT }
                    });

                    if (pageRes.ok) {
                        const pageHtml = await pageRes.text();
                        const $page = cheerio.load(pageHtml);

                        if (isValidMoviePage($page, title)) {
                            console.log(`[Scraper] Found valid movie page via search: ${fullUrl}`);
                            return { html: pageHtml, url: fullUrl };
                        }
                    }
                } catch (e) {
                    console.log(`[Scraper] Error fetching search result ${fullUrl}: ${e}`);
                }
            }
        }
    } catch (e) {
        console.log(`[Scraper] Search fallback failed: ${e}`);
    }

    return null;
}

/**
 * Parse the daily box office data from a movie page HTML
 */
function parseDailyData($: cheerio.CheerioAPI): DailyData[] {
    const dailyData: DailyData[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetTable: any = null;

    // Try to find the Hindi specific day wise table
    $('.boxofficecollection').each((_, elem) => {
        const heading = $(elem).find('h2').text().toLowerCase();
        if (heading.includes('hindi') && heading.includes('day wise')) {
            targetTable = $(elem).find('table');
            return false;
        }
    });

    // Fallback: If not explicitly named, take the first table inside a boxofficecollection div
    if (!targetTable || targetTable.length === 0) {
        const firstBlock = $('.boxofficecollection').first();
        if (firstBlock.length) {
            targetTable = firstBlock.find('table');
        }
    }

    if (targetTable && targetTable.length > 0) {
        console.log("[Scraper] Found target table. Parsing...");

        const rows = targetTable.find('tr');
        if (rows.length >= 2) {
            const headerCells = rows.eq(0).find('th');
            const valueCells = rows.eq(1).find('td');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headerCells.each((index: number, elem: any) => {
                const headerText = $(elem).text().trim();
                const dayMatch = headerText.match(/Day\s+(\d+)/i);

                if (dayMatch) {
                    const day = parseInt(dayMatch[1]);

                    if (index < valueCells.length) {
                        const valText = $(valueCells[index]).text().trim();
                        let amount = 0;
                        const cleanVal = valText.replace(/[^\d.]/g, '');

                        if (cleanVal) {
                            if (valText.includes('Cr')) {
                                amount = parseFloat(cleanVal) * 10000000;
                            } else if (valText.includes('Lakh')) {
                                amount = parseFloat(cleanVal) * 100000;
                            } else {
                                amount = parseFloat(cleanVal) * 1;
                            }

                            if (!isNaN(amount) && amount > 0) {
                                dailyData.push({ day, amount: Math.floor(amount) });
                            }
                        }
                    }
                }
            });
        }
    } else {
        console.warn("[Scraper] No '.boxofficecollection' table found.");
    }

    return dailyData.sort((a, b) => a.day - b.day);
}

export async function scrapeDailyBoxOffice(title: string, year: string): Promise<DailyData[]> {
    console.log(`[Scraper] Starting scrape for: "${title}" (${year})`);

    try {
        const result = await tryFetchMoviePage(title, year);

        if (!result) {
            console.warn(`[Scraper] Could not find movie page for "${title}" (${year}) - may be OTT-only or not tracked`);
            return [];
        }

        const $ = cheerio.load(result.html);
        const dailyData = parseDailyData($);

        if (dailyData.length > 0) {
            console.log(`[Scraper] Successfully parsed ${dailyData.length} days of data for "${title}"`);
        } else {
            console.warn(`[Scraper] Found movie page but no daily data for "${title}"`);
        }

        return dailyData;

    } catch (e) {
        console.error(`[Scraper] Error scraping ${title}:`, e);
        return [];
    }
}
