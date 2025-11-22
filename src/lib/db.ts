export async function getAllUsers(): Promise<User[]> {
    if (DB_MODE === 'pg') return pg.getAllUsers();
    if (DB_MODE === 'none')
        return [
            { id: 'admin-id', email: 'admin@rental.com', role: 'admin' },
            { id: 'user-id', email: 'user@rental.com', role: 'user' },
        ];
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}
import * as pg from './db-pg';

export type Vehicle = pg.Vehicle;
export type Reservation = pg.Reservation;
export type User = pg.User;

export type ReservationCreate = {
    vehicle_id: string;
    user_id: string;
    from_ts: string;
    to_ts: string;
    status?: string;
};

export type RentalWithDetails = {
    id: string;
    vehicle_id: string;
    user_id: string;
    from_ts: string;
    to_ts: string;
    status: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
    user_email?: string;
};

export interface DbExtras {
    getVehicles: () => Promise<Vehicle[]>;
    getVehicleById: (id: string) => Promise<Vehicle | null>;
    addVehicle: (v: {
        make: string;
        model: string;
        year?: number;
        available?: boolean;
    }) => Promise<Vehicle>;
    updateVehicle: (
        id: string,
        v: Partial<{
            make: string;
            model: string;
            year: number;
            available: boolean;
        }>
    ) => Promise<Vehicle>;
    deleteVehicle: (id: string) => Promise<{ id: string }>;
    getReservations: () => Promise<Reservation[]>;
    getReservationsWithDetails: () => Promise<RentalWithDetails[]>;
    getUserReservationsWithDetails: (
        userId: string
    ) => Promise<RentalWithDetails[]>;
    createReservation: (
        payload: ReservationCreate
    ) => Promise<Reservation & { status: string }>;
    checkReservationConflict: (
        vehicleId: string,
        fromTs: string,
        toTs: string
    ) => Promise<boolean>;
    updateReservationStatus: (
        id: string,
        status: string
    ) => Promise<Reservation & { status: string }>;
    deleteReservation: (id: string) => Promise<{ id: string }>;
}

export const DB_MODE = process.env.DB_MODE || 'pg'; // 'none' | 'pg' | 'prisma'

export async function getVehicles() {
    if (DB_MODE === 'pg') return pg.getVehicles();
    if (DB_MODE === 'none')
        return [
            {
                id: 'v1',
                make: 'Toyota',
                model: 'Corolla',
                year: 2020,
                available: true,
            },
            {
                id: 'v2',
                make: 'Ford',
                model: 'Focus',
                year: 2019,
                available: true,
            },
        ];
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function getReservations() {
    if (DB_MODE === 'pg') return pg.getReservations();
    if (DB_MODE === 'none') return [];
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function getReservationsWithDetails(): Promise<
    RentalWithDetails[]
> {
    if (DB_MODE === 'pg') return pg.getReservationsWithDetails();
    if (DB_MODE === 'none') return [];
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function checkReservationConflict(
    vehicleId: string,
    fromTs: string,
    toTs: string
) {
    if (DB_MODE === 'pg')
        return pg.checkReservationConflict(vehicleId, fromTs, toTs);
    if (DB_MODE === 'none') return false;
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function createReservation(
    payload: ReservationCreate
): Promise<Reservation & { status: string }> {
    if (DB_MODE === 'pg') return pg.createReservation(payload);
    if (DB_MODE === 'none')
        return { id: 'r-local-' + Date.now(), ...payload, status: 'pending' };
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function getUserReservationsWithDetails(
    userId: string
): Promise<RentalWithDetails[]> {
    if (DB_MODE === 'pg') return pg.getUserReservationsWithDetails(userId);
    if (DB_MODE === 'none') return [];
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export async function updateReservationStatus(
    id: string,
    status: string
): Promise<Reservation & { status: string }> {
    if (DB_MODE === 'pg') return pg.updateReservationStatus(id, status);
    if (DB_MODE === 'none')
        return {
            id,
            vehicle_id: '',
            user_id: '',
            from_ts: '',
            to_ts: '',
            status,
        };
    throw new Error('DB not implemented for mode: ' + DB_MODE);
}

export const dbExtras: DbExtras = pg as unknown as DbExtras;
