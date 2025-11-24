import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
    if (!prisma) {
        try {
            const connectionString =
                process.env.DATABASE_URL ||
                'postgresql://postgres:postgres@localhost:5432/rental';
            const pool = new Pool({ connectionString });
            const adapter = new PrismaPg(pool);

            prisma = new PrismaClient({
                adapter,
                log:
                    process.env.NODE_ENV === 'development'
                        ? ['query', 'error', 'warn']
                        : ['error'],
                __internal: {},
            } as unknown as ConstructorParameters<typeof PrismaClient>[0]);
        } catch (error) {
            console.error('Failed to initialize Prisma client:', error);
            throw new Error(
                'Database client initialization failed. Please ensure DATABASE_URL is set and database is accessible.'
            );
        }
    }
    return prisma;
}

export type User = {
    id: string;
    email: string;
    password_hash?: string;
    role: string;
    createdAt?: Date;
};

export type Vehicle = {
    id: string;
    make: string;
    model: string;
    year: number | null;
    available?: boolean;
    createdAt?: Date;
};

export type Reservation = {
    id: string;
    vehicleId: string;
    userId: string;
    fromTs: Date;
    toTs: Date;
    status: string;
    createdAt?: Date;
};

export async function getAllUsers(): Promise<User[]> {
    const users = await getPrisma().user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            password_hash: true,
        },
        orderBy: { email: 'asc' },
    });
    return users.map((u) => ({
        id: u.id,
        email: u.email,
        password_hash: u.password_hash ?? undefined,
        role: u.role,
        createdAt: u.createdAt,
    }));
}

export async function getVehicles(): Promise<Vehicle[]> {
    const vehicles = await getPrisma().vehicle.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return vehicles;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
    return getPrisma().vehicle.findUnique({ where: { id } });
}

export async function addVehicle(v: {
    make: string;
    model: string;
    year: number;
}): Promise<Vehicle> {
    return getPrisma().vehicle.create({ data: v });
}

export async function updateVehicle(
    id: string,
    v: Partial<{ make: string; model: string; year: number }>
): Promise<Vehicle | null> {
    return getPrisma().vehicle.update({ where: { id }, data: v });
}

export async function deleteVehicle(id: string): Promise<{ id: string }> {
    await getPrisma().vehicle.delete({ where: { id } });
    return { id };
}

import type {
    Reservation as PrismaReservation,
    Vehicle as PrismaVehicle,
    User as PrismaUser,
} from '@prisma/client';

type PrismaReservationWithDetails = PrismaReservation & {
    vehicle?: PrismaVehicle | null;
    user?: PrismaUser | null;
};

export async function getReservations(): Promise<Reservation[]> {
    const reservations = await getPrisma().reservation.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return reservations;
}

export type ReservationWithDetails = Reservation & {
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number | null;
    user_email?: string;
};

export async function getReservationsWithDetails(): Promise<
    ReservationWithDetails[]
> {
    const reservations: PrismaReservationWithDetails[] =
        await getPrisma().reservation.findMany({
            include: {
                vehicle: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    return reservations.map(
        (r): ReservationWithDetails => ({
            id: r.id,
            vehicleId: r.vehicleId,
            userId: r.userId,
            fromTs: r.fromTs,
            toTs: r.toTs,
            status: r.status,
            createdAt: r.createdAt,
            vehicle_make: r.vehicle?.make,
            vehicle_model: r.vehicle?.model,
            vehicle_year: r.vehicle?.year,
            user_email: r.user?.email,
        })
    );
}

export async function getUserReservationsWithDetails(
    userId: string
): Promise<ReservationWithDetails[]> {
    const reservations: PrismaReservationWithDetails[] =
        await getPrisma().reservation.findMany({
            where: { userId },
            include: { vehicle: true, user: true },
            orderBy: { createdAt: 'desc' },
        });
    return reservations.map(
        (r): ReservationWithDetails => ({
            id: r.id,
            vehicleId: r.vehicleId,
            userId: r.userId,
            fromTs: r.fromTs,
            toTs: r.toTs,
            status: r.status,
            createdAt: r.createdAt,
            vehicle_make: r.vehicle?.make,
            vehicle_model: r.vehicle?.model,
            vehicle_year: r.vehicle?.year,
            user_email: r.user?.email,
        })
    );
}

export async function checkReservationConflict(
    vehicleId: string,
    fromTs: string,
    toTs: string
): Promise<boolean> {
    const conflict = await getPrisma().reservation.findFirst({
        where: {
            vehicleId,
            fromTs: { lt: new Date(toTs) },
            toTs: { gt: new Date(fromTs) },
            status: 'approved',
        },
    });
    return !!conflict;
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
    const reservation = await getPrisma().reservation.create({
        data: {
            vehicleId: payload.vehicle_id,
            userId: payload.user_id,
            fromTs: new Date(payload.from_ts),
            toTs: new Date(payload.to_ts),
            status: payload.status || 'pending',
        },
    });
    return reservation;
}

export async function updateReservationStatus(id: string, status: string) {
    return await getPrisma().reservation.update({
        where: { id },
        data: { status },
    });
}

export async function updateReservation(
    id: string,
    payload: Partial<{
        user_id: string;
        vehicle_id: string;
        from_ts: string;
        to_ts: string;
        status: string;
    }>
) {
    const data: Record<string, unknown> = {};
    if (payload.user_id !== undefined) data.userId = payload.user_id;
    if (payload.vehicle_id !== undefined) data.vehicleId = payload.vehicle_id;
    if (payload.from_ts !== undefined) data.fromTs = new Date(payload.from_ts);
    if (payload.to_ts !== undefined) data.toTs = new Date(payload.to_ts);
    if (payload.status !== undefined) data.status = payload.status;

    return await getPrisma().reservation.update({ where: { id }, data });
}

export async function deleteReservation(id: string) {
    await getPrisma().reservation.delete({ where: { id } });
    return { id };
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await getPrisma().user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password_hash: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) return null;
    return {
        id: user.id,
        email: user.email,
        password_hash: user.password_hash ?? undefined,
        role: user.role,
        createdAt: user.createdAt,
    };
}

export async function createUser(user: {
    email: string;
    password_hash?: string;
    role?: string;
}): Promise<User> {
    const created = await getPrisma().user.create({
        data: {
            email: user.email,
            password_hash: user.password_hash || '',
            role: user.role || 'user',
        },
    });
    return {
        id: created.id,
        email: created.email,
        role: created.role,
        createdAt: created.createdAt,
    };
}

export async function closePrisma() {
    if (prisma) {
        await prisma.$disconnect();
    }
}
