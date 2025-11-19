import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'rental'}`

const pool = new Pool({ connectionString })

type Vehicle = {
  id: string
  make: string
  model: string
  year?: number
  available?: boolean
}

type Reservation = {
  id: string
  vehicle_id: string
  user_id: string
  from_ts: string
  to_ts: string
}

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await pool.query('SELECT id, make, model, year, available FROM vehicles ORDER BY created_at DESC')
  return res.rows
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const res = await pool.query('SELECT id, make, model, year, available FROM vehicles WHERE id=$1', [id])
  return res.rows[0] ?? null
}

export async function addVehicle(v: { make: string; model: string; year?: number; available?: boolean }) {
  const res = await pool.query(
    'INSERT INTO vehicles (make, model, year, available) VALUES ($1,$2,$3,$4) RETURNING id, make, model, year, available',
    [v.make, v.model, v.year || null, v.available ?? true]
  )
  return res.rows[0]
}

export async function updateVehicle(id: string, v: Partial<{ make: string; model: string; year: number; available: boolean }>) {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1
  for (const key of Object.keys(v)) {
    fields.push(`${key}=$${idx++}`)
    // @ts-ignore
    values.push(v[key])
  }
  if (!fields.length) return await getVehicleById(id)
  values.push(id)
  const res = await pool.query(`UPDATE vehicles SET ${fields.join(', ')} WHERE id=$${idx} RETURNING id, make, model, year, available`, values)
  return res.rows[0]
}

export async function deleteVehicle(id: string) {
  await pool.query('DELETE FROM vehicles WHERE id=$1', [id])
  return { id }
}

export async function getReservations(): Promise<Reservation[]> {
  const res = await pool.query('SELECT id, vehicle_id, user_id, from_ts, to_ts FROM reservations ORDER BY created_at DESC')
  return res.rows
}

export async function createReservation(payload: { vehicle_id: string; user_id: string; from_ts: string; to_ts: string }) {
  const res = await pool.query(
    'INSERT INTO reservations (vehicle_id, user_id, from_ts, to_ts) VALUES ($1,$2,$3,$4) RETURNING id, vehicle_id, user_id, from_ts, to_ts',
    [payload.vehicle_id, payload.user_id, payload.from_ts, payload.to_ts]
  )
  return res.rows[0]
}

export async function deleteReservation(id: string) {
  await pool.query('DELETE FROM reservations WHERE id=$1', [id])
  return { id }
}

export async function closePool() {
  await pool.end()
}
