import { NextResponse } from 'next/server';
import { createReservation, getReservationsWithDetails } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST create rental (admin only)
export async function POST(req: Request): Promise<Response> {
    const data = await req.json();
    if (!data.user_id || !data.vehicle_id || !data.from_ts || !data.to_ts) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }
    const userId = String(data.user_id);
    const vehicleId = String(data.vehicle_id);
    try {
        // Rentals created by admin are auto-approved
        const rental = await createReservation({
            user_id: userId,
            vehicle_id: vehicleId,
            from_ts: data.from_ts,
            to_ts: data.to_ts,
            status: 'approved',
        });
        return NextResponse.json(rental, { status: 201 });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message || 'Failed to create rental' },
            { status: 400 }
        );
    }
}

// GET all rentals with details (admin only)
export async function GET(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const vehicleId = searchParams.get('vehicleId');
        let rentals = await getReservationsWithDetails();
        if (userId) {
            rentals = rentals.filter((r) => r.user_id === userId);
        }
        if (vehicleId) {
            rentals = rentals.filter((r) => r.vehicle_id === vehicleId);
        }
        return NextResponse.json(rentals);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
