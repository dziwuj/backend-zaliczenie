import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/db';

// GET all vehicles (admin only)
export async function GET() {
    const vehicles = await getVehicles();
    return NextResponse.json(vehicles);
}
