import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchMyApplications } from "../../api/applications";
import StatusBadge from "../../components/StatusBadge";
export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchMyApplications()
            .then(({ data }) => setApplications(data.applications))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (applications.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No applications yet. Browse programs to get started." });
    }
    return (_jsx("div", { className: "max-w-2xl grid gap-3", children: applications.map((a) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsx("p", { className: "font-bold", children: a.programId?.title ?? "Deleted program" }), _jsx(StatusBadge, { status: a.status })] }), _jsx("p", { className: "text-sm text-muted mt-1", children: a.institutionId ? `${a.institutionId.institutionName} · ${a.institutionId.country}` : "This institution no longer exists" }), a.reviewNote && _jsxs("p", { className: "text-sm text-ink2 mt-3 italic", children: ["\"", a.reviewNote, "\""] })] }, a._id))) }));
}
