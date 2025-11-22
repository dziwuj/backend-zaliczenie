interface CarCardProps {
    car: {
        id: string;
        make: string;
        model: string;
        year?: number;
        available?: boolean;
    };
    onReserve?: (carId: string) => void;
    onDelete?: (carId: string) => void;
    showActions?: boolean;
}

export function CarCard({
    car,
    onReserve,
    onDelete,
    showActions = true,
}: CarCardProps) {
    return (
        <div className="card">
            <div className="flex-between mb-05">
                <h3 className="m-0">
                    {car.make} {car.model}
                </h3>
                {car.available !== undefined && (
                    <span
                        className={`badge ${
                            car.available ? 'badge-success' : 'badge-danger'
                        }`}
                    >
                        {car.available ? '✓ Available' : '✗ Rented'}
                    </span>
                )}
            </div>
            <p className="text-muted">📅 Year: {car.year ?? '—'}</p>
            {showActions && (
                <div className="card-actions">
                    {onReserve && (
                        <button
                            className="btn btn-primary"
                            onClick={() => onReserve(car.id)}
                        >
                            🚗 Reserve Now
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(car.id)}
                        >
                            🗑️ Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default CarCard;
