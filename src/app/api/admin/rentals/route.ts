import { createReservation } from '@/lib/db';

// POST create rental (admin only)
export async function POST(req: Request) {
    const data = await req.json();
    // expects: { user_id, vehicle_id, from_ts, to_ts }
    if (!data.user_id || !data.vehicle_id || !data.from_ts || !data.to_ts) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }
    try {
        // Rentals created by admin are auto-approved
        const rental = await createReservation({
            user_id: data.user_id,
            vehicle_id: data.vehicle_id,
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
import { NextResponse } from 'next/server';
import { getReservationsWithDetails } from '@/lib/db';

// GET all rentals with details (admin only)

export async function GET(req: Request) {
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
}
