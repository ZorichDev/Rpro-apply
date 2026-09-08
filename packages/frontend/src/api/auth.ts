import { apiClient } from "./client";
import type { Role } from "shared";

interface AuthResponse {
  user: { id: string; email: string; role: Role };
  accessToken: string;
  refreshToken: string;
}

export function registerRequest(email: string, password: string, role: Role, referralCode?: string) {
  return apiClient.post<AuthResponse>("/auth/register", { email, password, role, referralCode });
}

export function loginRequest(email: string, password: string) {
  return apiClient.post<AuthResponse>("/auth/login", { email, password });
}

export function verifyEmailRequest(token: string) {
  return apiClient.post(`/auth/verify-email/${token}`);
}

export function resendVerificationRequest() {
  return apiClient.post("/auth/resend-verification");
}

export function requestPasswordResetRequest(email: string) {
  return apiClient.post("/auth/request-password-reset", { email });
}

export function resetPasswordRequest(token: string, newPassword: string) {
  return apiClient.post("/auth/reset-password", { token, newPassword });
}

export function refreshRequest(refreshToken: string) {
  return apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
}

export function logoutRequest() {
  return apiClient.post("/auth/logout");
}
