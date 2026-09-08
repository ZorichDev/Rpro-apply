import { apiClient } from "./client";

export function fetchPrograms(params?: { country?: string; level?: string; q?: string }) {
  return apiClient.get("/programs", { params });
}

export function fetchProgram(id: string) {
  return apiClient.get(`/programs/${id}`);
}

export function fetchMyPrograms() {
  return apiClient.get("/programs/mine/list");
}

export function createProgramRequest(payload: {
  title: string;
  level: string;
  country: string;
  tuitionAmount: number;
  currency: string;
  description?: string;
}) {
  return apiClient.post("/programs", payload);
}

export function updateProgramRequest(id: string, payload: Partial<{
  title: string;
  level: string;
  country: string;
  tuitionAmount: number;
  currency: string;
  description?: string;
}>) {
  return apiClient.patch(`/programs/${id}`, payload);
}

export function setProgramActiveRequest(id: string, isActive: boolean) {
  return apiClient.patch(`/programs/${id}/active`, { isActive });
}
