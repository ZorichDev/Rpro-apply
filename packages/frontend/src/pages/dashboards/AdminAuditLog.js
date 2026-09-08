import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchAuditLog } from "../../api/admin";
const ACTION_LABELS = {
    "user.suspend": "suspended",
    "user.unsuspend": "unsuspended",
    "user.remove": "removed",
    "institution.verify": "verified accreditation for",
};
function formatDateTime(iso) {
    return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
export default function AdminAuditLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchAuditLog()
            .then(({ data }) => setLogs(data.logs))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (logs.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No moderation actions taken yet." });
    return (_jsx("div", { className: "max-w-3xl grid gap-3", children: logs.map((log) => (_jsxs("div", { className: "card !p-4", children: [_jsxs("p", { className: "text-sm", children: [_jsx("span", { className: "font-bold", children: log.actorEmail }), " ", _jsx("span", { className: "text-muted", children: ACTION_LABELS[log.action] ?? log.action }), " ", _jsx("span", { className: "font-bold", children: log.targetEmail })] }), _jsxs("p", { className: "text-xs text-muted mt-1", children: [formatDateTime(log.createdAt), log.reason && ` · "${log.reason}"`] })] }, log._id))) }));
}
