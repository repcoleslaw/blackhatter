import { MeetingCostCard } from "./MeetingCostCard";
import { formatDuration } from "../../lib/duration";
import { cx } from "../../lib/cx";
import {
  uncoveredLabels,
  type MeetingAnalysis,
} from "./analyzeMeeting";
import type { MeetingCost } from "./calculateMeetingCost";

function StubCard({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-paper/60 p-3 opacity-70">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        <span className="rounded-full bg-line px-2 py-0.5 text-[10px] tracking-wide uppercase">
          Soon
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  );
}

export function MeetingAnalytics({
  analysis,
  cost,
}: {
  analysis: MeetingAnalysis;
  cost: MeetingCost;
}) {
  const uncovered = uncoveredLabels(analysis.uncoveredObjectiveIds);
  const durationCopy =
    analysis.durationStatus === "none"
      ? "Set a target duration to compare against the agenda."
      : analysis.durationStatus === "on"
        ? "Agenda duration matches the target."
        : analysis.durationStatus === "under"
          ? `Under target by ${formatDuration((analysis.targetMinutes ?? 0) - analysis.actualMinutes)}.`
          : `Over target by ${formatDuration(analysis.actualMinutes - (analysis.targetMinutes ?? 0))}.`;

  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-line bg-card p-4">
        <h2 className="font-serif text-lg">Analytics</h2>
        <p className="mt-1 text-sm text-muted">
          Does this agenda actually serve the meeting you intended?
        </p>

        <div
          className={cx(
            "mt-4 rounded-lg border px-3 py-3",
            analysis.objectivesMet
              ? "border-moss/30 bg-moss/10"
              : "border-ember/30 bg-ember/10",
          )}
        >
          <p className="text-xs tracking-wide uppercase">Objectives met</p>
          <p className="mt-1 font-serif text-xl">
            {analysis.selectedCount === 0
              ? "Not yet"
              : analysis.objectivesMet
                ? "Yes"
                : "No"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {analysis.selectedCount === 0
              ? "Select objectives to start validation."
              : analysis.objectivesMet
                ? "Every selected objective has at least one agenda block."
                : `${uncovered.length} objective${uncovered.length === 1 ? "" : "s"} uncovered.`}
          </p>
        </div>

        {uncovered.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {uncovered.map((label) => (
              <li key={label}>{label} has no block</li>
            ))}
          </ul>
        ) : null}

        {analysis.invalidBlocks.length > 0 ? (
          <div className="mt-3">
            <p className="text-xs tracking-wide text-muted uppercase">
              Invalid blocks
            </p>
            <ul className="mt-1 space-y-1 text-sm">
              {analysis.invalidBlocks.map((block) => (
                <li key={block.id}>{block.title || "Untitled block"}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 rounded-lg border border-line px-3 py-3">
          <p className="text-xs tracking-wide uppercase">Duration</p>
          <p className="mt-1 font-serif text-xl">
            {formatDuration(analysis.actualMinutes)}
            {analysis.targetMinutes
              ? ` / ${formatDuration(analysis.targetMinutes)}`
              : ""}
          </p>
          <p className="mt-1 text-sm text-muted">{durationCopy}</p>
        </div>
      </section>

      <section className="space-y-2">
        <MeetingCostCard cost={cost} />
        <StubCard
          title="Agenda risks"
          note="Flag overloaded blocks, missing owners, and weak objectives."
        />
        <StubCard
          title="Simulate meeting"
          note="Walk the agenda as if the meeting were happening now."
        />
      </section>
    </aside>
  );
}
