import { NextResponse } from 'next/server'
import { getVehicles, dbExtras } from '@/src/lib/db'

export async function GET() {
  const vehicles = await getVehicles()
  return NextResponse.json(vehicles)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  // naive check: require make and model
  if (!body.make || !body.model) {
    return NextResponse.json({ error: 'make and model required' }, { status: 400 })
  }
  // use dbExtras.addVehicle when available
  if (dbExtras && typeof (dbExtras as any).addVehicle === 'function') {
    const v = await (dbExtras as any).addVehicle(body)
    return NextResponse.json(v, { status: 201 })
  }
  return NextResponse.json({ error: 'DB addVehicle not implemented' }, { status: 500 })
}
