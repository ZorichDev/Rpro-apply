import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { fetchPrograms } from "../api/programs";
import { formatCurrency } from "../utils/currency";
const ROLES = [
    {
        title: "Student",
        desc: "Apply to universities, polytechnics, colleges, and apprenticeships across Africa with one profile.",
        cta: "Sign Up Free",
        to: "/register",
        accent: "text-brand",
        bg: "bg-brand/10",
    },
    {
        title: "Institution",
        desc: "Receive verified applications from students across Africa. Manage admissions end to end.",
        cta: "Become a Partner",
        to: "/register",
        accent: "text-success",
        bg: "bg-success/10",
    },
    {
        title: "Vendor",
        desc: "Provide services to students — test prep, loans, visa support, accommodation, and more.",
        cta: "List Your Service",
        to: "/register",
        accent: "text-info",
        bg: "bg-info/10",
    },
    {
        title: "Recruitment Partner",
        desc: "Get your unique referral link and earn commission when students sign up through you.",
        cta: "Get My Link",
        to: "/register",
        accent: "text-navy",
        bg: "bg-navy/10",
    },
];
const STATS = [
    { v: "12,000+", l: "African Programmes" },
    { v: "8,000+", l: "Institutions" },
    { v: "54", l: "African Countries" },
];
const WHAT_WE_DO = [
    {
        icon: "🎓",
        title: "One profile, every application",
        desc: "Build your academic profile once and use it to apply to as many universities, polytechnics, colleges, and apprenticeships as you want — no re-entering the same information for every school.",
    },
    {
        icon: "✓",
        title: "Document verification",
        desc: "Upload your WAEC, JAMB, transcripts, and ID once. Institutions reviewing your application can see exactly what's verified, cutting down back-and-forth over missing paperwork.",
    },
    {
        icon: "💳",
        title: "Add-on services",
        desc: "Test prep, study loans, visa support, accommodation — vendors list real services you can add directly to your application and pay for through the platform.",
    },
    {
        icon: "🤝",
        title: "Referral network",
        desc: "Teachers, alumni, and community leaders can refer students through a personal link and earn commission when those students use paid services on the platform.",
    },
    {
        icon: "🏫",
        title: "Admissions tools for institutions",
        desc: "Institutions list programmes, receive organized applications with pre-attached documents, and move each one through review to a decision without leaving the platform.",
    },
    {
        icon: "🌍",
        title: "Built for the whole continent",
        desc: "Pricing, currency, and country data reflect where a student, institution, or vendor is actually based — not a single assumed market.",
    },
];
export default function Landing() {
    const [statIndex, setStatIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setStatIndex((i) => (i + 1) % STATS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);
    const [featuredPrograms, setFeaturedPrograms] = useState([]);
    useEffect(() => {
        // Pulls whatever institutions have actually published — this section
        // updates itself automatically as institutions add programs, with no
        // manual step to feature anything here.
        fetchPrograms()
            .then(({ data }) => setFeaturedPrograms(data.programs.slice(0, 6)))
            .catch(() => setFeaturedPrograms([]));
    }, []);
    return (_jsxs("div", { className: "font-sans bg-white text-ink", children: [_jsx(TopNav, {}), _jsx("div", { className: "bg-gradient-to-b from-soft to-white px-6 md:px-8 pt-16 pb-20", children: _jsxs("div", { className: "max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "font-display font-black text-5xl md:text-6xl leading-[1.02] tracking-tight mb-6", children: ["Your Future", _jsx("br", {}), _jsx("span", { className: "text-brand", children: "Goes Beyond" }), _jsx("br", {}), _jsx("span", { className: "text-brand", children: "African Borders" })] }), _jsx("p", { className: "text-muted text-lg leading-relaxed max-w-md mb-8", children: "Explore thousands of African universities, polytechnics, and colleges. Submit your best application with one verified profile." }), _jsx(Link, { to: "/register", className: "btn-primary inline-block", children: "Register as a Student \u2192" })] }), _jsxs("div", { className: "relative h-[420px] hidden md:flex items-center justify-center", children: [_jsxs("div", { className: "absolute w-72 card shadow-xl -rotate-6 -translate-x-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-xl", children: "\uD83C\uDF93" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold", children: "Covenant University" }), _jsx("p", { className: "text-xs text-muted", children: "\uD83C\uDDF3\uD83C\uDDEC Nigeria \u00B7 BSc Computer Science" })] })] }), _jsx("span", { className: "badge badge-success mb-4", children: "\u2713 Application Approved" }), _jsx("p", { className: "text-xs text-muted mb-2", children: "Programme Match: 94%" }), _jsx("div", { className: "h-1.5 bg-line rounded-full", children: _jsx("div", { className: "h-full w-[94%] bg-success rounded-full" }) })] }), _jsxs("div", { className: "absolute w-72 card shadow-lg rotate-4 translate-x-10 translate-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-11 h-11 bg-info/10 rounded-xl flex items-center justify-center text-xl", children: "\uD83C\uDF93" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold", children: "University of Cape Town" }), _jsx("p", { className: "text-xs text-muted", children: "\uD83C\uDDFF\uD83C\uDDE6 South Africa \u00B7 Engineering" })] })] }), _jsx("span", { className: "badge badge-amber", children: "\u23F3 Under Review" }), _jsx("p", { className: "text-xs text-muted mt-3", children: "Application submitted 3 days ago" })] })] })] }) }), _jsx("div", { className: "border-t border-line px-6 md:px-8 py-14", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("div", { className: "hidden md:grid grid-cols-3 gap-6 text-center", children: STATS.map((s) => (_jsxs("div", { children: [_jsx("p", { className: "font-display font-black text-4xl text-brand tracking-tight mb-1", children: s.v }), _jsx("p", { className: "text-sm text-muted font-semibold", children: s.l })] }, s.l))) }), _jsxs("div", { className: "md:hidden text-center", style: { perspective: "600px" }, children: [_jsxs("div", { className: "animate-stat-flip", children: [_jsx("p", { className: "font-display font-black text-4xl text-brand tracking-tight mb-1", children: STATS[statIndex].v }), _jsx("p", { className: "text-sm text-muted font-semibold", children: STATS[statIndex].l })] }, statIndex), _jsx("div", { className: "flex justify-center gap-1.5 mt-4", children: STATS.map((s, i) => (_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${i === statIndex ? "bg-brand" : "bg-line"}` }, s.l))) })] })] }) }), featuredPrograms.length > 0 && (_jsx("div", { className: "px-6 md:px-8 py-16", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-end justify-between mb-8 flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display font-black text-2xl md:text-3xl tracking-tight mb-1", children: "Programmes open right now" }), _jsx("p", { className: "text-muted text-sm", children: "Newly listed by institutions on the platform." })] }), _jsx(Link, { to: "/register", className: "text-sm font-bold text-brand", children: "See all programmes \u2192" })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredPrograms.map((p) => (_jsxs("div", { className: "card !p-5", children: [_jsx("p", { className: "font-bold", children: p.title }), _jsxs("p", { className: "text-sm text-muted mt-1", children: [p.institutionId.institutionName, " \u00B7 ", p.country] }), _jsxs("p", { className: "text-sm text-muted", children: [p.level, " \u00B7 ", formatCurrency(p.tuitionAmount, p.currency), "/yr"] })] }, p._id))) })] }) })), _jsx("div", { className: "px-6 md:px-8 py-20 border-t border-line", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12 max-w-2xl mx-auto", children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-brand font-bold mb-3", children: "What We Do" }), _jsx("h2", { className: "font-display font-black text-3xl md:text-4xl tracking-tight mb-3", children: "Everything an application actually needs, in one place" }), _jsx("p", { className: "text-muted", children: "R-Pro Apply isn't just a directory of schools \u2014 it's the whole process, from building a profile to paying for the services that get you there." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: WHAT_WE_DO.map((item) => (_jsxs("div", { className: "card", children: [_jsx("div", { className: "w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-xl mb-4", children: item.icon }), _jsx("h3", { className: "font-bold mb-2", children: item.title }), _jsx("p", { className: "text-sm text-muted leading-relaxed", children: item.desc })] }, item.title))) })] }) }), _jsx("div", { className: "bg-ink text-white px-6 md:px-8 py-20", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-brand font-bold mb-3", children: "About Us" }), _jsx("h2", { className: "font-display font-black text-3xl md:text-4xl tracking-tight mb-6", children: "A product of R-Pro Group" }), _jsx("p", { className: "text-white/70 leading-relaxed mb-4 max-w-2xl mx-auto", children: "R-Pro Apply exists because applying to higher education across Africa has historically meant dealing with a different process, different requirements, and different paperwork for every single institution \u2014 even within the same country. That friction keeps qualified students from ever finding programmes that would have been a good fit." }), _jsx("p", { className: "text-white/70 leading-relaxed max-w-2xl mx-auto", children: "We built one platform that works the same way whether a student is applying to a university in Lagos or a polytechnic in Nairobi, and gave institutions, vendors, and recruitment partners the tools to be part of that same process instead of working around it." })] }) }), _jsx("div", { className: "bg-soft px-6 md:px-8 py-20", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "font-display font-black text-3xl md:text-4xl tracking-tight mb-3", children: "Get Started with R-Pro Apply" }), _jsx("p", { className: "text-muted", children: "Whichever role you play in African higher education, we have a home for you." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: ROLES.map((r) => (_jsxs("div", { className: "card", children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center text-xl mb-4`, children: "\u25CF" }), _jsx("h3", { className: "font-display font-black text-xl mb-2", children: r.title }), _jsx("p", { className: "text-sm text-muted leading-relaxed mb-5 min-h-[70px]", children: r.desc }), _jsxs(Link, { to: r.to, className: `text-sm font-bold ${r.accent}`, children: [r.cta, " \u2192"] })] }, r.title))) })] }) }), _jsx(Footer, {})] }));
}
