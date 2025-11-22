'use client';

import { useEffect, useState } from 'react';
import useStore from '@/store/userStore';
import Link from 'next/link';

type Vehicle = {
    id: string;
    make: string;
    model: string;
    year?: number;
    available?: boolean;
};

// Public landing page - browse available cars
export default function Home() {
    const { user, setUser } = useStore();
    const [cars, setCars] = useState<Vehicle[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [form, setForm] = useState({ email: '', password: '' });
    const [reservationModal, setReservationModal] = useState<{
        carId: string;
        carName: string;
    } | null>(null);
    const [dateForm, setDateForm] = useState({
        fromDate: '',
        toDate: '',
    });

    useEffect(() => {
        fetch('/api/cars')
            .then((res) => res.json())
            .then((data) => setCars(data || []));
    }, [refreshTrigger]);

    async function login(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/auth/local', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data?.email) setUser(data);
        else alert('login failed');
    }

    function openReservationModal(carId: string, carName: string) {
        if (!user?.id) return alert('Please log in first');

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const threeDays = new Date(now);
        threeDays.setDate(now.getDate() + 3);
        const threeDaysLater = threeDays.toISOString().split('T')[0];

        setReservationModal({ carId, carName });
        setDateForm({ fromDate: today, toDate: threeDaysLater });
    }

    async function submitReservation(e: React.FormEvent) {
        e.preventDefault();
        if (!reservationModal || !user?.id) return;

        if (new Date(dateForm.toDate) <= new Date(dateForm.fromDate)) {
            alert('End date must be after start date');
            return;
        }

        const payload = {
            vehicle_id: reservationModal.carId,
            user_id: user.id,
            from_ts: new Date(dateForm.fromDate).toISOString(),
            to_ts: new Date(dateForm.toDate).toISOString(),
        };
        const res = await fetch('/api/rentals', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.status === 201) {
            alert('Reservation request submitted! Waiting for admin approval.');
            setReservationModal(null);
            setRefreshTrigger((prev) => prev + 1);
        } else {
            const error = await res.json();
            alert('Reservation failed: ' + (error.error || 'Unknown error'));
        }
    }

    return (
        <div className="container">
            <header className="header">
                <div>
                    <h1>🚗 Welcome to Car Rental</h1>
                    <p className="text-secondary">
                        Browse and reserve your perfect vehicle
                    </p>
                </div>
                <div>
                    {user?.email ? (
                        <div className="auth-inline">
                            <span className="badge badge-primary">
                                {user.email}
                            </span>
                            <Link
                                href="/dashboard/rentals"
                                className="btn btn-primary btn-sm"
                            >
                                📋 My Rentals
                            </Link>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setUser(undefined)}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <form
                                onSubmit={login}
                                className="auth-inline mb-05"
                            >
                                <input
                                    placeholder="Email address"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    placeholder="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            password: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </form>
                            <div className="fs-075 text-muted-custom">
                                <p className="mb-05">
                                    Demo accounts: password123
                                </p>
                                <p className="m-0">
                                    👤 user@rental.com | 👑 admin@rental.com
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <h2>Available Cars</h2>
            {cars.length === 0 ? (
                <div className="empty-state">
                    <h3>No cars available</h3>
                    <p>Check back later for new vehicles</p>
                </div>
            ) : (
                <div className="vehicles-grid">
                    {cars.map((car) => (
                        <div key={car.id} className="card">
                            <div className="flex-between mb-05">
                                <h3 className="m-0">
                                    {car.make} {car.model}
                                </h3>
                                {car.available && (
                                    <span className="badge badge-success">
                                        ✓ Available
                                    </span>
                                )}
                            </div>
                            <p className="text-muted">
                                📅 Year: {car.year ?? '—'}
                            </p>
                            <div className="card-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        openReservationModal(
                                            car.id,
                                            `${car.make} ${car.model}`
                                        )
                                    }
                                    disabled={!user}
                                >
                                    {user
                                        ? '🚗 Reserve Now'
                                        : '🔒 Login to Reserve'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reservationModal && (
                <div
                    className="overlay-modal"
                    onClick={() => setReservationModal(null)}
                >
                    <div
                        className="card card-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Reserve {reservationModal.carName}</h3>
                        <form onSubmit={submitReservation}>
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    placeholder="Start date"
                                    value={dateForm.fromDate}
                                    onChange={(e) =>
                                        setDateForm((f) => ({
                                            ...f,
                                            fromDate: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    placeholder="End date"
                                    value={dateForm.toDate}
                                    onChange={(e) =>
                                        setDateForm((f) => ({
                                            ...f,
                                            toDate: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                            <div className="card-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit Reservation
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setReservationModal(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
