import { apiClient } from "./client";

export function submitApplication(payload: { programId: string; personalStatement: string }) {
  return apiClient.post("/applications", payload);
}

export function fetchMyApplications() {
  return apiClient.get("/applications/mine");
}

export function fetchReceivedApplications() {
  return apiClient.get("/applications/received");
}

export function updateApplicationStatus(
  id: string,
  payload: { status: string; reviewNote?: string }
) {
  return apiClient.patch(`/applications/${id}/status`, payload);
}
