import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

// POST new car (admin only)
// TODO: Add authentication middleware to check if user is admin
export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));

    if (!body.make || !body.model) {
        return NextResponse.json(
            { error: 'make and model required' },
            { status: 400 }
        );
    }

    if (!dbExtras || typeof dbExtras.addVehicle !== 'function') {
        return NextResponse.json(
            { error: 'DB addVehicle not implemented' },
            { status: 500 }
        );
    }

    const car = await dbExtras.addVehicle(body);
    return NextResponse.json(car, { status: 201 });
}
