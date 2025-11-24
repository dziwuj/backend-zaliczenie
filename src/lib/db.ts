import * as prismaDb from './db-prisma';

export type Vehicle = prismaDb.Vehicle;
export type Reservation = prismaDb.Reservation;
export type User = prismaDb.User;

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
        year: number;
    }) => Promise<Vehicle>;
    updateVehicle: (
        id: string,
        v: Partial<{ make: string; model: string; year: number }>
    ) => Promise<Vehicle | null>;
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
    updateReservation: (
        id: string,
        payload: Partial<ReservationCreate>
    ) => Promise<Reservation & { status: string }>;
    deleteReservation: (id: string) => Promise<{ id: string }>;
}

export async function getAllUsers(): Promise<User[]> {
    return prismaDb.getAllUsers();
}

export async function getVehicles() {
    return prismaDb.getVehicles();
}

export async function getReservations() {
    return prismaDb.getReservations();
}

export async function getReservationsWithDetails(): Promise<
    RentalWithDetails[]
> {
    const reservations = await prismaDb.getReservationsWithDetails();
    return reservations.map((r: prismaDb.ReservationWithDetails) => ({
        id: r.id,
        vehicle_id: r.vehicleId,
        user_id: r.userId,
        from_ts: r.fromTs instanceof Date ? r.fromTs.toISOString() : r.fromTs,
        to_ts: r.toTs instanceof Date ? r.toTs.toISOString() : r.toTs,
        status: r.status,
        vehicle_make: r.vehicle_make,
        vehicle_model: r.vehicle_model,
        vehicle_year: r.vehicle_year ?? undefined,
        user_email: r.user_email,
    }));
}

export async function checkReservationConflict(
    vehicleId: string,
    fromTs: string,
    toTs: string
) {
    return prismaDb.checkReservationConflict(vehicleId, fromTs, toTs);
}

export async function createReservation(
    payload: ReservationCreate
): Promise<Reservation & { status: string }> {
    return prismaDb.createReservation(payload);
}

export async function getUserReservationsWithDetails(
    userId: string
): Promise<RentalWithDetails[]> {
    const reservations = await prismaDb.getUserReservationsWithDetails(userId);
    return reservations.map((r: prismaDb.ReservationWithDetails) => ({
        id: r.id,
        vehicle_id: r.vehicleId,
        user_id: r.userId,
        from_ts: r.fromTs instanceof Date ? r.fromTs.toISOString() : r.fromTs,
        to_ts: r.toTs instanceof Date ? r.toTs.toISOString() : r.toTs,
        status: r.status,
        vehicle_make: r.vehicle_make,
        vehicle_model: r.vehicle_model,
        vehicle_year: r.vehicle_year ?? undefined,
        user_email: r.user_email,
    }));
}

export const dbExtras: DbExtras = {
    getVehicles: prismaDb.getVehicles,
    getVehicleById: prismaDb.getVehicleById,
    addVehicle: prismaDb.addVehicle,
    updateVehicle: prismaDb.updateVehicle,
    deleteVehicle: prismaDb.deleteVehicle,
    getReservations: prismaDb.getReservations,
    getReservationsWithDetails,
    getUserReservationsWithDetails,
    createReservation: prismaDb.createReservation,
    checkReservationConflict: prismaDb.checkReservationConflict,
    updateReservationStatus: prismaDb.updateReservationStatus,
    updateReservation: prismaDb.updateReservation,
    deleteReservation: prismaDb.deleteReservation,
};
