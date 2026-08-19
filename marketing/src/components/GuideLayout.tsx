import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { appHref } from "../lib/appUrl";
import { PageIntro, PageWidth } from "./Page";

export function GuideLayout({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <PageWidth>
      <p className="text-sm text-muted">
        <Link to="/guides" className="underline-offset-2 hover:underline">
          Guides
        </Link>
      </p>
      <PageIntro kicker={kicker} title={title}>
        <p>{lede}</p>
      </PageIntro>
      <article className="mt-10 max-w-2xl space-y-5 text-[15px] leading-relaxed text-muted">
        {children}
      </article>
      <p className="mt-12 max-w-2xl text-sm text-muted">
        Ready to pressure-test the next hold?{" "}
        <a
          href={appHref("/signup")}
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          Create a free account
        </a>
        .
      </p>
    </PageWidth>
  );
}

export function GuideH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="pt-4 font-serif text-2xl text-ink">{children}</h2>
  );
}
