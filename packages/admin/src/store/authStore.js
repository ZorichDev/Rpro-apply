import { create } from "zustand";
import axios from "axios";
const STORAGE_KEY = "rpro-admin-auth";
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
function loadPersisted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return { user: null, accessToken: null, refreshToken: null };
        return JSON.parse(raw);
    }
    catch {
        return { user: null, accessToken: null, refreshToken: null };
    }
}
export const useAuthStore = create((set, get) => ({
    ...loadPersisted(),
    setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }));
        set({ user, accessToken, refreshToken });
    },
    logout: () => {
        const token = get().accessToken;
        if (token) {
            axios
                .post(`${baseURL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
                .catch(() => { });
        }
        localStorage.removeItem(STORAGE_KEY);
        set({ user: null, accessToken: null, refreshToken: null });
    },
}));
