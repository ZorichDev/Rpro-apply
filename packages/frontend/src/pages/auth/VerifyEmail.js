import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmailRequest } from "../../api/auth";
export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");
    useEffect(() => {
        if (!token)
            return;
        verifyEmailRequest(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);
    return (_jsx("main", { className: "min-h-screen bg-soft flex items-center justify-center px-4", children: _jsxs("div", { className: "card w-full max-w-sm text-center", children: [status === "loading" && _jsx("p", { className: "text-muted text-sm", children: "Verifying your email\u2026" }), status === "success" && (_jsxs(_Fragment, { children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-2", children: "Email verified" }), _jsx("p", { className: "text-muted text-sm mb-6", children: "Your account is confirmed." }), _jsx(Link, { to: "/login", className: "btn-primary inline-block", children: "Sign in \u2192" })] })), status === "error" && (_jsxs(_Fragment, { children: [_jsx("h1", { className: "font-display font-black text-2xl tracking-tight mb-2", children: "Link expired" }), _jsx("p", { className: "text-muted text-sm", children: "This verification link is invalid or has expired." })] }))] }) }));
}
