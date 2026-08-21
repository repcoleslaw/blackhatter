import { useState } from "react";
import {
  createMeetingObjective,
  getCategory,
  MAX_OBJECTIVES,
} from "../../lib/objectives";
import { cx } from "../../lib/cx";
import type { MeetingObjective } from "../../types/meeting";
import { ObjectiveModal } from "./ObjectiveModal";

export function ObjectivesPicker({
  objectives,
  onChange,
}: {
  objectives: MeetingObjective[];
  onChange: (objectives: MeetingObjective[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MeetingObjective | null>(null);
  const atLimit = objectives.length >= MAX_OBJECTIVES;

  function openCreate() {
    if (atLimit) return;
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(objective: MeetingObjective) {
    setEditing(objective);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(draft: { title: string; categoryId: string }) {
    if (editing) {
      onChange(
        objectives.map((objective) =>
          objective.id === editing.id
            ? { ...objective, title: draft.title, categoryId: draft.categoryId }
            : objective,
        ),
      );
    } else if (!atLimit) {
      onChange([...objectives, createMeetingObjective(draft.title, draft.categoryId)]);
    }
    closeModal();
  }

  function removeObjective(id: string) {
    onChange(objectives.filter((objective) => objective.id !== id));
  }

  return (
    <section className="rounded-xl border border-line bg-card p-4">
      <h2 className="font-serif text-lg">Objectives</h2>
      <p className="mt-1 text-sm text-muted">
        Define what this meeting must accomplish. Agenda blocks are validated
        against this list.
      </p>
      <button
        type="button"
        onClick={openCreate}
        disabled={atLimit}
        className="mt-4 w-full rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        New Objective
      </button>
      {atLimit ? (
        <p className="mt-2 text-xs text-muted">
          A meeting can have at most {MAX_OBJECTIVES} objectives.
        </p>
      ) : null}
      {objectives.length === 0 ? (
        <p className="mt-4 text-sm text-ember">
          No objectives yet. The agenda cannot be validated until you add at
          least one.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {objectives.map((objective) => {
            const category = getCategory(objective.categoryId);
            return (
              <li
                key={objective.id}
                className={cx(
                  "flex items-start justify-between gap-2 rounded-md border border-line bg-paper px-3 py-2",
                )}
              >
                <div>
                  <p className="text-sm font-medium">{objective.title}</p>
                  <p className="text-xs text-muted">
                    {category?.label ?? objective.categoryId}
                    {category ? ` — ${category.description}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(objective)}
                    className="text-xs text-muted hover:text-ink"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeObjective(objective.id)}
                    className="text-xs text-muted hover:text-ember"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {modalOpen ? (
        <ObjectiveModal
          initial={editing}
          onCancel={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </section>
  );
}
