import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { formatClockOffset, formatDuration, sumDurationMinutes } from "../../lib/duration";
import type { AgendaBlock } from "../../types/meeting";
import { AgendaBlockCard } from "./AgendaBlockCard";

export function AgendaTimeline({
  blocks,
  objectiveIds,
  onReorder,
  onChange,
  onDelete,
  onAdd,
}: {
  blocks: AgendaBlock[];
  objectiveIds: string[];
  onReorder: (orderedIds: string[]) => void;
  onChange: (blockId: string, updates: Partial<AgendaBlock>) => void;
  onDelete: (blockId: string) => void;
  onAdd: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const total = sumDurationMinutes(blocks);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(blocks, oldIndex, newIndex);
    onReorder(next.map((block) => block.id));
  }

  let offset = 0;

  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg">Agenda canvas</h2>
          <p className="text-sm text-muted">
            Place blocks in order. Meeting duration is the sum of their times.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">
            Actual{" "}
            <span className="font-medium text-ink">{formatDuration(total)}</span>
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Add block
          </button>
        </div>
      </div>
      {blocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card px-6 py-14 text-center">
          <p className="font-serif text-xl">Empty timeline</p>
          <p className="mt-2 text-sm text-muted">
            Add a block for each chunk of the meeting.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="relative space-y-3 border-l border-line pl-4">
              {blocks.map((block) => {
                const start = offset;
                offset += block.durationMinutes;
                return (
                  <li key={block.id} className="relative">
                    <span className="absolute top-5 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-ember bg-paper" />
                    <p className="mb-1 text-xs tracking-wide text-muted uppercase">
                      {formatClockOffset(start)} · {formatDuration(block.durationMinutes)}
                    </p>
                    <AgendaBlockCard
                      block={block}
                      objectiveIds={objectiveIds}
                      onChange={(updates) => onChange(block.id, updates)}
                      onDelete={() => onDelete(block.id)}
                    />
                  </li>
                );
              })}
            </ol>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
