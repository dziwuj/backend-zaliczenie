import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

// GET single car by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!dbExtras || typeof dbExtras.getVehicleById !== 'function') {
        return NextResponse.json(
            { error: 'DB getVehicleById not implemented' },
            { status: 500 }
        );
    }

    const car = await dbExtras.getVehicleById(id);
    if (!car) {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
}
