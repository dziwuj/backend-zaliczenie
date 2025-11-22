import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';
import { Pool } from 'pg';
import { DB_MODE } from '@/lib/db';

// PATCH update rental (admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, user_id, vehicle_id, from_ts, to_ts } = body;

    // Only allow update of allowed fields
    if (!status && !user_id && !vehicle_id && !from_ts && !to_ts) {
        return NextResponse.json(
            { error: 'No fields to update' },
            { status: 400 }
        );
    }

    // If only status, use existing logic
    if (status && !user_id && !vehicle_id && !from_ts && !to_ts) {
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json(
                {
                    error: 'Invalid status. Must be: approved, rejected, or pending',
                },
                { status: 400 }
            );
        }
        const { updateReservationStatus } = await import('@/lib/db');
        const result = await updateReservationStatus(id, status);
        return NextResponse.json(result);
    }

    // For full edit (admin): update reservation fields
    if (DB_MODE !== 'pg') {
        return NextResponse.json(
            { error: 'Only pg mode supported for admin edit' },
            { status: 400 }
        );
    }
    // Direct SQL update (for demo, should be in db layer)
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const fields = [];
    const values = [];
    let idx = 1;
    if (user_id) {
        fields.push(`user_id=$${idx++}`);
        values.push(user_id);
    }
    if (vehicle_id) {
        fields.push(`vehicle_id=$${idx++}`);
        values.push(vehicle_id);
    }
    if (from_ts) {
        fields.push(`from_ts=$${idx++}`);
        values.push(from_ts);
    }
    if (to_ts) {
        fields.push(`to_ts=$${idx++}`);
        values.push(to_ts);
    }
    if (status) {
        fields.push(`status=$${idx++}`);
        values.push(status);
    }
    if (fields.length === 0) {
        return NextResponse.json(
            { error: 'No valid fields to update' },
            { status: 400 }
        );
    }
    const sql = `UPDATE reservations SET ${fields.join(
        ', '
    )} WHERE id=$${idx} RETURNING id, vehicle_id, user_id, from_ts, to_ts, status`;
    values.push(id);
    try {
        const res = await pool.query(sql, values);
        await pool.end();
        if (res.rows.length === 0) {
            return NextResponse.json(
                { error: 'Rental not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(res.rows[0]);
    } catch (e: unknown) {
        if (e instanceof Error)
            return NextResponse.json(
                { error: e.message || 'Failed to update rental' },
                { status: 400 }
            );
    }
}

// DELETE rental (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!dbExtras || typeof dbExtras.deleteReservation !== 'function') {
        return NextResponse.json(
            { error: 'DB deleteReservation not implemented' },
            { status: 500 }
        );
    }

    const result = await dbExtras.deleteReservation(id);
    return NextResponse.json(result);
}
