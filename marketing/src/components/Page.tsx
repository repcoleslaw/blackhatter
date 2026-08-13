import type { ReactNode } from "react";

export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      {kicker ? (
        <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
      {children ? <div className="mt-4 text-lg text-muted">{children}</div> : null}
    </header>
  );
}

export function PageWidth({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">{children}</div>
  );
}
