import { formatDuration } from "../../lib/duration";
import { formatUsd, type MeetingCost } from "./calculateMeetingCost";

export function MeetingCostCard({ cost }: { cost: MeetingCost }) {
  let note = "Add participants to estimate attendee time cost.";
  if (cost.participantCount > 0 && cost.durationMinutes === 0) {
    note = `Add agenda blocks to estimate cost for ${cost.participantCount} participant${cost.participantCount === 1 ? "" : "s"}.`;
  } else if (cost.participantCount > 0) {
    note = `${cost.participantCount} participant${cost.participantCount === 1 ? "" : "s"} × ${formatDuration(cost.durationMinutes)} at each hourly rate.`;
  }

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-xs tracking-wide uppercase">Cost of meeting</p>
      <p className="mt-1 font-serif text-xl">{formatUsd(cost.total)}</p>
      <p className="mt-1 text-sm text-muted">{note}</p>
      {cost.byCompany.length > 0 ? (
        <div className="mt-3 border-t border-line pt-3">
          <p className="text-xs tracking-wide text-muted uppercase">
            By company
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {cost.byCompany.map((row) => (
              <li
                key={row.company}
                className="flex items-baseline justify-between gap-3"
              >
                <span>
                  {row.company}
                  <span className="ml-1.5 text-xs text-muted">
                    {row.participantCount}{" "}
                    {row.participantCount === 1 ? "person" : "people"}
                  </span>
                </span>
                <span className="font-medium tabular-nums">
                  {formatUsd(row.cost)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
