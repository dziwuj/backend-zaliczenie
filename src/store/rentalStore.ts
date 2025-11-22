import { create } from 'zustand';

export type Rental = {
    id: string;
    vehicleId: string;
    userId: string;
    from: string;
    to: string;
};

type RentalState = {
    rentals: Rental[];
    setRentals: (rentals: Rental[]) => void;
    addRental: (rental: Rental) => void;
    removeRental: (id: string) => void;
};

export const useRentalStore = create<RentalState>((set) => ({
    rentals: [],
    setRentals: (rentals) => set(() => ({ rentals })),
    addRental: (rental) =>
        set((state) => ({ rentals: [...state.rentals, rental] })),
    removeRental: (id) =>
        set((state) => ({ rentals: state.rentals.filter((r) => r.id !== id) })),
}));

export default useRentalStore;
