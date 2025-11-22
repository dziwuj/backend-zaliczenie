import { useUserStore } from '@/store/userStore';

export function useAuth() {
    const { user, setUser, clearUser } = useUserStore();

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    return {
        user,
        isAuthenticated,
        isAdmin,
        setUser,
        clearUser,
    };
}

export default useAuth;
