import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { DESTINATION_LIST } from "../data/destinations";
const COLUMNS = [
    { title: "Students", links: [{ label: "Register", to: "/register" }, { label: "Log In", to: "/login" }] },
    {
        title: "Destinations",
        links: DESTINATION_LIST.map((d) => ({ label: d.name, to: `/destinations/${d.code}` })),
    },
    {
        title: "Partners",
        links: [
            { label: "Institutions", to: "/institutions" },
            { label: "Recruitment Partners", to: "/recruitment-partners" },
            { label: "Vendors", to: "/vendors" },
        ],
    },
];
export default function Footer() {
    return (_jsx("div", { className: "bg-[#080808] text-white px-6 md:px-8 pt-16 pb-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [_jsx("img", { src: "/logo.png", alt: "logo", className: "w-8 h-8 rounded-lg object-contain" }), _jsxs("span", { className: "font-extrabold", children: ["R-Pro ", _jsx("span", { className: "text-brand", children: "Apply" })] })] }), _jsx("p", { className: "text-white/50 text-sm leading-relaxed", children: "The complete study-abroad ecosystem for African higher institutions." })] }), COLUMNS.map((col) => (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold mb-3", children: col.title }), _jsx("div", { className: "space-y-2", children: col.links.map((l) => (_jsx(Link, { to: l.to, className: "block text-sm text-white/50 hover:text-white transition-colors", children: l.label }, l.label))) })] }, col.title)))] }), _jsxs("div", { className: "pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/35", children: [_jsx("span", { children: "\u00A9 2026 R-Pro Group. All rights reserved." }), _jsx("span", { children: "customercare@rprogroup.com.ng" })] })] }) }));
}
