import { create } from "zustand";
import axios from "axios";

export const useCameraStore = create((set) => ({
  cameras: [],
  loading: false,
  error: null,

  fetchCameras: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("http://localhost:5000/cameras", {
        withCredentials: true,
      });
      set({ cameras: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addCamera: async (title, link) => {
    try {
      await axios.post("http://localhost:5000/cameras", { title, link });
      const res = await axios.get("http://localhost:5000/cameras");
      set({ cameras: res.data });
    } catch (err) {
      console.error("Error adding camera:", err);
    }
  },

  removeCamera: async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cameras/${id}`);
      set((state) => ({
        cameras: state.cameras.filter((cam) => cam.c_id !== id),
      }));
    } catch (err) {
      console.error("Error deleting camera:", err);
    }
  },
}));
