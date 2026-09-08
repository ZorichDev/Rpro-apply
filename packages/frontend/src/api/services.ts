import { apiClient } from "./client";

export function fetchServices(category?: string) {
  return apiClient.get("/services", { params: category ? { category } : undefined });
}

export function fetchMyServices() {
  return apiClient.get("/services/mine/list");
}

export function createServiceRequest(payload: {
  title: string;
  category: string;
  description?: string;
  priceAmount: number;
  currency: string;
}) {
  return apiClient.post("/services", payload);
}
