import { useEffect, useState } from "react";
import { fetchReceivedApplications, updateApplicationStatus } from "../../api/applications";
import { fetchStudentDocuments, verifyDocumentRequest, downloadDocument } from "../../api/documents";
import { DOCUMENT_TYPE_LABELS } from "shared";
import StatusBadge from "../../components/StatusBadge";

interface Application {
  _id: string;
  status: string;
  personalStatement: string;
  submittedAt: string;
  studentId: { _id: string; firstName: string; lastName: string; country: string; email: string } | null;
  programId: { title: string; level: string } | null;
}

interface DocRow {
  _id: string;
  type: string;
  originalName: string;
  isVerified: boolean;
}

const nextActions: Record<string, { label: string; status: string }[]> = {
  submitted: [
    { label: "Move to review", status: "under_review" },
    { label: "Reject", status: "rejected" },
  ],
  under_review: [
    { label: "Make offer", status: "offer_made" },
    { label: "Reject", status: "rejected" },
  ],
  offer_made: [
    { label: "Mark accepted", status: "accepted" },
    { label: "Reject", status: "rejected" },
  ],
};

export default function ReviewApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  function load() {
    fetchReceivedApplications()
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAction(id: string, status: string) {
    setBusyId(id);
    try {
      await updateApplicationStatus(id, { status });
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function toggleDocuments(app: Application) {
    if (expandedId === app._id) {
      setExpandedId(null);
      return;
    }
    if (!app.studentId) return;
    setExpandedId(app._id);
    setDocsLoading(true);
    try {
      const { data } = await fetchStudentDocuments(app.studentId._id);
      setDocuments(data.documents);
    } finally {
      setDocsLoading(false);
    }
  }

  async function handleVerify(docId: string) {
    setVerifyingId(docId);
    try {
      await verifyDocumentRequest(docId);
      setDocuments((prev) => prev.map((d) => (d._id === docId ? { ...d, isVerified: true } : d)));
    } finally {
      setVerifyingId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  if (applications.length === 0) {
    return <p className="text-muted text-sm">Nothing's come in yet. You'll see applications here as soon as a student applies to one of your programs.</p>;
  }

  return (
    <div className="max-w-2xl grid gap-3">
      {applications.map((a) => (
        <div key={a._id} className="card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-bold">
              {a.studentId ? `${a.studentId.firstName} ${a.studentId.lastName}` : "Unknown student"}
              {" — "}
              {a.programId?.title ?? "Deleted program"}
            </p>
            <StatusBadge status={a.status} />
          </div>
          <p className="text-sm text-muted mt-1">
            {a.studentId ? `${a.studentId.country} · ${a.studentId.email}` : "This student's account no longer exists"}
          </p>
          <p className="text-sm text-ink2 mt-3">{a.personalStatement}</p>

          <div className="flex gap-3 mt-4 flex-wrap">
            {nextActions[a.status]?.map((action) => (
              <button
                key={action.status}
                disabled={busyId === a._id}
                onClick={() => handleAction(a._id, action.status)}
                className="btn-secondary !px-3 !py-1.5 !text-xs"
              >
                {action.label}
              </button>
            ))}
            <button onClick={() => toggleDocuments(a)} disabled={!a.studentId} className="text-xs font-semibold text-brand disabled:opacity-40">
              {expandedId === a._id ? "Hide documents" : "View documents"}
            </button>
          </div>

          {expandedId === a._id && (
            <div className="mt-4 pt-4 border-t border-line space-y-2">
              {docsLoading ? (
                <p className="text-xs text-muted">Loading documents…</p>
              ) : documents.length === 0 ? (
                <p className="text-xs text-muted">No documents uploaded yet.</p>
              ) : (
                documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between flex-wrap gap-2 text-sm">
                    <span>{DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] ?? doc.type}</span>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${doc.isVerified ? "badge-success" : "badge-muted"}`}>
                        {doc.isVerified ? "Verified" : "Pending"}
                      </span>
                      <button
                        onClick={() => downloadDocument(doc._id, doc.originalName)}
                        className="text-xs font-semibold text-brand"
                      >
                        Download
                      </button>
                      {!doc.isVerified && (
                        <button
                          onClick={() => handleVerify(doc._id)}
                          disabled={verifyingId === doc._id}
                          className="text-xs font-semibold text-success disabled:opacity-50"
                        >
                          {verifyingId === doc._id ? "Verifying…" : "Verify"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
