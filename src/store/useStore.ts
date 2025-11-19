import create from 'zustand'

type Role = 'guest' | 'user' | 'staff'

export type User = {
  id?: string
  email?: string
  role?: Role
}

export type Vehicle = {
  id: string
  make: string
  model: string
  year?: number
  available?: boolean
}

export type Reservation = {
  id: string
  vehicleId: string
  userId: string
  from: string
  to: string
}

type State = {
  user?: User
  vehicles: Vehicle[]
  reservations: Reservation[]
  setUser: (u?: User) => void
  setVehicles: (v: Vehicle[]) => void
  addReservation: (r: Reservation) => void
  removeReservation: (id: string) => void
}

export const useStore = create<State>((set) => ({
  user: undefined,
  vehicles: [],
  reservations: [],
  setUser: (u) => set(() => ({ user: u })),
  setVehicles: (v) => set(() => ({ vehicles: v })),
  addReservation: (r) => set((s) => ({ reservations: [...s.reservations, r] })),
  removeReservation: (id) => set((s) => ({ reservations: s.reservations.filter((x) => x.id !== id) })),
}))

export default useStore
