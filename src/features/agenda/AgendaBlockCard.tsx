import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getCategory,
  getMeetingObjective,
  isObjectiveNa,
  isValidBlockObjective,
  OBJECTIVE_NA_ID,
} from "../../lib/objectives";
import { formatDuration } from "../../lib/duration";
import { cx } from "../../lib/cx";
import type { AgendaBlock, DocLink, MeetingObjective } from "../../types/meeting";

export function AgendaBlockCard({
  block,
  objectives,
  onChange,
  onDelete,
}: {
  block: AgendaBlock;
  objectives: MeetingObjective[];
  onChange: (updates: Partial<AgendaBlock>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(block.title);
  const [description, setDescription] = useState(block.description);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  useEffect(() => {
    setTitle(block.title);
    setDescription(block.description);
  }, [block.id, block.title, block.description]);

  const assigned = getMeetingObjective(objectives, block.objectiveId);
  const invalid = !isValidBlockObjective(block.objectiveId, objectives);

  function updateLink(index: number, patch: Partial<DocLink>) {
    const docLinks = block.docLinks.map((link, i) =>
      i === index ? { ...link, ...patch } : link,
    );
    onChange({ docLinks });
  }

  function removeLink(index: number) {
    onChange({ docLinks: block.docLinks.filter((_, i) => i !== index) });
  }

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cx(
        "rounded-xl border bg-card p-4 shadow-[0_1px_0_rgba(20,19,17,0.04)]",
        invalid ? "border-ember/50" : "border-line",
        isDragging && "z-10 opacity-80",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-1 cursor-grab touch-none rounded px-1 text-muted hover:text-ink"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => {
                if (title !== block.title) onChange({ title });
              }}
              className="min-w-0 flex-1 bg-transparent font-serif text-lg outline-none"
              placeholder="Agenda block title"
            />
            <span className="text-xs tracking-wide text-muted uppercase">
              {formatDuration(block.durationMinutes)}
            </span>
          </div>
          {invalid ? (
            <p className="text-xs text-ember">
              This block needs a meeting objective, or N/A.
            </p>
          ) : null}
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => {
              if (description !== block.description) onChange({ description });
            }}
            rows={2}
            placeholder="What happens in this block?"
            className="w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                Duration (minutes)
              </span>
              <input
                type="number"
                min={0}
                step={5}
                value={block.durationMinutes}
                onChange={(event) =>
                  onChange({
                    durationMinutes: Math.max(0, Number(event.target.value) || 0),
                  })
                }
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">
                Objective
              </span>
              <select
                value={block.objectiveId}
                onChange={(event) => onChange({ objectiveId: event.target.value })}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
              >
                <option value="">Select objective…</option>
                <option value={OBJECTIVE_NA_ID}>
                  N/A — intro, break, or courtesy
                </option>
                {objectives.map((objective) => {
                  const category = getCategory(objective.categoryId);
                  return (
                    <option key={objective.id} value={objective.id}>
                      {objective.title}
                      {category ? ` — ${category.label}` : ""}
                    </option>
                  );
                })}
                {block.objectiveId &&
                !assigned &&
                !isObjectiveNa(block.objectiveId) ? (
                  <option value={block.objectiveId}>
                    {block.objectiveId} (removed)
                  </option>
                ) : null}
              </select>
            </label>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">
                Documentation links
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    docLinks: [...block.docLinks, { label: "", url: "" }],
                  })
                }
                className="text-xs font-medium text-ink hover:text-ember"
              >
                Add link
              </button>
            </div>
            {block.docLinks.length === 0 ? (
              <p className="text-xs text-muted">No links yet.</p>
            ) : (
              <ul className="space-y-2">
                {block.docLinks.map((link, index) => (
                  <li key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <input
                      value={link.label}
                      onChange={(event) =>
                        updateLink(index, { label: event.target.value })
                      }
                      placeholder="Label"
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none ring-ember/30 focus:ring-2"
                    />
                    <input
                      value={link.url}
                      onChange={(event) =>
                        updateLink(index, { url: event.target.value })
                      }
                      placeholder="https://"
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none ring-ember/30 focus:ring-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-xs text-muted hover:text-ember"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-muted hover:text-ember"
          >
            Delete block
          </button>
        </div>
      </div>
    </article>
  );
}
