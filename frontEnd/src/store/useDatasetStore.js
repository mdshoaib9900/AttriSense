import { create } from "zustand";

export const useDatasetStore = create((set) => ({
  dataset: null,
  analysis: null,
  loading: false,
  error: null,

  fetchMetadata: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/datasets/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      set({ dataset: json.dataset || null, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAnalysis: async (token) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/datasets/analyze", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Analyze failed");
      set({ analysis: json.analysis, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clear: () => set({ dataset: null, analysis: null, error: null })
}));
