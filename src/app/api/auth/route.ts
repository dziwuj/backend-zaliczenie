import { NextResponse } from 'next/server'

// Auth route placeholder
// Replace this with Auth.js (Auth.js/@auth/nextjs) handler when ready.

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Auth endpoint placeholder (GET)' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ ok: true, message: 'Auth endpoint placeholder (POST)', body })
}
