import { apiClient } from "./client";
export function fetchServices(category) {
    return apiClient.get("/services", { params: category ? { category } : undefined });
}
export function fetchMyServices() {
    return apiClient.get("/services/mine/list");
}
export function createServiceRequest(payload) {
    return apiClient.post("/services", payload);
}
