import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { dashboardPathForRole } from "../../utils/roleRouting";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
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
            const { data } = await loginRequest(email, password);
            // Admin accounts have their own dedicated app now — this main app
            // has no admin routes left to send them to.
            if (data.user.role === "admin") {
                setError("Admin accounts sign in through the separate admin app, not here.");
                setLoading(false);
                return;
            }
            setAuth(data.user, data.accessToken, data.refreshToken);
            navigate(dashboardPathForRole(data.user.role));
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Invalid email or password.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { children: [_jsx(TopNav, {}), _jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4 py-16", children: _jsxs("div", { className: "card w-full max-w-sm", children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-1", children: "Sign in" }), _jsxs("p", { className: "text-muted text-sm mb-6", children: ["New here? ", _jsx(Link, { to: "/register", className: "text-brand font-semibold", children: "Create an account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "field-label", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "field-input" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("label", { htmlFor: "password", className: "field-label !mb-0", children: "Password" }), _jsx(Link, { to: "/forgot-password", className: "text-xs text-brand font-semibold", children: "Forgot password?" })] }), _jsx("input", { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "field-input" })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Signing in…" : "Sign in" })] })] }) }), _jsx(Footer, {})] }));
}
