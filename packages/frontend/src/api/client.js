import axios from "axios";
import { useAuthStore } from "../store/authStore";
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
export const apiClient = axios.create({ baseURL });
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Queues concurrent 401s behind a single in-flight refresh, since the
// refresh token rotates on every use — a second simultaneous refresh call
// would fail against the now-stale token the first call already replaced.
let refreshPromise = null;
async function performRefresh() {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken)
        return null;
    try {
        // Deliberately a bare axios call, not apiClient — apiClient's request
        // interceptor would attach the (expired) access token, and importing
        // from api/auth.ts here would create a circular import.
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const { user, accessToken, refreshToken: newRefreshToken } = data;
        useAuthStore.getState().setAuth(user ?? useAuthStore.getState().user, accessToken, newRefreshToken);
        return accessToken;
    }
    catch {
        return null;
    }
}
apiClient.interceptors.response.use((response) => response, async (error) => {
    const original = error.config;
    const isAuthEndpoint = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/refresh");
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
        original._retry = true;
        if (!refreshPromise) {
            refreshPromise = performRefresh().finally(() => {
                refreshPromise = null;
            });
        }
        const newAccessToken = await refreshPromise;
        if (newAccessToken) {
            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(original);
        }
        // Refresh itself failed — the session is genuinely over.
        useAuthStore.getState().logout();
        window.location.href = "/login";
    }
    return Promise.reject(error);
});
