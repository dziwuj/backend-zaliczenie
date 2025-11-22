// Get all users (for admin filtering/selection)
export async function getAllUsers(): Promise<User[]> {
    const res = await pool.query(
        'SELECT id, email, role FROM users ORDER BY email ASC'
    );
    return res.rows;
}
import { Pool } from 'pg';

const connectionString =
    process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${
        process.env.POSTGRES_PASSWORD || 'postgres'
    }@${process.env.POSTGRES_HOST || 'localhost'}:${
        process.env.POSTGRES_PORT || 5432
    }/${process.env.POSTGRES_DB || 'rental'}`;

const pool = new Pool({ connectionString });

export type Vehicle = {
    id: string;
    make: string;
    model: string;
    year?: number;
    available?: boolean;
};

export type Reservation = {
    id: string;
    vehicle_id: string;
    user_id: string;
    from_ts: string;
    to_ts: string;
};

export type User = {
    id: string;
    email: string;
    password_hash?: string;
    role: string;
};

export async function getVehicles(): Promise<Vehicle[]> {
    const res = await pool.query(
        'SELECT id, make, model, year, available FROM vehicles ORDER BY created_at DESC'
    );
    return res.rows;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
    const res = await pool.query(
        'SELECT id, make, model, year, available FROM vehicles WHERE id=$1',
        [id]
    );
    return res.rows[0] ?? null;
}

export async function addVehicle(v: {
    make: string;
    model: string;
    year?: number;
    available?: boolean;
}) {
    const res = await pool.query(
        'INSERT INTO vehicles (make, model, year, available) VALUES ($1,$2,$3,$4) RETURNING id, make, model, year, available',
        [v.make, v.model, v.year || null, v.available ?? true]
    );
    return res.rows[0];
}

export async function updateVehicle(
    id: string,
    v: Partial<{
        make: string;
        model: string;
        year: number;
        available: boolean;
    }>
) {
    const fields: string[] = [];
    const values: (string | number | boolean)[] = [];
    let idx = 1;
    for (const key of Object.keys(v) as Array<keyof typeof v>) {
        fields.push(`${key}=$${idx++}`);
        const value = v[key];
        if (value !== undefined) {
            values.push(value);
        }
    }
    if (!fields.length) return await getVehicleById(id);
    values.push(id);
    const res = await pool.query(
        `UPDATE vehicles SET ${fields.join(
            ', '
        )} WHERE id=$${idx} RETURNING id, make, model, year, available`,
        values
    );
    return res.rows[0];
}

export async function deleteVehicle(id: string) {
    await pool.query('DELETE FROM vehicles WHERE id=$1', [id]);
    return { id };
}

export async function getReservations(): Promise<Reservation[]> {
    const res = await pool.query(
        'SELECT id, vehicle_id, user_id, from_ts, to_ts, status FROM reservations ORDER BY created_at DESC'
    );
    return res.rows;
}

export async function getReservationsWithDetails() {
    const res = await pool.query(`
        SELECT 
            r.id, r.vehicle_id, r.user_id, r.from_ts, r.to_ts, r.status,
            v.make as vehicle_make, v.model as vehicle_model, v.year as vehicle_year,
            u.email as user_email
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    `);
    return res.rows;
}

export async function getUserReservationsWithDetails(userId: string) {
    const res = await pool.query(
        `
        SELECT 
            r.id, r.vehicle_id, r.user_id, r.from_ts, r.to_ts, r.status,
            v.make as vehicle_make, v.model as vehicle_model, v.year as vehicle_year,
            u.email as user_email
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `,
        [userId]
    );
    return res.rows;
}

export async function checkReservationConflict(
    vehicleId: string,
    fromTs: string,
    toTs: string
): Promise<boolean> {
    const res = await pool.query(
        `SELECT id FROM reservations 
         WHERE vehicle_id = $1 
         AND status = 'approved'
         AND from_ts < $3
         AND to_ts > $2
         LIMIT 1`,
        [vehicleId, fromTs, toTs]
    );
    return res.rows.length > 0;
}

export async function createReservation(payload: {
    vehicle_id: string;
    user_id: string;
    from_ts: string;
    to_ts: string;
    status?: string;
}) {
    const hasConflict = await checkReservationConflict(
        payload.vehicle_id,
        payload.from_ts,
        payload.to_ts
    );

    if (hasConflict) {
        throw new Error('Vehicle is already reserved for the selected dates');
    }

    const status = payload.status || 'pending';
    const res = await pool.query(
        'INSERT INTO reservations (vehicle_id, user_id, from_ts, to_ts, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, vehicle_id, user_id, from_ts, to_ts, status',
        [
            payload.vehicle_id,
            payload.user_id,
            payload.from_ts,
            payload.to_ts,
            status,
        ]
    );
    return res.rows[0];
}

export async function updateReservationStatus(id: string, status: string) {
    const res = await pool.query(
        'UPDATE reservations SET status=$1 WHERE id=$2 RETURNING id, vehicle_id, user_id, from_ts, to_ts, status',
        [status, id]
    );
    return res.rows[0];
}

export async function deleteReservation(id: string) {
    await pool.query('DELETE FROM reservations WHERE id=$1', [id]);
    return { id };
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const res = await pool.query(
        'SELECT id, email, password_hash, role FROM users WHERE email=$1',
        [email]
    );
    return res.rows[0] ?? null;
}

export async function createUser(user: {
    email: string;
    password_hash?: string;
    role?: string;
}): Promise<User> {
    const res = await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING id, email, role',
        [user.email, user.password_hash || null, user.role || 'user']
    );
    return res.rows[0];
}

export async function closePool() {
    await pool.end();
}
