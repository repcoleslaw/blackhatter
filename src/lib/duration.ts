export function sumDurationMinutes(
  blocks: Array<{ durationMinutes: number }>,
): number {
  return blocks.reduce(
    (sum, block) => sum + (Number(block.durationMinutes) || 0),
    0,
  );
}

export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr${hours === 1 ? "" : "s"}`;
  return `${hours} hr${hours === 1 ? "" : "s"} ${remainder} min`;
}

export function formatClockOffset(minutesFromStart: number): string {
  const total = Math.max(0, Math.round(minutesFromStart));
  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "meeting";
}
