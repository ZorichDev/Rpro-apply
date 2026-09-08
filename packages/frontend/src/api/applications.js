import { apiClient } from "./client";
export function submitApplication(payload) {
    return apiClient.post("/applications", payload);
}
export function fetchMyApplications() {
    return apiClient.get("/applications/mine");
}
export function fetchReceivedApplications() {
    return apiClient.get("/applications/received");
}
export function updateApplicationStatus(id, payload) {
    return apiClient.patch(`/applications/${id}/status`, payload);
}
