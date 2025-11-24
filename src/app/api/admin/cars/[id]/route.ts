import { NextResponse, NextRequest } from 'next/server';
import { dbExtras } from '@/lib/db';

export const dynamic = 'force-dynamic';

// PATCH update car (admin only)

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;
    if (!id || typeof id !== 'string') {
        return NextResponse.json({ error: 'Invalid car id' }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const car = await dbExtras.updateVehicle(id, body);
    return NextResponse.json(car);
}

// DELETE car (admin only)

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;
    if (!id || typeof id !== 'string') {
        return NextResponse.json({ error: 'Invalid car id' }, { status: 400 });
    }
    const result = await dbExtras.deleteVehicle(id);
    return NextResponse.json(result);
}
