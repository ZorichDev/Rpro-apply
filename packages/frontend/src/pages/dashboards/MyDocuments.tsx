import { useEffect, useRef, useState } from "react";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "shared";
import { fetchMyDocuments, uploadDocumentRequest, deleteDocumentRequest, downloadDocument } from "../../api/documents";

interface DocumentRow {
  _id: string;
  type: string;
  originalName: string;
  sizeBytes: number;
  isVerified: boolean;
  createdAt: string;
}

export default function MyDocuments() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState<string>(DOCUMENT_TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    fetchMyDocuments()
      .then(({ data }) => setDocuments(data.documents))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      await uploadDocumentRequest(file, uploadType);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document?")) return;
    await deleteDocumentRequest(id);
    load();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card !p-5 flex items-center gap-3 flex-wrap">
        <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="field-input !w-auto">
          {DOCUMENT_TYPES.map((t) => (
            <option key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary"
        >
          {uploading ? "Uploading…" : "Upload file"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelected}
          className="hidden"
        />
        <span className="text-xs text-muted">PDF, JPG, or PNG · max 5MB</span>
      </div>

      {error && <p className="text-sm text-brand">{error}</p>}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : documents.length === 0 ? (
        <p className="text-muted text-sm">No documents uploaded yet.</p>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <div key={doc._id} className="card !p-5 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">{DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] ?? doc.type}</p>
                <p className="text-sm text-muted">
                  {doc.originalName} · {(doc.sizeBytes / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${doc.isVerified ? "badge-success" : "badge-muted"}`}>
                  {doc.isVerified ? "Verified" : "Pending review"}
                </span>
                <button onClick={() => downloadDocument(doc._id, doc.originalName)} className="text-xs font-semibold text-brand">
                  Download
                </button>
                <button onClick={() => handleDelete(doc._id)} className="text-xs font-semibold text-muted">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
