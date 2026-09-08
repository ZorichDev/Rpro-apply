import { Link } from "react-router-dom";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

const BENEFITS = [
  { icon: "🌍", title: "Pan-African reach", desc: "Get discovered by qualified students from all 54 African countries — not just your home market." },
  { icon: "✓", title: "Pre-verified applicants", desc: "Every student's documents are pre-checked before applications reach you." },
  { icon: "⚡", title: "Faster processing", desc: "Standardised applications and centralised communication cut admissions processing time significantly." },
  { icon: "📊", title: "Real-time analytics", desc: "Track applications, conversion rates, and enrolment trends by country, programme, and cohort." },
  { icon: "🎯", title: "Higher quality applications", desc: "Profile matching means students apply to programmes that fit — improving yield." },
  { icon: "🤝", title: "Direct student engagement", desc: "Message students, invite them to interviews, and send offers directly through the platform." },
];

const STEPS = [
  { n: "1", title: "Sign the partnership", desc: "Complete a short institutional agreement outlining programmes, tuition, and admissions criteria." },
  { n: "2", title: "Upload your programmes", desc: "We help you upload your programme catalogue, admission requirements, and intake schedules." },
  { n: "3", title: "Receive applications", desc: "Get verified applications, complete with documents and quality checks pre-applied." },
  { n: "4", title: "Send offers, enrol students", desc: "Review, interview, and send offers directly through R-Pro Apply. Track every step." },
];

export default function InstitutionsPage() {
  return (
    <div className="font-sans bg-white text-ink">
      <TopNav />

      <div className="bg-ink text-white px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Partner Institutions</p>
            <h1 className="font-display font-black text-5xl tracking-tight leading-tight mb-5">
              Grow your enrolment.
              <br />
              <span className="text-brand">Diversify your campus.</span>
            </h1>
            <p className="text-white/70 leading-relaxed mb-7">
              Join thousands of African universities, polytechnics, colleges, and apprenticeships on R-Pro Apply.
              Receive quality applications from verified students across all 54 African countries.
            </p>
            <Link to="/register" className="btn-primary inline-block">
              Become a Partner Institution →
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Dashboard Preview</p>
            {[
              { l: "Applications This Month", v: "342" },
              { l: "Verified Documents", v: "1,246" },
              { l: "Cross-Border Enrolments", v: "87" },
            ].map((s) => (
              <div key={s.l} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                <span className="text-sm text-white/75">{s.l}</span>
                <span className="text-lg font-extrabold">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight text-center mb-10">
            Why African institutions choose R-Pro Apply
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card">
                <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-xl mb-3">{b.icon}</div>
                <p className="font-bold mb-1.5">{b.title}</p>
                <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-soft px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-2xl tracking-tight text-center mb-10">Onboard in 4 simple steps</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-bold mb-3">{s.n}</div>
                <p className="font-bold mb-1.5">{s.title}</p>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-16">
        <div className="max-w-2xl mx-auto bg-ink text-white rounded-2xl p-12 text-center">
          <h2 className="font-display font-black text-3xl tracking-tight mb-3">Ready to grow your enrolment?</h2>
          <p className="text-white/70 mb-7">
            Register your institution and our Partner Relations team will reach out within 48 hours.
          </p>
          <Link to="/register" className="btn-primary inline-block">Request Partnership →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
