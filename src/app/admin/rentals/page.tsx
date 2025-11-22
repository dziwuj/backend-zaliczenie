'use client';

import React, { useEffect, useState } from 'react';

type User = {
    id: string;
    email: string;
    role: string;
};

type Vehicle = {
    id: string;
    make: string;
    model: string;
    year?: number;
    available?: boolean;
};

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
    user_email?: string;
};

const AdminRentalsPage: React.FC = () => {
    const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [userFilter, setUserFilter] = useState<string>('');
    const [vehicleFilter, setVehicleFilter] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editRental, setEditRental] = useState<RentalWithDetails | null>(
        null
    );
    const [form, setForm] = useState({
        user_id: '',
        vehicle_id: '',
        from_ts: '',
        to_ts: '',
    });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    useEffect(() => {
        let isCancelled = false;
        const fetchAll = async () => {
            setLoading(true);
            const [rentalsRes, usersRes, vehiclesRes] = await Promise.all([
                fetch(
                    `/api/admin/rentals?${
                        userFilter ? `userId=${userFilter}&` : ''
                    }${vehicleFilter ? `vehicleId=${vehicleFilter}` : ''}`
                ),
                fetch('/api/admin/users'),
                fetch('/api/admin/vehicles'),
            ]);
            const rentalsData = await rentalsRes.json();
            const usersData = await usersRes.json();
            const vehiclesData = await vehiclesRes.json();
            if (!isCancelled) {
                setRentals(rentalsData || []);
                setUsers(usersData || []);
                setVehicles(vehiclesData || []);
                setLoading(false);
            }
        };
        fetchAll();
        return () => {
            isCancelled = true;
        };
    }, [refreshTrigger, userFilter, vehicleFilter]);

    async function updateStatus(id: string, status: 'approved' | 'rejected') {
        const res = await fetch(`/api/admin/rentals/${id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            alert(`Rental ${status}!`);
            setRefreshTrigger((prev) => prev + 1);
        } else {
            alert(`Failed to ${status} rental`);
        }
    }

    async function deleteRental(id: string) {
        if (!confirm('Delete this rental?')) return;
        const res = await fetch(`/api/admin/rentals/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            alert('Rental deleted!');
            setRefreshTrigger((prev) => prev + 1);
        } else {
            alert('Failed to delete rental');
        }
    }

    function getStatusBadge(status: string) {
        const badges: Record<string, string> = {
            pending: 'badge badge-warning',
            approved: 'badge badge-success',
            rejected: 'badge badge-danger',
        };
        return badges[status] || 'badge';
    }

    const filteredRentals =
        filter === 'all' ? rentals : rentals.filter((r) => r.status === filter);

    const pendingCount = rentals.filter((r) => r.status === 'pending').length;

    return (
        <div className="container">
            <div className="header">
                <div>
                    <h1>🎫 Manage Rentals</h1>
                    {pendingCount > 0 && (
                        <span className="badge badge-warning">
                            {pendingCount} pending approval
                        </span>
                    )}
                </div>
                <div className="flex gap-05 mb-1">
                    <button
                        className={
                            filter === 'all'
                                ? 'btn btn-primary btn-sm'
                                : 'btn btn-outline btn-sm'
                        }
                        onClick={() => setFilter('all')}
                    >
                        All ({rentals.length})
                    </button>
                    <button
                        className={
                            filter === 'pending'
                                ? 'btn btn-primary btn-sm'
                                : 'btn btn-outline btn-sm'
                        }
                        onClick={() => setFilter('pending')}
                    >
                        Pending (
                        {rentals.filter((r) => r.status === 'pending').length})
                    </button>
                    <button
                        className={
                            filter === 'approved'
                                ? 'btn btn-primary btn-sm'
                                : 'btn btn-outline btn-sm'
                        }
                        onClick={() => setFilter('approved')}
                    >
                        Approved (
                        {rentals.filter((r) => r.status === 'approved').length})
                    </button>
                    <button
                        className="btn btn-success btn-sm ml-auto"
                        onClick={() => {
                            setShowForm(true);
                            setEditRental(null);
                            setForm({
                                user_id: '',
                                vehicle_id: '',
                                from_ts: '',
                                to_ts: '',
                            });
                        }}
                    >
                        ➕ New Rental
                    </button>
                </div>
                <div className="flex gap-05 mb-1">
                    <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="form-select"
                        title="Filter by user"
                    >
                        <option value="">All Users</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.email}
                            </option>
                        ))}
                    </select>
                    <select
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                        className="form-select"
                        title="Filter by vehicle"
                    >
                        <option value="">All Vehicles</option>
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.make} {v.model}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editRental ? 'Edit Rental' : 'New Rental'}</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const method = editRental ? 'PATCH' : 'POST';
                                const url = editRental
                                    ? `/api/admin/rentals/${editRental.id}`
                                    : '/api/admin/rentals';
                                const res = await fetch(url, {
                                    method,
                                    headers: {
                                        'content-type': 'application/json',
                                    },
                                    body: JSON.stringify(form),
                                });
                                if (res.ok) {
                                    setShowForm(false);
                                    setRefreshTrigger((prev) => prev + 1);
                                } else {
                                    alert('Failed to save rental');
                                }
                            }}
                        >
                            <label>User:</label>
                            <select
                                required
                                value={form.user_id}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        user_id: e.target.value,
                                    }))
                                }
                                title="Select user"
                            >
                                <option value="">Select user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.email}
                                    </option>
                                ))}
                            </select>
                            <label>Vehicle:</label>
                            <select
                                required
                                value={form.vehicle_id}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        vehicle_id: e.target.value,
                                    }))
                                }
                                title="Select vehicle"
                            >
                                <option value="">Select vehicle</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.make} {v.model}
                                    </option>
                                ))}
                            </select>
                            <label>From:</label>
                            <input
                                type="date"
                                required
                                value={form.from_ts}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        from_ts: e.target.value,
                                    }))
                                }
                                title="Start date"
                                placeholder="Start date"
                            />
                            <label>To:</label>
                            <input
                                type="date"
                                required
                                value={form.to_ts}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        to_ts: e.target.value,
                                    }))
                                }
                                title="End date"
                                placeholder="End date"
                            />
                            <div className="flex gap-05 mt-1">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    {editRental ? 'Save' : 'Create'}
                                </button>
                                <button
                                    className="btn btn-outline"
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {loading ? (
                <div className="loading">Loading rentals...</div>
            ) : filteredRentals.length === 0 ? (
                <div className="empty-state">
                    <h3>No {filter !== 'all' ? filter : ''} rentals</h3>
                    <p>Rental requests will appear here</p>
                </div>
            ) : (
                <div className="rentals-grid">
                    {filteredRentals.map((rental) => (
                        <div key={rental.id} className="card">
                            <button
                                className="btn btn-outline btn-xs float-right admin-edit-btn"
                                onClick={() => {
                                    setEditRental(rental);
                                    setForm({
                                        user_id: rental.user_id,
                                        vehicle_id: rental.vehicle_id,
                                        from_ts: rental.from_ts.slice(0, 10),
                                        to_ts: rental.to_ts.slice(0, 10),
                                    });
                                    setShowForm(true);
                                }}
                            >
                                ✏️ Edit
                            </button>
                            <div className="flex-between admin-rental-header mb-1">
                                <h3 className="m-0">
                                    🚗 {rental.vehicle_make}{' '}
                                    {rental.vehicle_model}
                                </h3>
                                <span className={getStatusBadge(rental.status)}>
                                    {rental.status.toUpperCase()}
                                </span>
                            </div>
                            {rental.vehicle_year && (
                                <p className="text-muted">
                                    📅 Year: {rental.vehicle_year}
                                </p>
                            )}
                            <p className="text-secondary">
                                👤 User: <strong>{rental.user_email}</strong>
                            </p>
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
                            <div className="card-actions">
                                {rental.status === 'pending' && (
                                    <>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                updateStatus(
                                                    rental.id,
                                                    'approved'
                                                )
                                            }
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                updateStatus(
                                                    rental.id,
                                                    'rejected'
                                                )
                                            }
                                        >
                                            ❌ Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => deleteRental(rental.id)}
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
};

export default AdminRentalsPage;
