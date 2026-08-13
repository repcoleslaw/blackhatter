import { useState, type FormEvent } from "react";
import { toDatetimeLocal } from "../../lib/dates";

export function IcsDateModal({
  initialDate,
  onCancel,
  onConfirm,
}: {
  initialDate: Date;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
}) {
  const [value, setValue] = useState(toDatetimeLocal(initialDate));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next = new Date(value);
    if (Number.isNaN(next.getTime())) return;
    onConfirm(next);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-line bg-card p-6 shadow-xl"
      >
        <h2 className="font-serif text-2xl">Calendar start time</h2>
        <p className="mt-2 text-sm text-muted">
          This meeting does not have a date yet. Choose a start time for the
          .ics file. Duration comes from the agenda.
        </p>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium">Start</span>
          <input
            type="datetime-local"
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-ember/30 focus:ring-2"
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-line px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            Export .ics
          </button>
        </div>
      </form>
    </div>
  );
}
