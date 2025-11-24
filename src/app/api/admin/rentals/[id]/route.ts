import { NextResponse } from 'next/server';
import { dbExtras } from '@/lib/db';

export const dynamic = 'force-dynamic';

// PATCH update rental (admin only)
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    if (!id || typeof id !== 'string') {
        return NextResponse.json(
            { error: 'Invalid rental id' },
            { status: 400 }
        );
    }
    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        try {
            const txt = await request.text();
            if (txt) {
                try {
                    body = JSON.parse(txt) as Record<string, unknown>;
                } catch {
                    const params = new URLSearchParams(txt);
                    if (params.has('status')) {
                        body = { status: params.get('status') };
                    } else {
                        body = {};
                    }
                }
            }
        } catch {
            body = {};
        }
    }

    const hasStatus = Object.prototype.hasOwnProperty.call(body, 'status');
    const hasEditFields =
        Object.prototype.hasOwnProperty.call(body, 'user_id') ||
        Object.prototype.hasOwnProperty.call(body, 'vehicle_id') ||
        Object.prototype.hasOwnProperty.call(body, 'from_ts') ||
        Object.prototype.hasOwnProperty.call(body, 'to_ts');

    try {
        if (hasStatus) {
            let status = (body as Record<string, unknown>).status;
            if (status === undefined || status === null) {
                return NextResponse.json(
                    { error: 'Status is required' },
                    { status: 400 }
                );
            }
            if (typeof status !== 'string') {
                if (typeof status === 'number' || typeof status === 'boolean') {
                    status = String(status);
                } else {
                    return NextResponse.json(
                        { error: 'Status must be a string' },
                        { status: 400 }
                    );
                }
            }
            const statusStr: string = status as string;
            const updated = await dbExtras.updateReservationStatus(
                id,
                statusStr
            );
            return NextResponse.json(updated);
        } else if (hasEditFields) {
            const payload: Partial<{
                user_id: string;
                vehicle_id: string;
                from_ts: string;
                to_ts: string;
                status?: string;
            }> = {};
            if (body.user_id && typeof body.user_id === 'string')
                payload.user_id = body.user_id as string;
            if (body.vehicle_id && typeof body.vehicle_id === 'string')
                payload.vehicle_id = body.vehicle_id as string;
            if (body.from_ts && typeof body.from_ts === 'string')
                payload.from_ts = body.from_ts as string;
            if (body.to_ts && typeof body.to_ts === 'string')
                payload.to_ts = body.to_ts as string;
            if (body.status && typeof body.status === 'string')
                payload.status = body.status as string;

            const updated = await dbExtras.updateReservation(id, payload);
            return NextResponse.json(updated);
        } else {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }
    } catch (error: unknown) {
        try {
            console.error('[admin/rentals PATCH] error:', error);
        } catch {}
        let message = 'Failed to update reservation';
        if (typeof error === 'object' && error !== null) {
            const errObj = error as { message?: unknown };
            if (typeof errObj.message === 'string') message = errObj.message;
        }
        return NextResponse.json(
            { error: message, debug: String(error) },
            { status: 400 }
        );
    }
}

// DELETE rental (admin only)

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;
    if (!id || typeof id !== 'string') {
        return NextResponse.json(
            { error: 'Invalid rental id' },
            { status: 400 }
        );
    }
    const result = await dbExtras.deleteReservation(id);
    return NextResponse.json(result);
}
