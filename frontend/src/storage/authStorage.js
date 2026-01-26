import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem("token"),
  user: sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null,

  isAuthenticated: !!sessionStorage.getItem("token"),

  login: (token) => {
    const user = jwtDecode(token);

    sessionStorage.setItem("token", token);
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
