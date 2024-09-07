import { create } from "zustand";

export const userStore = create((set) => ({
  user: false,
  updateUser: (user: any) => set({ user }),
}));
