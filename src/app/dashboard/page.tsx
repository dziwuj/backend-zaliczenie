'use client';

// ...existing code...
import useStore from '@/store/userStore';

export default function DashboardPage() {
    const { user } = useStore();

    return (
        <div className="container">
            <h1>Dashboard</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <p>Role: {user.role || 'user'}</p>
                </div>
            ) : (
                <p>Please log in to view your dashboard.</p>
            )}
        </div>
    );
}
