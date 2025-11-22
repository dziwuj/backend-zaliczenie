export const carValidation = {
    make: (value: unknown) => typeof value === 'string' && value.length > 0,
    model: (value: unknown) => typeof value === 'string' && value.length > 0,
    year: (value: unknown) =>
        value === undefined ||
        value === null ||
        (typeof value === 'number' && value > 1900 && value < 2100),
};

export const rentalValidation = {
    vehicle_id: (value: unknown) =>
        typeof value === 'string' && value.length > 0,
    user_id: (value: unknown) => typeof value === 'string' && value.length > 0,
    from_ts: (value: unknown) => {
        try {
            return !isNaN(new Date(value as string).getTime());
        } catch {
            return false;
        }
    },
    to_ts: (value: unknown) => {
        try {
            return !isNaN(new Date(value as string).getTime());
        } catch {
            return false;
        }
    },
};

export function validateCar(data: unknown): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const car = data as Record<string, unknown>;

    if (!carValidation.make(car.make)) {
        errors.push('Make is required and must be a string');
    }
    if (!carValidation.model(car.model)) {
        errors.push('Model is required and must be a string');
    }
    if (car.year !== undefined && !carValidation.year(car.year)) {
        errors.push('Year must be a valid number between 1900 and 2100');
    }

    return { valid: errors.length === 0, errors };
}

export function validateRental(data: unknown): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const rental = data as Record<string, unknown>;

    if (!rentalValidation.vehicle_id(rental.vehicle_id)) {
        errors.push('Vehicle ID is required');
    }
    if (!rentalValidation.user_id(rental.user_id)) {
        errors.push('User ID is required');
    }
    if (!rentalValidation.from_ts(rental.from_ts)) {
        errors.push('From date is required and must be valid');
    }
    if (!rentalValidation.to_ts(rental.to_ts)) {
        errors.push('To date is required and must be valid');
    }

    return { valid: errors.length === 0, errors };
}
