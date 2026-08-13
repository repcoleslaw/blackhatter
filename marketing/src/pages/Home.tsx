import { appHref } from "../lib/appUrl";
import { usePageTitle } from "../lib/usePageTitle";

const features = [
  {
    title: "Objectives first",
    body: "Start with Decide, Align, Inform, and the rest of the preset list. The agenda has to serve those aims, not the other way around.",
  },
  {
    title: "Coverage, not vibes",
    body: "See which objectives the blocks actually cover, and how the agenda duration compares to the hold you booked.",
  },
  {
    title: "A pre-read in one export",
    body: "Send a PDF so people show up knowing the plan, the timing, and what the meeting is for.",
  },
  {
    title: "On the calendar",
    body: "Download an .ics with the title, description, and total duration. The hold matches the work you designed.",
  },
];

const steps = [
  {
    n: "01",
    title: "Name the meeting",
    body: "Title, description, and the objectives you refuse to miss.",
  },
  {
    n: "02",
    title: "Build the agenda",
    body: "Sortable duration blocks, optional date, optional target length.",
  },
  {
    n: "03",
    title: "Check, then ship",
    body: "Coverage and duration analytics, then PDF and calendar export.",
  },
];

export function HomePage() {
  usePageTitle();

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
              Meeting quality, by design
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">
              Pressure-test the meeting before anyone sits down.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Build an agenda against real objectives, see what is missing, then
              export a pre-read and a calendar hold.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={appHref("/signup")}
                className="rounded-md bg-ember px-5 py-2.5 text-sm font-medium text-paper hover:bg-ember/90"
              >
                Get started free
              </a>
              <a
                href={appHref("/login")}
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-paper hover:bg-white/10"
              >
                Sign in
              </a>
            </div>
          </div>
          <aside className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs tracking-wide text-white/50 uppercase">
              Agenda check
            </p>
            <p className="mt-3 font-serif text-2xl">Q3 planning</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/80">Decide · Align · Plan</span>
                <span className="text-moss">Covered</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/80">Agenda vs 45 min hold</span>
                <span className="text-paper">On target</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-white/80">Pre-read + .ics</span>
                <span className="text-ember">Ready</span>
              </li>
            </ul>
            <div className="pointer-events-none absolute -right-10 -bottom-12 h-40 w-40 rounded-full border border-ember/40" />
          </aside>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
          Product
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl sm:text-4xl">
          The meeting should earn the calendar hold.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Blackhatter is a workspace for designing the agenda, checking it
          against what you said the meeting was for, and sending people something
          they can actually use.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-line bg-card p-6"
            >
              <h3 className="font-serif text-xl">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n}>
                <p className="text-xs tracking-[0.2em] text-ember uppercase">
                  {step.n}
                </p>
                <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl bg-ink px-8 py-12 text-paper sm:px-12">
          <h2 className="max-w-lg font-serif text-3xl sm:text-4xl">
            Design the meeting. Then invite people to it.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Early access is free. Create an account and pressure-test the next
            one on the calendar.
          </p>
          <a
            href={appHref("/signup")}
            className="mt-8 inline-flex rounded-md bg-ember px-5 py-2.5 text-sm font-medium text-paper hover:bg-ember/90"
          >
            Get started free
          </a>
        </div>
      </section>
    </>
  );
}
