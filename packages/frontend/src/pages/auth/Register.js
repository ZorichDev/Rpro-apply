import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ROLES } from "shared";
import { registerRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
const roleOptions = [
    { value: ROLES.STUDENT, label: "Student" },
    { value: ROLES.INSTITUTION, label: "Institution" },
    { value: ROLES.VENDOR, label: "Vendor" },
    { value: ROLES.RECRUITMENT_PARTNER, label: "Recruitment partner" },
];
export default function Register() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(ROLES.STUDENT);
    const [referralCode, setReferralCode] = useState(searchParams.get("ref") ?? "");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { data } = await registerRequest(email, password, role, referralCode || undefined);
            setAuth(data.user, data.accessToken, data.refreshToken);
            navigate("/onboarding");
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Something went wrong. Try again.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { children: [_jsx(TopNav, {}), _jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4 py-16", children: _jsxs("div", { className: "card w-full max-w-sm", children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-1", children: "Create your account" }), _jsxs("p", { className: "text-muted text-sm mb-6", children: ["Already have one? ", _jsx(Link, { to: "/login", className: "text-brand font-semibold", children: "Sign in" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "role", className: "field-label", children: "I am a" }), _jsx("select", { id: "role", value: role, onChange: (e) => setRole(e.target.value), className: "field-input", children: roleOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "field-label", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "field-input" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "field-label", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), className: "field-input" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "referralCode", className: "field-label", children: "Referral code (optional)" }), _jsx("input", { id: "referralCode", placeholder: "e.g. RPRO-8F2K9A", value: referralCode, onChange: (e) => setReferralCode(e.target.value), className: "field-input" })] }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? "Creating account…" : "Create account" })] })] }) }), _jsx(Footer, {})] }));
}
