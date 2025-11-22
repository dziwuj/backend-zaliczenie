import { NextResponse } from 'next/server';
import { createReservation, ReservationCreate } from '@/lib/db';

// POST new rental (create reservation)
export async function POST(request: Request) {
    const body: Partial<ReservationCreate> = await request
        .json()
        .catch(() => ({}));

    if (!body.vehicle_id || !body.user_id || !body.from_ts || !body.to_ts) {
        return NextResponse.json(
            { error: 'vehicle_id, user_id, from_ts and to_ts required' },
            { status: 400 }
        );
    }

    try {
        const rental = await createReservation(body as ReservationCreate);
        return NextResponse.json(rental, { status: 201 });
    } catch (error: unknown) {
        let message = 'Failed to create reservation';
        if (
            typeof error === 'object' &&
            error &&
            'message' in error &&
            typeof (error as any).message === 'string'
        ) {
            message = (error as { message: string }).message;
        }
        return NextResponse.json({ error: message }, { status: 409 });
    }
}
