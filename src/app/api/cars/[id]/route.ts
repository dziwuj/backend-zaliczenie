import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single car by ID

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;
    if (!id || typeof id !== 'string') {
        return NextResponse.json({ error: 'Invalid car id' }, { status: 400 });
    }
    const car = await dbExtras.getVehicleById(id);
    if (!car) {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(car);
}
