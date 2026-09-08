import { apiClient } from "./client";

export function createOrderRequest(serviceId: string) {
  return apiClient.post("/orders", { serviceId });
}

export function fetchMyOrders() {
  return apiClient.get("/orders/mine");
}

export function payOrderRequest(id: string) {
  return apiClient.post(`/orders/${id}/pay`);
}

export function initiateCheckoutRequest(id: string) {
  return apiClient.post<{ paymentLink: string }>(`/orders/${id}/checkout`);
}

export function verifyCheckoutRequest(transactionId: string, txRef: string) {
  return apiClient.post("/orders/verify", { transactionId, txRef });
}

export function fetchMyEarnings() {
  return apiClient.get("/orders/earnings");
}

export function fetchMyBonuses() {
  return apiClient.get("/orders/bonuses");
}

// A plain <a href> can't attach the Authorization header a protected
// download needs, so this fetches the CSV as a blob through the
// authenticated apiClient and triggers the browser's save dialog manually
// — same pattern used for document downloads.
export async function downloadMonthlyReport(month: string): Promise<void> {
  const response = await apiClient.get(`/orders/earnings/report`, {
    params: { month },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `commission-report-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
