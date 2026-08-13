import { appHref } from "../lib/appUrl";
import { usePageTitle } from "../lib/usePageTitle";
import { PageIntro, PageWidth } from "../components/Page";

const included = [
  "Email/password and Google sign-in",
  "Unlimited meetings on your profile in early access",
  "Preset objectives and a sortable agenda builder",
  "Objective coverage and duration analytics",
  "PDF pre-read and calendar .ics export",
];

export function PricingPage() {
  usePageTitle("Pricing");

  return (
    <PageWidth>
      <PageIntro kicker="Pricing" title="Free while we are in early access.">
        <p>
          Blackhatter is in v1. Use the product, export the pre-read, put the
          hold on the calendar. Paid plans will show up here when they exist.
        </p>
      </PageIntro>

      <div className="mt-14 max-w-lg rounded-2xl border border-line bg-card p-8">
        <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
          Early access
        </p>
        <p className="mt-4 font-serif text-5xl">Free</p>
        <p className="mt-2 text-sm text-muted">No card. Create an account and start.</p>
        <ul className="mt-8 space-y-3 text-sm">
          {included.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a
          href={appHref("/signup")}
          className="mt-8 inline-flex w-full justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
        >
          Get started free
        </a>
      </div>
    </PageWidth>
  );
}
