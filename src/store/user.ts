import { create } from "zustand";

interface User {
  name: string;
  email: string;
  profilePicture: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));