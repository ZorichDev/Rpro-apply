import { useParams, Link } from "react-router-dom";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { DESTINATIONS } from "../../data/destinations";

export default function DestinationPage() {
  const { code } = useParams<{ code: string }>();
  const d = code ? DESTINATIONS[code] : undefined;

  if (!d) {
    return (
      <div className="font-sans bg-white text-ink min-h-screen">
        <TopNav />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-muted">That destination isn't listed yet.</p>
          <Link to="/" className="text-brand font-semibold mt-2 inline-block">Back to home →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white text-ink">
      <TopNav />

      {/* HERO */}
      <div className="bg-gradient-to-br from-brand/10 to-brand/[0.03] px-6 md:px-8 pt-16 pb-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Study Destination</p>
          <p className="text-6xl mb-3">{d.flag}</p>
          <h1 className="font-display font-black text-5xl tracking-tight mb-2">Study in {d.name}</h1>
          <p className="font-display italic text-xl text-brand mb-5">{d.tagline}</p>
          <p className="text-ink2 leading-relaxed max-w-2xl mb-7">{d.hero}</p>
          <Link to="/register" className="btn-primary inline-block">
            Explore Programmes in {d.name} →
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="border-t border-line px-6 md:px-8 py-12">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {d.stats.map(([v, l]) => (
            <div key={l}>
              <p className="font-display font-black text-3xl text-brand tracking-tight mb-1">{v}</p>
              <p className="text-xs text-muted font-semibold">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SCHOOLS */}
      <div className="bg-soft px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight mb-1">Featured Institutions in {d.name}</h2>
          <p className="text-sm text-muted mb-8">Top universities, polytechnics, colleges, and apprenticeships available on R-Pro Apply</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.schools.map((s) => (
              <div key={s.name} className="card">
                <div className="h-14 bg-brand/10 rounded-lg flex items-center justify-center text-2xl mb-3">
                  {d.flag}
                </div>
                <p className="font-bold">{s.name}</p>
                <p className="text-xs text-muted mb-3">{s.location}</p>
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-line mb-3 text-xs">
                  <div>
                    <p className="text-muted">Tuition</p>
                    <p className="font-bold">{s.tuition}</p>
                  </div>
                  <div>
                    <p className="text-muted">Programmes</p>
                    <p className="font-bold">{s.programmes}</p>
                  </div>
                  <div>
                    <p className="text-muted">Intake</p>
                    <p className="font-bold">{s.intake}</p>
                  </div>
                </div>
                <Link to="/register" className="btn-primary w-full text-center block !py-2 !text-xs">
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADMISSIONS REQUIREMENTS */}
      <div className="px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.3fr] gap-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Admissions</p>
            <h2 className="font-display font-black text-2xl tracking-tight mb-3">Admissions Requirements</h2>
            <p className="text-sm text-muted leading-relaxed">
              Typical qualifications needed to apply to universities in {d.name}. Specific requirements vary by institution and programme.
            </p>
          </div>
          <div>
            {d.requirements.map((r, i) => (
              <div key={r} className={`flex items-start gap-3.5 py-3.5 ${i < d.requirements.length - 1 ? "border-b border-line" : ""}`}>
                <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-ink2 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand to-brand-dark px-6 md:px-8 py-16 text-center text-white">
        <h2 className="font-display font-black text-3xl tracking-tight mb-3">Ready to apply to {d.name}?</h2>
        <p className="text-white/85 max-w-xl mx-auto mb-6">
          Register with R-Pro Apply and access every {d.name} institution with one verified profile.
        </p>
        <Link to="/register" className="inline-block bg-white text-brand rounded-lg px-6 py-3 text-sm font-bold">
          Start Your Application →
        </Link>
      </div>

      <Footer />
    </div>
  );
}
