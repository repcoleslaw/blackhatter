import { appHref } from "../lib/appUrl";
import { usePageTitle } from "../lib/usePageTitle";
import { PageIntro, PageWidth } from "../components/Page";

export function AboutPage() {
  usePageTitle("About");

  return (
    <PageWidth>
      <PageIntro kicker="About" title="Meetings fail in the design, not the room.">
        <p>
          Blackhatter is a web app for evaluating meeting quality. You design an
          agenda against preset objectives, check whether the meeting actually
          covers them, then export a PDF pre-read and a calendar .ics.
        </p>
      </PageIntro>

      <div className="mt-12 max-w-2xl space-y-6 text-muted">
        <p>
          Most calendar holds are a title and a hope. The agenda, if it exists,
          is written after the invite. Objectives stay implicit. People sit down
          without a pre-read. Blackhatter reverses that: name the aims, build
          the blocks, see the gaps, then send the artifacts.
        </p>
        <p>
          v1 is focused. Sign in, keep meetings on your profile, build the
          agenda, read coverage and duration, export. Cost, risk, and simulate
          views are stubs for later. The point of the product is already in the
          loop you can run today.
        </p>
        <p>Meeting quality, by design.</p>
      </div>

      <a
        href={appHref("/signup")}
        className="mt-10 inline-flex rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
      >
        Create an account
      </a>
    </PageWidth>
  );
}
