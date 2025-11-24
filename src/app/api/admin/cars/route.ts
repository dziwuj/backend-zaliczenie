import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json().catch(() => ({}));
        const make = body.brand || body.make;
        const model = body.model;
        const year = body.year;
        if (typeof make !== 'string' || !make.trim()) {
            return NextResponse.json(
                { error: 'brand/make is required and must be a string' },
                { status: 400 }
            );
        }
        if (typeof model !== 'string' || !model.trim()) {
            return NextResponse.json(
                { error: 'model is required and must be a string' },
                { status: 400 }
            );
        }
        if (
            year !== undefined &&
            (typeof year !== 'number' || year < 1900 || year > 2100)
        ) {
            return NextResponse.json(
                { error: 'year must be a valid number between 1900 and 2100' },
                { status: 400 }
            );
        }
        if (!dbExtras || typeof dbExtras.addVehicle !== 'function') {
            return NextResponse.json(
                { error: 'DB addVehicle not implemented' },
                { status: 500 }
            );
        }
        const car = await dbExtras.addVehicle({ make, model, year });
        return NextResponse.json(car, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
