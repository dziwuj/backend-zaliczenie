import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all cars (public view - client can see available cars)
export async function GET(
    request: Request,
    context: { params: {} }
): Promise<Response> {
    try {
        const cars = await getVehicles();
        return NextResponse.json(cars);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Unknown error' },
            { status: 500 }
        );
    }
}
