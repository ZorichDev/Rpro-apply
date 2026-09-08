import { Link } from "react-router-dom";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

const STEPS = [
  { n: "1", icon: "📝", title: "Sign up", desc: "Register as a Recruitment Partner and complete a short onboarding." },
  { n: "2", icon: "🔗", title: "Get your unique link", desc: "Receive your personal referral link. Share it anywhere." },
  { n: "3", icon: "🎓", title: "Students register through it", desc: "Every student who signs up through your link is attributed to you." },
  { n: "4", icon: "💰", title: "Earn on every enrolment", desc: "When your referred student pays for a service, you earn commission." },
];

const SALES_COMMISSION = [
  { l: "Self-referred + self-closed", v: "10%", d: "You bring and close = full 10%" },
  { l: "Referred, company closes", v: "7%", d: "You bring, company employee closes" },
  { l: "Paid to you", v: "Monthly", d: "Via bank transfer on the 10th" },
];

const SUCCESS_BONUS = [
  { l: "Study Abroad — Referral only", v: "₦250K", d: "Paid when student resumes studies" },
  { l: "Study Abroad — Self-close", v: "₦300K", d: "Referrer ₦250K + Closer ₦50K" },
  { l: "Health Tourism — Referral only", v: "$75", d: "Paid when client visits hospital" },
];

export default function RecruitmentPartnersPage() {
  return (
    <div className="font-sans bg-white text-ink">
      <TopNav />

      <div className="bg-gradient-to-br from-navy to-navy-dark text-white px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-3">Recruitment Partners</p>
            <h1 className="font-display font-black text-5xl tracking-tight leading-tight mb-5">
              Share your link.
              <br />
              <span className="text-brand">Earn every time.</span>
            </h1>
            <p className="text-white/75 leading-relaxed mb-7">
              Get your unique referral link and earn commission every time a student registers, applies, and
              enrols through R-Pro Apply. Real-time earnings, transparent commission, monthly payouts.
            </p>
            <Link to="/register" className="btn-primary inline-block">
              Get My Referral Link →
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Your Earnings Potential</p>
            {[
              { l: "Referral Commission", v: "7%" },
              { l: "Self-close Commission", v: "10%" },
              { l: "Study Abroad Success Bonus", v: "₦250K" },
            ].map((s) => (
              <div key={s.l} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                <span className="text-sm text-white/80">{s.l}</span>
                <span className="text-lg font-extrabold text-brand">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight text-center mb-10">Your link. Your earnings.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="card text-center">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">{s.icon}</div>
                <p className="text-xs text-brand font-bold tracking-wide mb-1.5">STEP {s.n}</p>
                <p className="font-bold mb-1.5">{s.title}</p>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-soft px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight text-center mb-3">Transparent. Guaranteed. Timely.</h2>
          <p className="text-sm text-muted text-center max-w-lg mx-auto mb-10">
            Governed by the R-Pro Group Incentive & Commission Policy. Same rate card for every Recruitment Partner.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card">
              <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Sales Commission</p>
              {SALES_COMMISSION.map((r, i) => (
                <div key={r.l} className={`flex justify-between items-center py-3.5 ${i < SALES_COMMISSION.length - 1 ? "border-b border-line" : ""}`}>
                  <div>
                    <p className="text-sm font-bold">{r.l}</p>
                    <p className="text-xs text-muted">{r.d}</p>
                  </div>
                  <p className="text-lg font-extrabold text-brand">{r.v}</p>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="text-xs uppercase tracking-widest text-navy font-bold mb-4">Success Bonus</p>
              {SUCCESS_BONUS.map((r, i) => (
                <div key={r.l} className={`flex justify-between items-center py-3.5 ${i < SUCCESS_BONUS.length - 1 ? "border-b border-line" : ""}`}>
                  <div>
                    <p className="text-sm font-bold">{r.l}</p>
                    <p className="text-xs text-muted">{r.d}</p>
                  </div>
                  <p className="text-lg font-extrabold text-navy">{r.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 border border-dashed border-line rounded-xl px-6 py-4 text-center text-sm text-muted">
            💡 <strong className="text-ink">Sales Commission</strong> and <strong className="text-ink">Success Bonus</strong> are
            separate reward streams — you earn both on qualifying transactions.
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy to-navy-dark px-6 md:px-8 py-16 text-center text-white">
        <h2 className="font-display font-black text-3xl tracking-tight mb-3">Ready to start earning?</h2>
        <p className="text-white/75 max-w-xl mx-auto mb-6">
          Get your referral link in minutes. No paperwork mountain. Just share and earn.
        </p>
        <Link to="/register" className="btn-primary inline-block">Get My Referral Link Now →</Link>
      </div>

      <Footer />
    </div>
  );
}
