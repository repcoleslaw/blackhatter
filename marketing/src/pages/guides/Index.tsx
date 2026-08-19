import { Link } from "react-router-dom";
import { PageIntro, PageWidth } from "../../components/Page";

const guides = [
  {
    to: "/guides/meeting-agenda-from-objectives",
    title: "How to build a meeting agenda from objectives",
    body: "Start with Decide, Align, Inform, and the rest. Then write blocks that actually cover those aims.",
  },
  {
    to: "/guides/meeting-pre-read",
    title: "Meeting pre-read: what to send before the hold",
    body: "People should know the plan, the timing, and the purpose before they sit down.",
  },
  {
    to: "/guides/meeting-length",
    title: "How long should this meeting be?",
    body: "Compare agenda duration to the calendar hold so the room is neither rushed nor idle.",
  },
];

export function GuideIndexPage() {
  return (
    <PageWidth>
      <PageIntro kicker="Guides" title="Meeting design, on the page.">
        <p>
          Short reads for facilitators and meeting owners. Each one maps to
          something you can do in Blackhatter before you send the invite.
        </p>
      </PageIntro>
      <ul className="mt-12 max-w-2xl space-y-4">
        {guides.map((guide) => (
          <li key={guide.to}>
            <Link
              to={guide.to}
              className="block rounded-xl border border-line bg-card p-6 hover:border-ink/20"
            >
              <h2 className="font-serif text-xl text-ink">{guide.title}</h2>
              <p className="mt-2 text-sm text-muted">{guide.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageWidth>
  );
}
