import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordResetRequest } from "../../api/auth";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await requestPasswordResetRequest(email);
        }
        finally {
            setLoading(false);
            // Same message shown whether or not the email exists — matches the
            // backend's intentional non-disclosure of registered emails.
            setSubmitted(true);
        }
    }
    return (_jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4", children: _jsx("div", { className: "card w-full max-w-sm", children: submitted ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-2", children: "Check your email" }), _jsx("p", { className: "text-muted text-sm", children: "If that email is registered, a reset link is on its way. It expires in 1 hour." })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-1", children: "Reset your password" }), _jsx("p", { className: "text-muted text-sm mb-6", children: _jsx(Link, { to: "/login", className: "text-brand font-semibold", children: "Back to sign in" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "field-label", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "field-input" })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Sending…" : "Send reset link" })] })] })) }) }));
}
