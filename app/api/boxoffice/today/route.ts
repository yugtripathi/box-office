import { NextResponse } from 'next/server';
import { getLiveBoxOffice } from '@/lib/boxoffice';

// Mock IDs for the "Live" movies on dashboard
const TRACKED_MOVIES = [
    { id: 1, base: 5403200 }, // Pathaan
    { id: 2, base: 6904000 }, // Jawan
    { id: 3, base: 4501000 }, // Animal
];

export async function GET() {
    const data = await Promise.all(
        TRACKED_MOVIES.map(movie => getLiveBoxOffice(movie.id, movie.base))
    );

    // Convert array to object key-value for easy frontend consumption
    const responseData: Record<number, string> = {};
    data.forEach(item => {
        responseData[item.movieId] = item.revenue;
    });

    return NextResponse.json(responseData);
}
