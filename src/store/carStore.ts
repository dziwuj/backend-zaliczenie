import { create } from 'zustand';

export type Car = {
    id: string;
    make: string;
    model: string;
    year?: number;
    available?: boolean;
};

type CarState = {
    cars: Car[];
    setCars: (cars: Car[]) => void;
    addCar: (car: Car) => void;
    updateCar: (id: string, updates: Partial<Car>) => void;
    removeCar: (id: string) => void;
};

export const useCarStore = create<CarState>((set) => ({
    cars: [],
    setCars: (cars) => set(() => ({ cars })),
    addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),
    updateCar: (id, updates) =>
        set((state) => ({
            cars: state.cars.map((c) =>
                c.id === id ? { ...c, ...updates } : c
            ),
        })),
    removeCar: (id) =>
        set((state) => ({ cars: state.cars.filter((c) => c.id !== id) })),
}));

export default useCarStore;
