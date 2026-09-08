import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CURRENCIES } from "shared";
import { fetchMyPrograms, createProgramRequest, updateProgramRequest, setProgramActiveRequest } from "../../api/programs";
import { formatCurrency } from "../../utils/currency";
const emptyForm = { title: "", level: "undergraduate", country: "", tuitionAmount: "", currency: "NGN" };
export default function ManagePrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [busyId, setBusyId] = useState(null);
    function load() {
        fetchMyPrograms()
            .then(({ data }) => setPrograms(data.programs))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    function startEdit(p) {
        setEditingId(p._id);
        setShowForm(true);
        setForm({ title: p.title, level: p.level, country: p.country, tuitionAmount: String(p.tuitionAmount), currency: p.currency });
    }
    function cancelForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setError(null);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        const payload = {
            title: form.title,
            level: form.level,
            country: form.country,
            tuitionAmount: Number(form.tuitionAmount),
            currency: form.currency,
        };
        try {
            if (editingId) {
                await updateProgramRequest(editingId, payload);
            }
            else {
                await createProgramRequest(payload);
            }
            cancelForm();
            load();
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not save program.");
        }
        finally {
            setSaving(false);
        }
    }
    async function handleToggleActive(p) {
        setBusyId(p._id);
        try {
            await setProgramActiveRequest(p._id, !p.isActive);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    return (_jsxs("div", { className: "max-w-2xl space-y-6", children: [_jsx("button", { onClick: () => (showForm ? cancelForm() : setShowForm(true)), className: "btn-primary", children: showForm ? "Cancel" : "Add program" }), showForm && (_jsxs("form", { onSubmit: handleSubmit, className: "card space-y-3 max-w-md", children: [_jsx("input", { required: true, placeholder: "Program title", className: "field-input", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }) }), _jsxs("select", { className: "field-input", value: form.level, onChange: (e) => setForm({ ...form, level: e.target.value }), children: [_jsx("option", { value: "undergraduate", children: "Undergraduate" }), _jsx("option", { value: "postgraduate", children: "Postgraduate" }), _jsx("option", { value: "diploma", children: "Diploma" }), _jsx("option", { value: "certificate", children: "Certificate" })] }), _jsx("input", { required: true, placeholder: "Country", className: "field-input", value: form.country, onChange: (e) => setForm({ ...form, country: e.target.value }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { required: true, type: "number", min: "0", placeholder: "Annual tuition", className: "field-input flex-1", value: form.tuitionAmount, onChange: (e) => setForm({ ...form, tuitionAmount: e.target.value }) }), _jsx("select", { className: "field-input !w-28", value: form.currency, onChange: (e) => setForm({ ...form, currency: e.target.value }), children: CURRENCIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: saving, className: "btn-primary", children: saving ? "Saving…" : editingId ? "Save changes" : "Create program" })] })), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : programs.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "Add your first program above \u2014 students won't see this dashboard, only what you publish here." })) : (_jsx("div", { className: "grid gap-3", children: programs.map((p) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: p.title }), _jsxs("p", { className: "text-sm text-muted", children: [p.country, " \u00B7 ", p.level, " \u00B7 ", formatCurrency(p.tuitionAmount, p.currency), "/yr"] })] }), _jsx("span", { className: `badge ${p.isActive ? "badge-success" : "badge-muted"}`, children: p.isActive ? "Live" : "Deactivated" })] }), _jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx("button", { onClick: () => startEdit(p), className: "btn-secondary !text-xs", children: "Edit" }), _jsx("button", { onClick: () => handleToggleActive(p), disabled: busyId === p._id, className: "text-xs font-semibold text-brand disabled:opacity-50", children: busyId === p._id ? "Working…" : p.isActive ? "Deactivate" : "Reactivate" })] })] }, p._id))) }))] }));
}
