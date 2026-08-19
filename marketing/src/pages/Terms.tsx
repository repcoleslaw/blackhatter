import { PageIntro, PageWidth } from "../components/Page";

export function TermsPage() {
  return (
    <PageWidth>
      <PageIntro kicker="Terms" title="Placeholder terms of use.">
        <p>Last updated August 2026. This is not legal advice.</p>
      </PageIntro>
      <div className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Blackhatter is provided as early-access software, as-is, for evaluating
          meeting quality. You are responsible for the meetings you design and
          the files you export.
        </p>
        <p>
          Do not use the service to store secrets you cannot afford to lose.
          Availability, features, and pricing may change. A complete terms of
          service will replace this page before any paid public launch.
        </p>
        <p>
          By creating an account you agree to use the product lawfully and to
          keep your login credentials to yourself.
        </p>
      </div>
    </PageWidth>
  );
}
