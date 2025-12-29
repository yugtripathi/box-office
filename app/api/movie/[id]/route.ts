import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const data = await getMovieDetails(id);

    if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}
