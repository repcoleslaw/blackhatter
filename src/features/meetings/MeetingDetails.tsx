import { fromDatetimeLocal, toDatetimeLocal } from "../../lib/dates";
import { formatDuration } from "../../lib/duration";
import type { Meeting, MeetingUpdates } from "../../types/meeting";

function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

export function MeetingDetails({
  meeting,
  actualMinutes,
  participantCount,
  exporting,
  onChange,
  onPatch,
  onAddParticipants,
  onPdf,
  onIcs,
}: {
  meeting: Meeting;
  actualMinutes: number;
  participantCount: number;
  exporting: boolean;
  onChange: (meeting: Meeting) => void;
  onPatch: (updates: MeetingUpdates) => void;
  onAddParticipants: () => void;
  onPdf: () => void;
  onIcs: () => void;
}) {
  return (
    <header className="mt-4 grid gap-4 rounded-xl border border-line bg-card p-5 lg:grid-cols-[1fr_auto]">
      <div className="min-w-0 space-y-3">
        <input
          value={meeting.title}
          onChange={(event) =>
            onChange({ ...meeting, title: event.target.value })
          }
          onBlur={() => void onPatch({ title: meeting.title.trim() })}
          className="w-full bg-transparent font-serif text-3xl outline-none"
        />
        <textarea
          value={meeting.description}
          onChange={(event) =>
            onChange({ ...meeting, description: event.target.value })
          }
          onBlur={() => void onPatch({ description: meeting.description })}
          rows={2}
          className="w-full resize-y bg-transparent text-muted outline-none"
          placeholder="Meeting description"
        />
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">
            <span className="mb-1 block text-xs text-muted">Date</span>
            <input
              type="datetime-local"
              value={
                meeting.scheduledAt ? toDatetimeLocal(meeting.scheduledAt) : ""
              }
              onChange={(event) => {
                const next = fromDatetimeLocal(event.target.value);
                onChange({ ...meeting, scheduledAt: next });
                void onPatch({ scheduledAt: next });
              }}
              className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-muted">
              Target duration (min)
            </span>
            <input
              type="number"
              min={0}
              value={meeting.targetDurationMinutes ?? ""}
              onChange={(event) => {
                const raw = event.target.value;
                const next = raw === "" ? null : Math.max(0, Number(raw) || 0);
                onChange({ ...meeting, targetDurationMinutes: next });
                void onPatch({ targetDurationMinutes: next });
              }}
              placeholder="Optional"
              className="w-36 rounded-md border border-line bg-paper px-3 py-1.5 text-sm"
            />
          </label>
          <p className="self-end text-sm text-muted">
            Actual duration{" "}
            <span className="font-medium text-ink">
              {formatDuration(actualMinutes)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAddParticipants}
            className="rounded-md border border-line px-4 py-2 text-sm hover:bg-paper"
          >
            Add participants
          </button>
          {participantCount > 0 ? (
            <button
              type="button"
              onClick={onAddParticipants}
              className="inline-flex items-center gap-2 text-sm text-ink hover:text-ember"
              aria-label={`${participantCount} participants`}
            >
              <PersonIcon />
              <span className="font-medium">{participantCount}</span>
              <span className="text-muted">participants</span>
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2 lg:flex-col lg:items-stretch">
        <button
          type="button"
          onClick={onPdf}
          disabled={exporting}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
        >
          {exporting ? "Exporting…" : "Export PDF pre-read"}
        </button>
        <button
          type="button"
          onClick={onIcs}
          className="rounded-md border border-line px-4 py-2 text-sm"
        >
          Export .ics
        </button>
      </div>
    </header>
  );
}
