import { createEvent } from "ics";
import { toIcsDateArray } from "../../lib/dates";
import { downloadText } from "../../lib/download";
import { slugify, sumDurationMinutes } from "../../lib/duration";
import type { AgendaBlock, Meeting } from "../../types/meeting";

export function downloadMeetingIcs(
  meeting: Meeting,
  blocks: AgendaBlock[],
  start: Date,
): void {
  const total = sumDurationMinutes(blocks);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const { error, value } = createEvent({
    title: meeting.title || "Untitled meeting",
    description: meeting.description || undefined,
    start: toIcsDateArray(start),
    startInputType: "local",
    startOutputType: "local",
    duration: total === 0 ? { minutes: 0 } : { hours, minutes },
    productId: "blackhatter",
    calName: "Blackhatter",
  });

  if (error || !value) {
    throw error ?? new Error("Could not create calendar event.");
  }

  downloadText(value, `${slugify(meeting.title)}.ics`, "text/calendar;charset=utf-8");
}
