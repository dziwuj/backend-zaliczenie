'use client';

import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isAdmin, isAuthenticated, setUser, clearUser } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');

    async function login(e: React.FormEvent) {
        e.preventDefault();
        setLoginError('');
        const res = await fetch('/api/auth/local', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data?.email) {
            setUser(data);
            if (data.role !== 'admin') {
                setLoginError('Access denied. Admin privileges required.');
            }
        } else {
            setLoginError('Login failed. Please check your credentials.');
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="container">
                <div className="empty-state admin-login-box mx-auto">
                    <h3>🔒 Admin Login Required</h3>
                    <p className="admin-login-desc">
                        Please login with admin credentials to access this area
                    </p>
                    <form onSubmit={login} className="admin-login-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        email: e.target.value,
                                    }))
                                }
                                placeholder="Email address (admin@rental.com)"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        password: e.target.value,
                                    }))
                                }
                                placeholder="Password"
                                required
                            />
                        </div>
                        {loginError && (
                            <p className="text-danger admin-login-error">
                                {loginError}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary admin-login-btn"
                        >
                            Login as Admin
                        </button>
                        <div className="admin-login-back">
                            <Link
                                href="/"
                                className="text-secondary admin-login-link"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container">
                <div className="empty-state admin-access-denied">
                    <h3>⛔ Access Denied</h3>
                    <p>Admin privileges required to access this area</p>
                    <p className="text-muted admin-access-user">
                        You are logged in as: {user?.email}
                    </p>
                    <div className="admin-access-back">
                        <Link href="/dashboard" className="btn btn-primary">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <nav className="admin-nav">
                <span className="badge badge-primary">👑 Admin Panel</span>
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/cars">Manage Cars</Link>
                <Link href="/admin/rentals">Manage Rentals</Link>
                <button
                    className="btn btn-outline btn-sm admin-nav-logout"
                    onClick={() => {
                        clearUser();
                        window.location.href = '/';
                    }}
                >
                    Logout
                </button>
            </nav>
            <main>{children}</main>
        </div>
    );
}
