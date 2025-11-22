'use client';

import React, { useEffect, useState } from 'react';

type Vehicle = {
    id: string;
    make: string;
    model: string;
    year?: number;
    available?: boolean;
};

export default function AdminCarsPage() {
    const [cars, setCars] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ make: '', model: '', year: '' });

    useEffect(() => {
        let isCancelled = false;

        const fetchCars = async () => {
            setLoading(true);
            const res = await fetch('/api/cars');
            const data = await res.json();
            if (!isCancelled) {
                setCars(data || []);
                setLoading(false);
            }
        };

        fetchCars();

        return () => {
            isCancelled = true;
        };
    }, []);

    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    useEffect(() => {
        let isCancelled = false;

        const fetchCars = async () => {
            setLoading(true);
            const res = await fetch('/api/cars');
            const data = await res.json();
            if (!isCancelled) {
                setCars(data || []);
                setLoading(false);
            }
        };

        fetchCars();

        return () => {
            isCancelled = true;
        };
    }, [refreshTrigger]);

    async function addCar(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/admin/cars', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                make: form.make,
                model: form.model,
                year: form.year ? parseInt(form.year) : null,
            }),
        });
        if (res.status === 201) {
            alert('Car added!');
            setForm({ make: '', model: '', year: '' });
            setRefreshTrigger((prev) => prev + 1);
        } else {
            alert('Failed to add car');
        }
    }

    async function deleteCar(id: string) {
        if (!confirm('Delete this car?')) return;
        const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Car deleted!');
            setRefreshTrigger((prev) => prev + 1);
        } else {
            alert('Failed to delete car');
        }
    }

    return (
        <div className="container">
            <h1>Manage Cars</h1>

            <div className="card card-mb-2">
                <h2>Add New Car</h2>
                <form onSubmit={addCar}>
                    <div className="form-group">
                        <label className="form-label">Make</label>
                        <input
                            type="text"
                            placeholder="Make (e.g. Toyota, Ford, Honda)"
                            value={form.make}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, make: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Model</label>
                        <input
                            type="text"
                            placeholder="Model (e.g. Corolla, Focus, Civic)"
                            value={form.model}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    model: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Year (Optional)</label>
                        <input
                            type="number"
                            placeholder="Year (e.g. 2020)"
                            value={form.year}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, year: e.target.value }))
                            }
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Add Car
                    </button>
                </form>
            </div>

            <h2>All Cars</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="vehicles-grid">
                    {cars.map((car) => (
                        <div key={car.id} className="card">
                            <h3>
                                {car.make} {car.model}
                            </h3>
                            <p className="text-muted">
                                📅 Year: {car.year ?? '—'}
                            </p>
                            <p className="text-muted">
                                {car.available
                                    ? '✅ Available'
                                    : '❌ Unavailable'}
                            </p>
                            <div className="card-actions">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteCar(car.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
