import { NextResponse } from 'next/server';
import { createReservation, ReservationCreate } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST new rental (create reservation)
export async function POST(request: Request): Promise<Response> {
    try {
        const body: Partial<ReservationCreate> = await request
            .json()
            .catch(() => ({}));
        const vehicle_id = String(body.vehicle_id);
        const user_id = String(body.user_id);
        const from_ts = body.from_ts;
        const to_ts = body.to_ts;
        if (!vehicle_id || vehicle_id === 'NaN' || vehicle_id === 'undefined') {
            return NextResponse.json(
                { error: 'vehicle_id is required and must be a valid string' },
                { status: 400 }
            );
        }
        if (!user_id || user_id === 'NaN' || user_id === 'undefined') {
            return NextResponse.json(
                { error: 'user_id is required and must be a valid string' },
                { status: 400 }
            );
        }
        if (!from_ts || isNaN(new Date(from_ts).getTime())) {
            return NextResponse.json(
                { error: 'from_ts is required and must be a valid date' },
                { status: 400 }
            );
        }
        if (!to_ts || isNaN(new Date(to_ts).getTime())) {
            return NextResponse.json(
                { error: 'to_ts is required and must be a valid date' },
                { status: 400 }
            );
        }
        const rental = await createReservation({
            vehicle_id,
            user_id,
            from_ts,
            to_ts,
        });
        return NextResponse.json(rental, { status: 201 });
    } catch (error: unknown) {
        let message = 'Failed to create reservation';
        if (
            typeof error === 'object' &&
            error &&
            'message' in error &&
            typeof (error as Error).message === 'string'
        ) {
            message = (error as { message: string }).message;
        }
        return NextResponse.json({ error: message }, { status: 409 });
    }
}
