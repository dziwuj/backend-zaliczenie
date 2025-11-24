import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all users (admin only)
export async function GET(
    request: Request,
    context: { params: {} }
): Promise<Response> {
    try {
        const users = await getAllUsers();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
