import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { DESTINATION_LIST } from "../data/destinations";

interface TopNavProps {
  variant?: "marketing" | "app";
  title?: string;
}

export default function TopNav({ variant = "marketing", title }: TopNavProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [destOpen, setDestOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-base font-extrabold tracking-tight">
            R-Pro <span className="text-brand">Apply</span>
          </span>
        </Link>

        {variant === "marketing" && (
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink2">
            <div className="relative" onMouseEnter={() => setDestOpen(true)} onMouseLeave={() => setDestOpen(false)}>
              <span className="cursor-pointer flex items-center gap-1">
                Study Destinations <span className="text-[9px]">▼</span>
              </span>
              {destOpen && (
                <div className="absolute top-full left-0 bg-white border border-line rounded-xl p-2 min-w-[200px] shadow-lg">
                  {DESTINATION_LIST.map((d) => (
                    <Link
                      key={d.code}
                      to={`/destinations/${d.code}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-soft transition-colors"
                    >
                      <span className="text-base">{d.flag}</span> {d.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setPartnerOpen(true)} onMouseLeave={() => setPartnerOpen(false)}>
              <span className="cursor-pointer flex items-center gap-1">
                For Partners <span className="text-[9px]">▼</span>
              </span>
              {partnerOpen && (
                <div className="absolute top-full left-0 bg-white border border-line rounded-xl p-2 min-w-[240px] shadow-lg">
                  <Link to="/institutions" className="block px-3 py-2 rounded-lg hover:bg-soft transition-colors">
                    <p className="text-sm font-bold">🏫 Institutions</p>
                    <p className="text-xs text-muted">Receive applications from students</p>
                  </Link>
                  <Link to="/vendors" className="block px-3 py-2 rounded-lg hover:bg-soft transition-colors">
                    <p className="text-sm font-bold">🛠️ Vendors</p>
                    <p className="text-xs text-muted">Provide services to students</p>
                  </Link>
                  <Link to="/recruitment-partners" className="block px-3 py-2 rounded-lg hover:bg-soft transition-colors">
                    <p className="text-sm font-bold">🤝 Recruitment Partners</p>
                    <p className="text-xs text-muted">Earn with your referral link</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "marketing" ? (
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <Link to="/login" className="btn-secondary !px-3 !py-2 !text-xs sm:!px-5 sm:!py-2.5 sm:!text-sm">
              Log In
            </Link>
            <Link to="/register" className="btn-primary !px-3 !py-2 !text-xs sm:!px-5 sm:!py-2.5 sm:!text-sm whitespace-nowrap">
              <span className="sm:hidden">Register</span>
              <span className="hidden sm:inline">Register as a Student</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5 text-sm">
            {title && <span className="text-muted font-medium hidden sm:inline">{title}</span>}
            <span className="text-muted hidden md:inline">{user?.email}</span>
            <button onClick={logout} className="text-ink2 font-semibold hover:text-brand transition-colors">
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
