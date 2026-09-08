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
  return (
    <div className="bg-[#080808] text-white px-6 md:px-8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-extrabold">
                R-Pro <span className="text-brand">Apply</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              The complete study-abroad ecosystem for African higher institutions.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold mb-3">{col.title}</p>
              <div className="space-y-2">
                {col.links.map((l) => (
                  <Link key={l.label} to={l.to} className="block text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/35">
          <span>© 2026 R-Pro Group. All rights reserved.</span>
          <span>customercare@rprogroup.com.ng</span>
        </div>
      </div>
    </div>
  );
}
