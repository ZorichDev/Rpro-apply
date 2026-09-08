import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../api/auth";
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!token)
            return;
        setError(null);
        setLoading(true);
        try {
            await resetPasswordRequest(token, newPassword);
            navigate("/login");
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not reset password.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4", children: _jsxs("div", { className: "card w-full max-w-sm", children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-1", children: "Set a new password" }), _jsx("p", { className: "text-muted text-sm mb-6", children: _jsx(Link, { to: "/login", className: "text-brand font-semibold", children: "Back to sign in" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "newPassword", className: "field-label", children: "New password" }), _jsx("input", { id: "newPassword", type: "password", required: true, minLength: 8, value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "field-input" })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Saving…" : "Reset password" })] })] }) }));
}
