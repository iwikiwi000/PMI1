import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem("token"),
  isAuthenticated: !!sessionStorage.getItem("token"),

  login: (token) => {
    sessionStorage.setItem("token", token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));
