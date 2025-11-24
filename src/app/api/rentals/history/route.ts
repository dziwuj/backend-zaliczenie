import { NextResponse } from 'next/server';
import { getUserReservationsWithDetails } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
    try {
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
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
