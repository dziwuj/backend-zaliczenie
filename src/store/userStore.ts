import { create } from 'zustand';

type Role = 'guest' | 'user' | 'admin';

export type User = {
    id?: string;
    email?: string;
    role?: Role;
};

type UserState = {
    user?: User;
    setUser: (u?: User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    user: undefined,
    setUser: (u) => set(() => ({ user: u })),
    clearUser: () => set(() => ({ user: undefined })),
}));

export default useUserStore;
