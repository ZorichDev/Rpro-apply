import { apiClient } from "./client";
export function createLoanRequestRequest(payload) {
    return apiClient.post("/loan-requests", payload);
}
export function fetchMyLoanRequests() {
    return apiClient.get("/loan-requests/mine");
}
export function fetchReceivedLoanRequests() {
    return apiClient.get("/loan-requests/received");
}
export function decideLoanRequestRequest(id, status, note) {
    return apiClient.patch(`/loan-requests/${id}/decide`, { status, note });
}
