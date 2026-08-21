import { useState, type FormEvent } from "react";
import { OBJECTIVE_CATEGORIES } from "../../lib/objectives";
import type { MeetingObjective } from "../../types/meeting";

export function ObjectiveModal({
  initial,
  onCancel,
  onSave,
}: {
  initial: MeetingObjective | null;
  onCancel: () => void;
  onSave: (draft: { title: string; categoryId: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? OBJECTIVE_CATEGORIES[0]?.id ?? "",
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || !categoryId) return;
    onSave({ title: nextTitle, categoryId });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-line bg-card p-6 shadow-xl"
      >
        <h2 className="font-serif text-2xl">
          {initial ? "Edit objective" : "New objective"}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Name what this meeting must accomplish, then categorize it.
        </p>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={200}
            autoFocus
            placeholder="e.g. Approve Q3 hiring plan"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-ember/30 focus:ring-2"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium">Category</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-ember/30 focus:ring-2"
          >
            {OBJECTIVE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} — {category.description}
              </option>
            ))}
          </select>
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
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
