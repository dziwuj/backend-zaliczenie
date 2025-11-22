'use client';

import React, { useEffect, useState } from 'react';
import useStore from '@/store/userStore';

type RentalWithDetails = {
    id: string;
    vehicle_id: string;
    user_id: string;
    from_ts: string;
    to_ts: string;
    status: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
};

export default function RentalsPage() {
    const { user } = useStore();
    const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        let isCancelled = false;

        const fetchRentals = async () => {
            setLoading(true);
            const res = await fetch(`/api/rentals/history?userId=${user.id}`);
            const data = await res.json();
            if (!isCancelled) {
                setRentals(data || []);
                setLoading(false);
            }
        };

        fetchRentals();

        return () => {
            isCancelled = true;
        };
    }, [user?.id]);

    function getStatusBadge(status: string) {
        const badges: Record<string, string> = {
            pending: 'badge badge-warning',
            approved: 'badge badge-success',
            rejected: 'badge badge-danger',
        };
        return badges[status] || 'badge';
    }

    function getStatusIcon(status: string) {
        const icons: Record<string, string> = {
            pending: '⏳',
            approved: '✅',
            rejected: '❌',
        };
        return icons[status] || '📋';
    }

    return (
        <div className="container">
            <h1>📋 My Rental History</h1>
            {!user ? (
                <div className="empty-state">
                    <h3>Please log in</h3>
                    <p>You need to be logged in to view your rental history.</p>
                </div>
            ) : loading ? (
                <div className="loading">Loading your rentals...</div>
            ) : rentals.length === 0 ? (
                <div className="empty-state">
                    <h3>No rentals yet</h3>
                    <p>Start by reserving a vehicle from the home page!</p>
                </div>
            ) : (
                <div className="rentals-grid">
                    {rentals.map((rental) => (
                        <div key={rental.id} className="card">
                            <div className="flex-between mb-1">
                                <h3 className="m-0">
                                    🚗 {rental.vehicle_make}{' '}
                                    {rental.vehicle_model}
                                </h3>
                                <span className={getStatusBadge(rental.status)}>
                                    {getStatusIcon(rental.status)}{' '}
                                    {rental.status.toUpperCase()}
                                </span>
                            </div>
                            {rental.vehicle_year && (
                                <p className="text-muted">
                                    📅 Year: {rental.vehicle_year}
                                </p>
                            )}
                            <p>
                                <strong>📆 Period:</strong>
                            </p>
                            <p className="text-secondary">
                                From:{' '}
                                {new Date(rental.from_ts).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </p>
                            <p className="text-secondary">
                                To:{' '}
                                {new Date(rental.to_ts).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </p>
                            {rental.status === 'pending' && (
                                <p className="text-warning mt-1 fs-0875">
                                    ⏳ Waiting for admin approval
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
