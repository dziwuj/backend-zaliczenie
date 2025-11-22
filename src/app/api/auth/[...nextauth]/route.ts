import { NextResponse } from 'next/server';

// Placeholder for Auth.js NextAuth handler. The full NextAuth integration
// caused build issues with the current package exports; the app uses a
// local credential endpoint at `/api/auth/local` for frontend sign-in.

export async function GET() {
    return NextResponse.json({
        ok: true,
        message: 'NextAuth placeholder - use /api/auth/local',
    });
}

export async function POST() {
    return NextResponse.json(
        { ok: false, message: 'Not implemented in this branch' },
        { status: 501 }
    );
}
