import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { cx } from "../lib/cx";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "rounded-md px-3 py-1.5 text-sm transition-colors",
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
  );

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-svh bg-paper">
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-end justify-center rounded-md bg-ember/20 pb-1.5">
              <span className="mb-0.5 h-2.5 w-4 rounded-t-full border-2 border-ember" />
            </span>
            <span className="font-serif text-lg tracking-tight">Blackhatter</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Meetings
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/70 sm:inline">
              {profile?.displayName || profile?.email}
            </span>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
