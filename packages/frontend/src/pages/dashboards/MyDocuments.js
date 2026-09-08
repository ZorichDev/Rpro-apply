import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "shared";
import { fetchMyDocuments, uploadDocumentRequest, deleteDocumentRequest, downloadDocument } from "../../api/documents";
export default function MyDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadType, setUploadType] = useState(DOCUMENT_TYPES[0]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    function load() {
        fetchMyDocuments()
            .then(({ data }) => setDocuments(data.documents))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleFileSelected(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        setError(null);
        try {
            await uploadDocumentRequest(file, uploadType);
            load();
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Upload failed.");
        }
        finally {
            setUploading(false);
            if (fileInputRef.current)
                fileInputRef.current.value = "";
        }
    }
    async function handleDelete(id) {
        if (!confirm("Delete this document?"))
            return;
        await deleteDocumentRequest(id);
        load();
    }
    return (_jsxs("div", { className: "max-w-2xl space-y-6", children: [_jsxs("div", { className: "card !p-5 flex items-center gap-3 flex-wrap", children: [_jsx("select", { value: uploadType, onChange: (e) => setUploadType(e.target.value), className: "field-input !w-auto", children: DOCUMENT_TYPES.map((t) => (_jsx("option", { value: t, children: DOCUMENT_TYPE_LABELS[t] }, t))) }), _jsx("button", { onClick: () => fileInputRef.current?.click(), disabled: uploading, className: "btn-primary", children: uploading ? "Uploading…" : "Upload file" }), _jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf,.jpg,.jpeg,.png", onChange: handleFileSelected, className: "hidden" }), _jsx("span", { className: "text-xs text-muted", children: "PDF, JPG, or PNG \u00B7 max 5MB" })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : documents.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "No documents uploaded yet." })) : (_jsx("div", { className: "grid gap-3", children: documents.map((doc) => (_jsxs("div", { className: "card !p-5 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type }), _jsxs("p", { className: "text-sm text-muted", children: [doc.originalName, " \u00B7 ", (doc.sizeBytes / 1024).toFixed(0), " KB"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `badge ${doc.isVerified ? "badge-success" : "badge-muted"}`, children: doc.isVerified ? "Verified" : "Pending review" }), _jsx("button", { onClick: () => downloadDocument(doc._id, doc.originalName), className: "text-xs font-semibold text-brand", children: "Download" }), _jsx("button", { onClick: () => handleDelete(doc._id), className: "text-xs font-semibold text-muted", children: "Delete" })] })] }, doc._id))) }))] }));
}
