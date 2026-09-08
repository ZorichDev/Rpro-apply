import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CURRENCIES } from "shared";
import { fetchMyServices, createServiceRequest } from "../../api/services";
import { formatCurrency } from "../../utils/currency";
const CATEGORIES = ["test_prep", "loans", "visa", "housing", "insurance", "other"];
export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", category: "test_prep", description: "", priceAmount: "", currency: "NGN" });
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    function load() {
        fetchMyServices()
            .then(({ data }) => setServices(data.services))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleCreate(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            await createServiceRequest({
                title: form.title,
                category: form.category,
                description: form.description || undefined,
                priceAmount: Number(form.priceAmount),
                currency: form.currency,
            });
            setShowForm(false);
            setForm({ title: "", category: "test_prep", description: "", priceAmount: "", currency: "NGN" });
            load();
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not create service.");
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("div", { className: "max-w-2xl space-y-6", children: [_jsx("button", { onClick: () => setShowForm((v) => !v), className: "btn-primary", children: showForm ? "Cancel" : "Add service" }), showForm && (_jsxs("form", { onSubmit: handleCreate, className: "card space-y-3 max-w-md", children: [_jsx("input", { required: true, placeholder: "Service title", className: "field-input", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }) }), _jsx("select", { className: "field-input", value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), children: CATEGORIES.map((c) => (_jsx("option", { value: c, children: c.replace("_", " ") }, c))) }), _jsx("textarea", { placeholder: "Description (optional)", rows: 3, className: "field-input", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { required: true, type: "number", min: "0", placeholder: "Price", className: "field-input flex-1", value: form.priceAmount, onChange: (e) => setForm({ ...form, priceAmount: e.target.value }) }), _jsx("select", { className: "field-input !w-28", value: form.currency, onChange: (e) => setForm({ ...form, currency: e.target.value }), children: CURRENCIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: saving, className: "btn-primary", children: saving ? "Saving…" : "Create service" })] })), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : services.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "Add your first service above \u2014 students will see it once your profile is complete." })) : (_jsx("div", { className: "grid gap-3", children: services.map((s) => (_jsxs("div", { className: "card !p-5", children: [_jsx("p", { className: "font-bold", children: s.title }), _jsxs("p", { className: "text-sm text-muted", children: [s.category.replace("_", " "), " \u00B7 ", formatCurrency(s.priceAmount, s.currency)] })] }, s._id))) }))] }));
}
