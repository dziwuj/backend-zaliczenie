import { NextResponse } from 'next/server';
import { getUserReservationsWithDetails } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID required' },
            { status: 400 }
        );
    }

    const rentals = await getUserReservationsWithDetails(userId);
    return NextResponse.json(rentals);
}
