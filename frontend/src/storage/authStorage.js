import { create } from "zustand";
import api from "../api/token";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  checkAuth: () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      set({ 
        token, 
        isAuthenticated: true, 
        user: { token } 
      });
      return true;
    }
    set({ token: null, isAuthenticated: false, user: null });
    return false;
  },

  login: (token) => {
    sessionStorage.setItem("token", token);
    set({ 
      token, 
      isAuthenticated: true, 
      user: { token } 
    });
  },

  logout: () => {
    sessionStorage.removeItem('token');
    set({ isAuthenticated: false, token: null });
  },
}));
