import { appHref } from "../lib/appUrl";
import { faqs } from "../lib/faqs";
import { PageIntro, PageWidth } from "../components/Page";

export function FaqPage() {
  return (
    <PageWidth>
      <PageIntro kicker="FAQ" title="Short answers." />
      <div className="mt-12 max-w-2xl divide-y divide-line border-y border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer font-medium list-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <h2 className="font-sans text-base font-medium">{item.q}</h2>
                <span className="text-muted group-open:hidden">+</span>
                <span className="hidden text-muted group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Ready to try it?{" "}
        <a href={appHref("/signup")} className="font-medium text-ink underline-offset-2 hover:underline">
          Create an account
        </a>
        .
      </p>
    </PageWidth>
  );
}
