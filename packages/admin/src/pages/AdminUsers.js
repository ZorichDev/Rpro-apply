import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchAllUsers, suspendUserRequest, unsuspendUserRequest, removeUserRequest } from "../api/admin";
export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [suspendingId, setSuspendingId] = useState(null);
    const [reason, setReason] = useState("");
    function load() {
        fetchAllUsers()
            .then(({ data }) => setUsers(data.users))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleSuspend(id) {
        setBusyId(id);
        try {
            await suspendUserRequest(id, reason || undefined);
            setSuspendingId(null);
            setReason("");
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    async function handleUnsuspend(id) {
        setBusyId(id);
        try {
            await unsuspendUserRequest(id);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    async function handleRemove(id, email) {
        if (!confirm(`Remove ${email}? Their account will be deactivated — this can't be undone from here.`)) {
            return;
        }
        setBusyId(id);
        try {
            await removeUserRequest(id);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (users.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No users registered yet." });
    return (_jsx("div", { className: "max-w-3xl grid gap-3", children: users.map((u) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: u.email }), _jsx("p", { className: "text-sm text-muted", children: u.role.replace("_", " ") }), u.isSuspended && u.suspendedReason && (_jsxs("p", { className: "text-xs text-brand mt-1", children: ["Reason: ", u.suspendedReason] }))] }), _jsx("div", { className: "flex items-center gap-2", children: u.isSuspended ? (_jsx("span", { className: "badge badge-brand", children: "Suspended" })) : (_jsx("span", { className: "badge badge-success", children: "Active" })) })] }), _jsxs("div", { className: "flex gap-3 mt-4", children: [u.isSuspended ? (_jsx("button", { onClick: () => handleUnsuspend(u._id), disabled: busyId === u._id, className: "btn-secondary !text-xs", children: busyId === u._id ? "Working…" : "Unsuspend" })) : (_jsx("button", { onClick: () => setSuspendingId(suspendingId === u._id ? null : u._id), className: "btn-secondary !text-xs", children: "Suspend" })), _jsx("button", { onClick: () => handleRemove(u._id, u.email), disabled: busyId === u._id, className: "text-xs text-brand font-semibold", children: "Remove" })] }), suspendingId === u._id && (_jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("input", { placeholder: "Reason (optional)", value: reason, onChange: (e) => setReason(e.target.value), className: "field-input !py-1.5 !text-xs flex-1" }), _jsx("button", { onClick: () => handleSuspend(u._id), disabled: busyId === u._id, className: "btn-primary !text-xs !px-3", children: "Confirm" })] }))] }, u._id))) }));
}
