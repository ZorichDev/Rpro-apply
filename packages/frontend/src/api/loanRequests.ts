import { apiClient } from "./client";

export function createLoanRequestRequest(payload: {
  serviceId: string;
  amountRequested: number;
  purpose: string;
  monthlyIncome: number;
}) {
  return apiClient.post("/loan-requests", payload);
}

export function fetchMyLoanRequests() {
  return apiClient.get("/loan-requests/mine");
}

export function fetchReceivedLoanRequests() {
  return apiClient.get("/loan-requests/received");
}

export function decideLoanRequestRequest(id: string, status: "approved" | "rejected", note?: string) {
  return apiClient.patch(`/loan-requests/${id}/decide`, { status, note });
}
