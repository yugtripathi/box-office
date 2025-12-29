const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const TMDB_IMAGE_LOW_RES_BASE_URL = 'https://image.tmdb.org/t/p/w500';

if (!TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
    console.warn('TMDB API Key or Access Token is missing. Search and details will not work.');
}

const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
};

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const res = await fetch(url.toString(), {
            headers: TMDB_ACCESS_TOKEN ? headers : undefined
        });

        if (!res.ok) {
            throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch from TMDB:', error);
        return null;
    }
}

export async function searchMovies(query: string) {
    return fetchFromTMDB('/search/movie', { query, region: 'IN' });
}

export async function getMovieDetails(id: string) {
    return fetchFromTMDB(`/movie/${id}`, { append_to_response: 'credits,similar,videos' });
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day') {
    // Trending doesn't support thorough filtering, so we switch to discovery for "Trending" feel or filter client side.
    // However, for Bollywood focus, we should use discover instead of trending endpoint to ensure Hindi content.
    return fetchFromTMDB('/discover/movie', {
        with_original_language: 'hi',
        sort_by: 'popularity.desc',
        page: '1'
    });
}

export async function getTopRatedMovies() {
    return fetchFromTMDB('/movie/top_rated', { region: 'IN', with_original_language: 'hi' });
}

export async function getTopGrossingMovies(page: number = 1) {
    // Filter for recent releases (2024-2025) to show current top grossing
    return fetchFromTMDB('/discover/movie', {
        with_original_language: 'hi', // Focus on Hindi/Bollywood
        sort_by: 'revenue.desc',
        'primary_release_date.gte': '2024-01-01',
        'primary_release_date.lte': '2025-12-31',
        include_adult: 'false',
        include_video: 'false',
        page: page.toString()
    });
}

export async function getMoviesByYear(year: string) {
    return fetchFromTMDB('/discover/movie', {
        primary_release_year: year,
        with_original_language: 'hi', // Focus on Bollywood
        sort_by: 'revenue.desc',
        include_adult: 'false',
        include_video: 'false',
        page: '1'
    });
}

export async function getLatestReleases() {
    // Fetches movies released in late 2025 (Oct-Dec)
    return fetchFromTMDB('/discover/movie', {
        'primary_release_date.gte': '2025-10-01',
        'primary_release_date.lte': '2025-12-30',
        with_original_language: 'hi',
        sort_by: 'popularity.desc',
        include_adult: 'false',
        include_video: 'false',
        page: '1'
    });
}
