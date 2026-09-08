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
  const [featuredPrograms, setFeaturedPrograms] = useState<
    { _id: string; title: string; level: string; country: string; tuitionAmount: number; currency: string; institutionId: { institutionName: string } }[]
  >([]);

  useEffect(() => {
    // Pulls whatever institutions have actually published — this section
    // updates itself automatically as institutions add programs, with no
    // manual step to feature anything here.
    fetchPrograms()
      .then(({ data }) => setFeaturedPrograms(data.programs.slice(0, 6)))
      .catch(() => setFeaturedPrograms([]));
  }, []);

  return (
    <div className="font-sans bg-white text-ink">
      <TopNav />

      {/* HERO */}
      <div className="bg-gradient-to-b from-soft to-white px-6 md:px-8 pt-16 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="font-display font-black text-5xl md:text-6xl leading-[1.02] tracking-tight mb-6">
              Your Future
              <br />
              <span className="text-brand">Goes Beyond</span>
              <br />
              <span className="text-brand">African Borders</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-md mb-8">
              Explore thousands of African universities, polytechnics, and colleges.
              Submit your best application with one verified profile.
            </p>
            <Link to="/register" className="btn-primary inline-block">
              Register as a Student →
            </Link>
          </div>

          {/* Stacked application-status card mockup */}
          <div className="relative h-[420px] hidden md:flex items-center justify-center">
            <div className="absolute w-72 card shadow-xl -rotate-6 -translate-x-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-xl">🎓</div>
                <div>
                  <p className="text-sm font-bold">Covenant University</p>
                  <p className="text-xs text-muted">🇳🇬 Nigeria · BSc Computer Science</p>
                </div>
              </div>
              <span className="badge badge-success mb-4">✓ Application Approved</span>
              <p className="text-xs text-muted mb-2">Programme Match: 94%</p>
              <div className="h-1.5 bg-line rounded-full">
                <div className="h-full w-[94%] bg-success rounded-full" />
              </div>
            </div>

            <div className="absolute w-72 card shadow-lg rotate-4 translate-x-10 translate-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-info/10 rounded-xl flex items-center justify-center text-xl">🎓</div>
                <div>
                  <p className="text-sm font-bold">University of Cape Town</p>
                  <p className="text-xs text-muted">🇿🇦 South Africa · Engineering</p>
                </div>
              </div>
              <span className="badge badge-amber">⏳ Under Review</span>
              <p className="text-xs text-muted mt-3">Application submitted 3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="border-t border-line px-6 md:px-8 py-14">
        <div className="max-w-4xl mx-auto">
          {/* Desktop: all three side by side, plenty of room */}
          <div className="hidden md:grid grid-cols-3 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className="font-display font-black text-4xl text-brand tracking-tight mb-1">{s.v}</p>
                <p className="text-sm text-muted font-semibold">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Mobile: one at a time, flipping to the next every 2.5s — three
              columns were cramping into each other on a narrow screen */}
          <div className="md:hidden text-center" style={{ perspective: "600px" }}>
            <div key={statIndex} className="animate-stat-flip">
              <p className="font-display font-black text-4xl text-brand tracking-tight mb-1">
                {STATS[statIndex].v}
              </p>
              <p className="text-sm text-muted font-semibold">{STATS[statIndex].l}</p>
            </div>
            <div className="flex justify-center gap-1.5 mt-4">
              {STATS.map((s, i) => (
                <span
                  key={s.l}
                  className={`w-1.5 h-1.5 rounded-full ${i === statIndex ? "bg-brand" : "bg-line"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED PROGRAMS — live data from institutions, not curated by hand */}
      {featuredPrograms.length > 0 && (
        <div className="px-6 md:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
              <div>
                <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight mb-1">
                  Programmes open right now
                </h2>
                <p className="text-muted text-sm">Newly listed by institutions on the platform.</p>
              </div>
              <Link to="/register" className="text-sm font-bold text-brand">
                See all programmes →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPrograms.map((p) => (
                <div key={p._id} className="card !p-5">
                  <p className="font-bold">{p.title}</p>
                  <p className="text-sm text-muted mt-1">
                    {p.institutionId.institutionName} · {p.country}
                  </p>
                  <p className="text-sm text-muted">
                    {p.level} · {formatCurrency(p.tuitionAmount, p.currency)}/yr
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WHAT WE DO */}
      <div className="px-6 md:px-8 py-20 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">What We Do</p>
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight mb-3">
              Everything an application actually needs, in one place
            </h2>
            <p className="text-muted">
              R-Pro Apply isn't just a directory of schools — it's the whole process, from building
              a profile to paying for the services that get you there.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="card">
                <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT US */}
      <div className="bg-ink text-white px-6 md:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">About Us</p>
          <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight mb-6">
            A product of R-Pro Group
          </h2>
          <p className="text-white/70 leading-relaxed mb-4 max-w-2xl mx-auto">
            R-Pro Apply exists because applying to higher education across Africa has historically
            meant dealing with a different process, different requirements, and different paperwork
            for every single institution — even within the same country. That friction keeps
            qualified students from ever finding programmes that would have been a good fit.
          </p>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            We built one platform that works the same way whether a student is applying to a
            university in Lagos or a polytechnic in Nairobi, and gave institutions, vendors, and
            recruitment partners the tools to be part of that same process instead of working
            around it.
          </p>
        </div>
      </div>

      {/* GET STARTED — 4 role cards */}
      <div className="bg-soft px-6 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight mb-3">
              Get Started with R-Pro Apply
            </h2>
            <p className="text-muted">Whichever role you play in African higher education, we have a home for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES.map((r) => (
              <div key={r.title} className="card">
                <div className={`w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center text-xl mb-4`}>
                  ●
                </div>
                <h3 className="font-display font-black text-xl mb-2">{r.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-5 min-h-[70px]">{r.desc}</p>
                <Link to={r.to} className={`text-sm font-bold ${r.accent}`}>
                  {r.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
