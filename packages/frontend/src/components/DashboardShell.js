import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import TopNav from "./TopNav";
import { fetchMe } from "../api/users";
import { resendVerificationRequest } from "../api/auth";
export default function DashboardShell({ title, children }) {
    const [isVerified, setIsVerified] = useState(null);
    const [sendState, setSendState] = useState("idle");
    useEffect(() => {
        fetchMe()
            .then(({ data }) => setIsVerified(Boolean(data.user.isVerified)))
            .catch(() => setIsVerified(null));
    }, []);
    async function handleResend() {
        setSendState("sending");
        try {
            await resendVerificationRequest();
            setSendState("sent");
        }
        catch {
            setSendState("idle");
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-soft", children: [_jsx(TopNav, { variant: "app", title: title }), isVerified === false && (_jsxs("div", { className: "bg-amber-500/10 border-b border-amber-500/20 px-6 md:px-8 py-3 flex items-center justify-between flex-wrap gap-2", children: [_jsx("p", { className: "text-sm text-ink2", children: "Verify your email to unlock full access to your account." }), sendState === "sent" ? (_jsx("span", { className: "text-sm text-success font-semibold", children: "Sent \u2014 check your inbox" })) : (_jsx("button", { onClick: handleResend, disabled: sendState === "sending", className: "text-sm font-bold text-brand disabled:opacity-50", children: sendState === "sending" ? "Sending…" : "Resend verification email" }))] })), _jsxs("main", { className: "max-w-6xl mx-auto px-6 md:px-8 py-10", children: [_jsx("h1", { className: "font-display text-3xl font-black tracking-tight mb-8", children: title }), children] })] }));
}
