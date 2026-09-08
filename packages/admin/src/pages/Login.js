import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";
export default function Login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { data } = await apiClient.post("/auth/login", { email, password });
            // The login endpoint is shared across all roles — a valid password
            // doesn't mean this is an admin account. Reject here rather than
            // silently granting a student/institution/vendor/partner account
            // access to this app.
            if (data.user.role !== "admin") {
                setError("This account doesn't have admin access.");
                setLoading(false);
                return;
            }
            setAuth(data.user, data.accessToken, data.refreshToken);
            navigate("/");
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Invalid email or password.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4", children: _jsxs("div", { className: "card w-full max-w-sm", children: [_jsxs("div", { className: "flex items-center gap-2.5 mb-6", children: [_jsx("img", { src: "/logo.png", alt: "logo", className: "w-8 h-8 rounded-lg object-contain" }), _jsxs("span", { className: "text-base font-extrabold tracking-tight", children: ["R-Pro ", _jsx("span", { className: "text-brand", children: "Apply" }), " ", _jsx("span", { className: "text-muted font-normal", children: "Admin" })] })] }), _jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-6", children: "Sign in" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "field-label", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "field-input" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "field-label", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "field-input" })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Signing in…" : "Sign in" })] })] }) }));
}
