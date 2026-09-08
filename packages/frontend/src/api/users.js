import { apiClient } from "./client";
export function fetchMe() {
    return apiClient.get("/users/me");
}
export function fetchMyReferrals() {
    return apiClient.get("/users/me/referrals");
}
export function updateProfileRequest(payload) {
    return apiClient.patch("/users/me/profile", payload);
}
