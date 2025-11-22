import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db-pg';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;
    if (!email || !password)
        return NextResponse.json(
            { error: 'email and password required' },
            { status: 400 }
        );
    const user = await getUserByEmail(email);
    if (!user)
        return NextResponse.json({ error: 'user not found' }, { status: 401 });
    if (!user.password_hash)
        return NextResponse.json({ error: 'no password set' }, { status: 401 });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok)
        return NextResponse.json(
            { error: 'invalid credentials' },
            { status: 401 }
        );
    return NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role,
    });
}
