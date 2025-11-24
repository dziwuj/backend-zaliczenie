import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all vehicles (admin only)
export async function GET(
    request: Request,
    context: { params: {} }
): Promise<Response> {
    try {
        const vehicles = await getVehicles();
        return NextResponse.json(vehicles);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
