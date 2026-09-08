import { apiClient } from "./client";

export function uploadDocumentRequest(file: File, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  return apiClient.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function fetchMyDocuments() {
  return apiClient.get("/documents/mine");
}

export function deleteDocumentRequest(id: string) {
  return apiClient.delete(`/documents/${id}`);
}

export function fetchStudentDocuments(studentId: string) {
  return apiClient.get(`/documents/student/${studentId}`);
}

export function verifyDocumentRequest(id: string) {
  return apiClient.patch(`/documents/${id}/verify`);
}

// A plain <a href> can't attach the Authorization header a protected
// download needs, so this fetches the file as a blob through the
// authenticated apiClient and triggers the browser's save dialog manually.
export async function downloadDocument(id: string, filename: string): Promise<void> {
  const response = await apiClient.get(`/documents/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
