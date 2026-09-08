import { apiClient } from "./client";
export function registerRequest(email, password, role, referralCode) {
    return apiClient.post("/auth/register", { email, password, role, referralCode });
}
export function loginRequest(email, password) {
    return apiClient.post("/auth/login", { email, password });
}
export function verifyEmailRequest(token) {
    return apiClient.post(`/auth/verify-email/${token}`);
}
export function resendVerificationRequest() {
    return apiClient.post("/auth/resend-verification");
}
export function requestPasswordResetRequest(email) {
    return apiClient.post("/auth/request-password-reset", { email });
}
export function resetPasswordRequest(token, newPassword) {
    return apiClient.post("/auth/reset-password", { token, newPassword });
}
export function refreshRequest(refreshToken) {
    return apiClient.post("/auth/refresh", { refreshToken });
}
export function logoutRequest() {
    return apiClient.post("/auth/logout");
}
