import { create } from "zustand";
import axios from "axios";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AdminUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "rpro-admin-auth";
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

function loadPersisted(): Pick<AuthState, "user" | "accessToken" | "refreshToken"> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
        .catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
