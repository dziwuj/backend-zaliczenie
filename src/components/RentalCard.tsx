interface RentalCardProps {
    rental: {
        id: string;
        vehicle_id?: string;
        vehicleId?: string;
        user_id?: string;
        userId?: string;
        from_ts?: string;
        to_ts?: string;
        from?: string;
        to?: string;
    };
    onDelete?: (rentalId: string) => void;
    showActions?: boolean;
}

export function RentalCard({
    rental,
    onDelete,
    showActions = true,
}: RentalCardProps) {
    const vehicleId = rental.vehicle_id || rental.vehicleId;
    const userId = rental.user_id || rental.userId;
    const from = rental.from_ts || rental.from;
    const to = rental.to_ts || rental.to;

    return (
        <div className="card">
            <p>
                <strong>Rental ID:</strong> {rental.id}
            </p>
            {vehicleId && (
                <p>
                    <strong>Vehicle:</strong> {vehicleId}
                </p>
            )}
            {userId && (
                <p>
                    <strong>User:</strong> {userId}
                </p>
            )}
            {from && (
                <p>
                    <strong>From:</strong> {new Date(from).toLocaleDateString()}
                </p>
            )}
            {to && (
                <p>
                    <strong>To:</strong> {new Date(to).toLocaleDateString()}
                </p>
            )}
            {showActions && onDelete && (
                <div className="card-actions">
                    <button className="btn" onClick={() => onDelete(rental.id)}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default RentalCard;
