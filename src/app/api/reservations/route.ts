import { NextResponse } from 'next/server'
import { getReservations, createReservation, dbExtras } from '@/src/lib/db'

export async function GET() {
  const res = await getReservations()
  return NextResponse.json(res)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (!body.vehicle_id || !body.user_id || !body.from_ts || !body.to_ts) {
    return NextResponse.json({ error: 'vehicle_id, user_id, from_ts and to_ts required' }, { status: 400 })
  }
  // use db adapter
  const r = await createReservation(body)
  return NextResponse.json(r, { status: 201 })
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    if (dbExtras && typeof (dbExtras as any).deleteReservation === 'function') {
      const res = await (dbExtras as any).deleteReservation(id)
      return NextResponse.json(res)
    }
    return NextResponse.json({ error: 'DB deleteReservation not implemented' }, { status: 500 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}
