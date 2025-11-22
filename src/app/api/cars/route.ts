import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/db';

// GET all cars (public view - client can see available cars)
export async function GET() {
    const cars = await getVehicles();
    return NextResponse.json(cars);
}
