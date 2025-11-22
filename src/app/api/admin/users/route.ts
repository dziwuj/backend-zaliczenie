import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';

// GET all users (admin only)
export async function GET() {
    const users = await getAllUsers();
    return NextResponse.json(users);
}
