import { apiClient } from "./client";
export function fetchPrograms(params) {
    return apiClient.get("/programs", { params });
}
export function fetchProgram(id) {
    return apiClient.get(`/programs/${id}`);
}
export function fetchMyPrograms() {
    return apiClient.get("/programs/mine/list");
}
export function createProgramRequest(payload) {
    return apiClient.post("/programs", payload);
}
export function updateProgramRequest(id, payload) {
    return apiClient.patch(`/programs/${id}`, payload);
}
export function setProgramActiveRequest(id, isActive) {
    return apiClient.patch(`/programs/${id}/active`, { isActive });
}
