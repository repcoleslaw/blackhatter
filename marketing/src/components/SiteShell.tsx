import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { appHref } from "../lib/appUrl";
import { cx } from "../lib/cx";
import { Wordmark } from "./Wordmark";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "rounded-md px-3 py-1.5 text-sm transition-colors",
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
  );

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "block rounded-md px-3 py-2 text-sm",
    isActive ? "bg-white/10 text-white" : "text-white/80",
  );

export function SiteShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Wordmark inverted />
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={navClass}>
              Product
            </NavLink>
            <NavLink to="/pricing" className={navClass}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/guides" className={navClass}>
              Guides
            </NavLink>
            <NavLink to="/faq" className={navClass}>
              FAQ
            </NavLink>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={appHref("/login")}
              className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:text-white"
            >
              Sign in
            </a>
            <a
              href={appHref("/signup")}
              className="rounded-md bg-ember px-3 py-1.5 text-sm font-medium text-paper hover:bg-ember/90"
            >
              Get started
            </a>
          </div>
          <button
            type="button"
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white/80 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open ? (
          <div
            id="mobile-nav"
            className="space-y-1 border-t border-white/10 px-4 py-3 md:hidden"
          >
            <NavLink to="/" end className={mobileNavClass} onClick={() => setOpen(false)}>
              Product
            </NavLink>
            <NavLink to="/pricing" className={mobileNavClass} onClick={() => setOpen(false)}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={mobileNavClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/guides" className={mobileNavClass} onClick={() => setOpen(false)}>
              Guides
            </NavLink>
            <NavLink to="/faq" className={mobileNavClass} onClick={() => setOpen(false)}>
              FAQ
            </NavLink>
            <div className="flex gap-2 pt-2">
              <a
                href={appHref("/login")}
                className="flex-1 rounded-md border border-white/20 px-3 py-2 text-center text-sm"
              >
                Sign in
              </a>
              <a
                href={appHref("/signup")}
                className="flex-1 rounded-md bg-ember px-3 py-2 text-center text-sm font-medium"
              >
                Get started
              </a>
            </div>
          </div>
        ) : null}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Meeting quality, by design.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <NavLink to="/pricing" className="text-muted hover:text-ink">
              Pricing
            </NavLink>
            <NavLink to="/about" className="text-muted hover:text-ink">
              About
            </NavLink>
            <NavLink to="/guides" className="text-muted hover:text-ink">
              Guides
            </NavLink>
            <NavLink to="/faq" className="text-muted hover:text-ink">
              FAQ
            </NavLink>
            <NavLink to="/privacy" className="text-muted hover:text-ink">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="text-muted hover:text-ink">
              Terms
            </NavLink>
            <a href={appHref("/signup")} className="text-muted hover:text-ink">
              Get started
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
