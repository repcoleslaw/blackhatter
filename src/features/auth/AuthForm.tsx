import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink px-12 py-16 text-paper lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
            Blackhatter
          </p>
          <h1 className="mt-10 max-w-md font-serif text-5xl leading-tight">
            Pressure-test the meeting before anyone sits down.
          </h1>
          <p className="mt-6 max-w-sm text-white/70">
            Build an agenda against real objectives, see what is missing, then
            export a pre-read and a calendar hold.
          </p>
        </div>
        <p className="text-sm text-white/40">Meeting quality, by design.</p>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-72 rounded-full border border-ember/40" />
      </aside>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
              Blackhatter
            </p>
          </div>
          <h2 className="font-serif text-3xl">{title}</h2>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function GoogleButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-line bg-card px-4 py-2.5 text-sm font-medium hover:bg-paper disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
        />
        <path
          fill="#34A853"
          d="M5.3 14.3l-.8.6-2.8 2.2C3.5 20.5 7.5 23 12 23c3 0 5.5-1 7.3-2.9l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4z"
        />
        <path
          fill="#4A90E2"
          d="M3.2 7.1A10.9 10.9 0 0 0 1.8 12c0 1.8.4 3.4 1.2 4.9l3.6-2.8c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1L3.2 7.1z"
        />
        <path
          fill="#FBBC05"
          d="M12 4.8c1.6 0 3 .6 4.1 1.6l3-3C17.5 1.5 15 0 12 0 7.5 0 3.5 2.5 1.8 6.3l3.6 2.8C6.2 6.4 8.4 4.8 12 4.8z"
        />
      </svg>
      Continue with Google
    </button>
  );
}

export function AuthForm({
  submitLabel,
  extraFields,
  footer,
  onSubmit,
  error,
  pending,
}: {
  submitLabel: string;
  extraFields?: ReactNode;
  footer: ReactNode;
  onSubmit: (form: FormData) => void;
  error: string | null;
  pending: boolean;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {extraFields}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-line bg-card px-3 py-2 outline-none ring-ember/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={submitLabel === "Create account" ? "new-password" : "current-password"}
          className="w-full rounded-md border border-line bg-card px-3 py-2 outline-none ring-ember/30 focus:ring-2"
        />
      </label>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Working…" : submitLabel}
      </button>
      {footer}
    </form>
  );
}

export function AuthFooter({
  prompt,
  to,
  label,
}: {
  prompt: string;
  to: string;
  label: string;
}) {
  return (
    <p className="pt-2 text-center text-sm text-muted">
      {prompt}{" "}
      <Link to={to} className="font-medium text-ink underline-offset-2 hover:underline">
        {label}
      </Link>
    </p>
  );
}
