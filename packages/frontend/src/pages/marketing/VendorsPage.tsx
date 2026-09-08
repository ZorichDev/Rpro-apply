import { Link } from "react-router-dom";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

const CATEGORIES = [
  { icon: "📚", title: "Test Prep & Tutoring", desc: "JAMB, WAEC, NECO, UTME, IELTS, TOEFL, SAT" },
  { icon: "🎯", title: "Admissions Consulting", desc: "Application coaching, essay review, interviews" },
  { icon: "📄", title: "Document Services", desc: "WAEC verification, transcripts, notarization" },
  { icon: "🏠", title: "Student Accommodation", desc: "Hostels, off-campus housing, short-lets" },
  { icon: "✈️", title: "Regional Travel & Visa", desc: "Student visa processing for cross-border study" },
  { icon: "🩺", title: "Student Health Services", desc: "Health checks, vaccinations, insurance" },
];

const BENEFITS = [
  { icon: "🎯", title: "Pre-qualified student leads", desc: "Reach only students actively planning their applications — higher intent, higher conversion." },
  { icon: "🔗", title: "Pre-integrated with applications", desc: "Students attach your service directly to their application. No re-registration." },
  { icon: "💰", title: "Commission-only pricing", desc: "No monthly fees — you only pay when we deliver a paying customer." },
];

export default function VendorsPage() {
  return (
    <div className="font-sans bg-white text-ink">
      <TopNav />

      <div className="bg-gradient-to-br from-info to-[#0C647F] text-white px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-3">Service Vendors</p>
            <h1 className="font-display font-black text-5xl tracking-tight leading-tight mb-5">
              Reach every African student
              <br />
              who needs your service.
            </h1>
            <p className="text-white/80 leading-relaxed mb-7">
              Whether you offer test prep, study loans, visa processing, or accommodation — R-Pro Apply connects
              you to verified students actively planning their African higher education journey.
            </p>
            <Link to="/register" className="inline-block bg-white text-info rounded-lg px-5 py-2.5 text-sm font-bold">
              List Your Service →
            </Link>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-4">Vendor Reach</p>
            {[
              { l: "Countries Reached", v: "54" },
              { l: "Add-On Services Attached", v: "12K+/mo" },
              { l: "Verified Vendor Partners", v: "120+" },
            ].map((s) => (
              <div key={s.l} className="flex justify-between items-center py-3 border-b border-white/15 last:border-0">
                <span className="text-sm text-white/85">{s.l}</span>
                <span className="text-lg font-extrabold">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight text-center mb-10">What services do students need?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="card">
                <p className="text-2xl mb-2">{c.icon}</p>
                <p className="font-bold text-sm mb-1">{c.title}</p>
                <p className="text-xs text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-soft px-6 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-black text-3xl tracking-tight text-center mb-10">Why list your service on R-Pro Apply?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card">
                <div className="w-11 h-11 bg-info/10 rounded-xl flex items-center justify-center text-xl mb-3">{b.icon}</div>
                <p className="font-bold mb-1.5">{b.title}</p>
                <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-info to-[#0C647F] px-6 md:px-8 py-16 text-center text-white">
        <h2 className="font-display font-black text-3xl tracking-tight mb-3">Ready to reach African students?</h2>
        <p className="text-white/85 max-w-xl mx-auto mb-6">
          Complete vendor onboarding — our Vendor Success team will reach out within 3 working days.
        </p>
        <Link to="/register" className="inline-block bg-white text-info rounded-lg px-6 py-3 text-sm font-bold">
          List Your Service →
        </Link>
      </div>

      <Footer />
    </div>
  );
}
