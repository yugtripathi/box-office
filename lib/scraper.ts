import * as cheerio from 'cheerio';

interface DailyData {
    day: number;
    amount: number; // in bytes (raw number)
    date?: string;
}

const BASE_URL = 'https://www.sacnilk.com/quicknews';

export async function scrapeDailyBoxOffice(title: string, year: string): Promise<DailyData[]> {
    // Sanitize title for URL
    // e.g., "Jawan" -> "Jawan"
    // "Kisi Ka Bhai Kisi Ki Jaan" -> "Kisi_Ka_Bhai_Kisi_Ki_Jaan"
    const sanitizedTitle = title.replace(/\s+/g, '_').replace(/[^\w\d_]/g, '');
    const url = `https://www.sacnilk.com/movie/${sanitizedTitle}_${year}`; // Mapped to Movie Page

    console.log(`[Scraper] Fetching: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (res.status === 404 || !res.ok) {
            console.warn(`[Scraper] Failed to fetch ${url}: ${res.status}`);
            return [];
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const dailyData: DailyData[] = [];

        // 1. Find the Collections Container
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

        if (targetTable) {
            console.log("[Scraper] Found target table. Parsing...");

            // Horizontal Parsing
            // Row 0 or 1 might be headers (Day X)
            // Row 1 or 2 might be values

            const rows = targetTable.find('tr');
            if (rows.length >= 2) {
                const headerCells = rows.eq(0).find('th'); // Assuming headers are th
                const valueCells = rows.eq(1).find('td');  // Assuming values are td

                headerCells.each((index: number, elem: any) => {
                    const headerText = $(elem).text().trim();
                    const dayMatch = headerText.match(/Day\s+(\d+)/i);

                    if (dayMatch) {
                        const day = parseInt(dayMatch[1]);
                        // Find corresponding value cell at same index
                        // Note: Sometimes the first few cols are "Verdict", "Total" etc.
                        // But if they align, index should match. (e.g. Header 5 is Day 57, Value 5 is 0.05 Cr)

                        if (index < valueCells.length) {
                            const valText = $(valueCells[index]).text().trim();
                            // Clean up: "₹ 75 Cr" -> 750000000
                            let amount = 0;
                            const cleanVal = valText.replace(/[^\d.]/g, '');

                            if (cleanVal) {
                                if (valText.includes('Cr')) {
                                    amount = parseFloat(cleanVal) * 10000000;
                                } else if (valText.includes('Lakh')) {
                                    amount = parseFloat(cleanVal) * 100000;
                                } else {
                                    amount = parseFloat(cleanVal) * 1; // Default
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

    } catch (e) {
        console.error(`[Scraper] Error scraping ${title}:`, e);
        return [];
    }
}
