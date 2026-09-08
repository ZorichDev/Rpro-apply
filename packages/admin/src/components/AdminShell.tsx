import { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";

interface AdminShellProps {
  title: string;
  children: ReactNode;
}

export default function AdminShell({ title, children }: AdminShellProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-soft">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-base font-extrabold tracking-tight">
              R-Pro <span className="text-brand">Apply</span> <span className="text-muted font-normal">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="text-muted hidden md:inline">{user?.email}</span>
            <button onClick={logout} className="text-ink2 font-semibold hover:text-brand transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
        <h1 className="font-display text-3xl font-black tracking-tight mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}
