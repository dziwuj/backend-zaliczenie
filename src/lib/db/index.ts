// Database adapter placeholder
// The project is currently scaffolded without a DB implementation.
// When implementing, create two branches that swap this module's
// implementation (e.g. use `pg` in `pg` branch and `Prisma` in `prisma` branch).

import * as pg from './db-pg'

export const DB_MODE = process.env.DB_MODE || 'pg' // 'none' | 'pg' | 'prisma'

export async function getVehicles() {
  if (DB_MODE === 'pg') return pg.getVehicles()
  if (DB_MODE === 'none') return [
    { id: 'v1', make: 'Toyota', model: 'Corolla', year: 2020, available: true },
    { id: 'v2', make: 'Ford', model: 'Focus', year: 2019, available: true },
  ]
  throw new Error('DB not implemented for mode: ' + DB_MODE)
}

export async function getReservations() {
  if (DB_MODE === 'pg') return pg.getReservations()
  if (DB_MODE === 'none') return []
  throw new Error('DB not implemented for mode: ' + DB_MODE)
}

export async function createReservation(payload: any) {
  if (DB_MODE === 'pg') return pg.createReservation(payload)
  if (DB_MODE === 'none') return { id: 'r-local-' + Date.now(), ...payload }
  throw new Error('DB not implemented for mode: ' + DB_MODE)
}

export const dbExtras = pg
