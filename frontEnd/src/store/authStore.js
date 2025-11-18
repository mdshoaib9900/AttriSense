import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  signup: async (name, email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/signup", {
      name,
      email,
      password,
    });

    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const { token, user } = res.data;

    set({
      user,
      token,
      isAuthenticated: true,
    });

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return res.data;
  },

  loadUser: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
