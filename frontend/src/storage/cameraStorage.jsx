import { create } from "zustand";
import api from "../api/token.js";

export const useCameraStore = create((set) => ({
  cameras: [],
  loading: false,
  error: null,

  fetchCameras: async () => {
    set({ loading: true });
    try {
      console.log("Token before fetch:", localStorage.getItem("token"));
      const res = await api.get("/cameras");
      set({ cameras: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, loading: false });
    }
  },

  addCamera: async (title, source) => {
    try {
      await api.post("/cameras", { title, source });
      const res = await api.get("/cameras");
      set({ cameras: res.data });
    } catch (err) {
      console.error("Error adding camera:", err);
    }
  },

  removeCamera: async (id) => {
    try {
      await api.delete(`/cameras/${id}`);
      set((state) => ({
        cameras: state.cameras.filter((cam) => cam.c_id !== id),
      }));
    } catch (err) {
      console.error("Error deleting camera:", err);
    }
  },

  
}));
