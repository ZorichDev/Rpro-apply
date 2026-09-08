import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchReceivedApplications, updateApplicationStatus } from "../../api/applications";
import { fetchStudentDocuments, verifyDocumentRequest, downloadDocument } from "../../api/documents";
import { DOCUMENT_TYPE_LABELS } from "shared";
import StatusBadge from "../../components/StatusBadge";
const nextActions = {
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
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const [verifyingId, setVerifyingId] = useState(null);
    function load() {
        fetchReceivedApplications()
            .then(({ data }) => setApplications(data.applications))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleAction(id, status) {
        setBusyId(id);
        try {
            await updateApplicationStatus(id, { status });
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    async function toggleDocuments(app) {
        if (expandedId === app._id) {
            setExpandedId(null);
            return;
        }
        if (!app.studentId)
            return;
        setExpandedId(app._id);
        setDocsLoading(true);
        try {
            const { data } = await fetchStudentDocuments(app.studentId._id);
            setDocuments(data.documents);
        }
        finally {
            setDocsLoading(false);
        }
    }
    async function handleVerify(docId) {
        setVerifyingId(docId);
        try {
            await verifyDocumentRequest(docId);
            setDocuments((prev) => prev.map((d) => (d._id === docId ? { ...d, isVerified: true } : d)));
        }
        finally {
            setVerifyingId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (applications.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "Nothing's come in yet. You'll see applications here as soon as a student applies to one of your programs." });
    }
    return (_jsx("div", { className: "max-w-2xl grid gap-3", children: applications.map((a) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsxs("p", { className: "font-bold", children: [a.studentId ? `${a.studentId.firstName} ${a.studentId.lastName}` : "Unknown student", " — ", a.programId?.title ?? "Deleted program"] }), _jsx(StatusBadge, { status: a.status })] }), _jsx("p", { className: "text-sm text-muted mt-1", children: a.studentId ? `${a.studentId.country} · ${a.studentId.email}` : "This student's account no longer exists" }), _jsx("p", { className: "text-sm text-ink2 mt-3", children: a.personalStatement }), _jsxs("div", { className: "flex gap-3 mt-4 flex-wrap", children: [nextActions[a.status]?.map((action) => (_jsx("button", { disabled: busyId === a._id, onClick: () => handleAction(a._id, action.status), className: "btn-secondary !px-3 !py-1.5 !text-xs", children: action.label }, action.status))), _jsx("button", { onClick: () => toggleDocuments(a), disabled: !a.studentId, className: "text-xs font-semibold text-brand disabled:opacity-40", children: expandedId === a._id ? "Hide documents" : "View documents" })] }), expandedId === a._id && (_jsx("div", { className: "mt-4 pt-4 border-t border-line space-y-2", children: docsLoading ? (_jsx("p", { className: "text-xs text-muted", children: "Loading documents\u2026" })) : documents.length === 0 ? (_jsx("p", { className: "text-xs text-muted", children: "No documents uploaded yet." })) : (documents.map((doc) => (_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 text-sm", children: [_jsx("span", { children: DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `badge ${doc.isVerified ? "badge-success" : "badge-muted"}`, children: doc.isVerified ? "Verified" : "Pending" }), _jsx("button", { onClick: () => downloadDocument(doc._id, doc.originalName), className: "text-xs font-semibold text-brand", children: "Download" }), !doc.isVerified && (_jsx("button", { onClick: () => handleVerify(doc._id), disabled: verifyingId === doc._id, className: "text-xs font-semibold text-success disabled:opacity-50", children: verifyingId === doc._id ? "Verifying…" : "Verify" }))] })] }, doc._id)))) }))] }, a._id))) }));
}
