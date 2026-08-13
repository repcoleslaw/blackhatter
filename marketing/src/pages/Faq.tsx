import { appHref } from "../lib/appUrl";
import { usePageTitle } from "../lib/usePageTitle";
import { PageIntro, PageWidth } from "../components/Page";

const faqs = [
  {
    q: "What is Blackhatter?",
    a: "A workspace for designing a meeting against preset objectives, checking whether the agenda covers them, and exporting a PDF pre-read plus a calendar .ics.",
  },
  {
    q: "Who is it for?",
    a: "Anyone who owns the quality of a meeting before it starts: facilitators, leads, and people who are tired of sending a calendar hold with no plan attached.",
  },
  {
    q: "How do objectives work?",
    a: "You pick from a preset list (Decide, Align, Inform, Ideate, Status, Review, Problem-solve, Plan). Analytics show which of those the agenda blocks actually serve.",
  },
  {
    q: "What can I export?",
    a: "A PDF pre-read of the meeting and an .ics with the title, description, and total duration.",
  },
  {
    q: "Is it free?",
    a: "Yes during early access. Pricing will be posted here if that changes.",
  },
  {
    q: "Where is my data?",
    a: "Accounts and meetings live in your Blackhatter profile, stored with Firebase Authentication and Cloud Firestore. You sign in with email/password or Google.",
  },
  {
    q: "How do I start?",
    a: "Create an account, add a meeting, pick objectives, and build the agenda. The first useful output is a pre-read you can send before the hold.",
  },
];

export function FaqPage() {
  usePageTitle("FAQ");

  return (
    <PageWidth>
      <PageIntro kicker="FAQ" title="Short answers." />
      <div className="mt-12 max-w-2xl divide-y divide-line border-y border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer font-medium list-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {item.q}
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
