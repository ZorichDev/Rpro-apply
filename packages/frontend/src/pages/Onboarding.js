import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES, INSTITUTION_TYPES, SERVICE_CATEGORIES } from "shared";
import { useAuthStore } from "../store/authStore";
import { updateProfileRequest } from "../api/users";
import { dashboardPathForRole } from "../utils/roleRouting";
// Collects the role-specific fields that /auth/register intentionally
// skips (see backend authController). One form per role, same page.
export default function Onboarding() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const [fields, setFields] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    if (!user)
        return null;
    function update(key, value) {
        setFields((prev) => ({ ...prev, [key]: value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await updateProfileRequest(fields);
            navigate(dashboardPathForRole(user.role));
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not save your profile.");
        }
        finally {
            setLoading(false);
        }
    }
    const inputClass = "field-input";
    const labelClass = "field-label";
    function renderFields() {
        switch (user.role) {
            case ROLES.STUDENT:
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "First name" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("firstName", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Last name" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("lastName", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Country" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("country", e.target.value) })] })] }));
            case ROLES.INSTITUTION:
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Institution name" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("institutionName", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Country" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("country", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Institution type" }), _jsxs("select", { required: true, className: inputClass, onChange: (e) => update("institutionType", e.target.value), defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Select type" }), INSTITUTION_TYPES.map((t) => (_jsx("option", { value: t, children: t.replace("_", " ") }, t)))] })] })] }));
            case ROLES.VENDOR:
                return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Company name" }), _jsx("input", { required: true, className: inputClass, onChange: (e) => update("companyName", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Service category" }), _jsxs("select", { required: true, className: inputClass, onChange: (e) => update("serviceCategory", e.target.value), defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Select category" }), SERVICE_CATEGORIES.map((c) => (_jsx("option", { value: c, children: c.replace("_", " ") }, c)))] })] })] }));
            case ROLES.RECRUITMENT_PARTNER:
                return (_jsx("p", { className: "text-muted text-sm", children: "Your referral code was generated automatically. Nothing else to fill in yet." }));
            default:
                return null;
        }
    }
    return (_jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4", children: _jsxs("div", { className: "card w-full max-w-sm", children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-6", children: "Complete your profile" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [renderFields(), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Saving…" : "Continue" })] })] }) }));
}
