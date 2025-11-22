import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

// PATCH update car (admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (!dbExtras || typeof dbExtras.updateVehicle !== 'function') {
        return NextResponse.json(
            { error: 'DB updateVehicle not implemented' },
            { status: 500 }
        );
    }

    const car = await dbExtras.updateVehicle(id, body);
    return NextResponse.json(car);
}

// DELETE car (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!dbExtras || typeof dbExtras.deleteVehicle !== 'function') {
        return NextResponse.json(
            { error: 'DB deleteVehicle not implemented' },
            { status: 500 }
        );
    }

    const result = await dbExtras.deleteVehicle(id);
    return NextResponse.json(result);
}
