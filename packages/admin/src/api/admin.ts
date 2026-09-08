import { apiClient } from "./client";

export function fetchAdminStats() {
  return apiClient.get("/admin/stats");
}

export function fetchAllUsers(role?: string) {
  return apiClient.get("/admin/users", { params: role ? { role } : undefined });
}

export function fetchInstitutionsForReview() {
  return apiClient.get("/admin/institutions");
}

export function verifyInstitutionRequest(id: string) {
  return apiClient.patch(`/admin/institutions/${id}/verify`);
}

export function suspendUserRequest(id: string, reason?: string) {
  return apiClient.patch(`/admin/users/${id}/suspend`, { reason });
}

export function unsuspendUserRequest(id: string) {
  return apiClient.patch(`/admin/users/${id}/unsuspend`);
}

export function removeUserRequest(id: string) {
  return apiClient.delete(`/admin/users/${id}`);
}

export function fetchAuditLog() {
  return apiClient.get("/admin/audit-log");
}

export function fetchPartnerEarnings() {
  return apiClient.get("/admin/partners");
}

export function fetchPaidOrders() {
  return apiClient.get("/admin/orders");
}

export function setOrderSelfCloseRequest(id: string, isSelfClose: boolean) {
  return apiClient.patch(`/admin/orders/${id}/self-close`, { isSelfClose });
}

export function fetchAllBonuses() {
  return apiClient.get("/admin/bonuses");
}

export function markBonusPaidRequest(id: string) {
  return apiClient.patch(`/admin/bonuses/${id}/pay`);
}
