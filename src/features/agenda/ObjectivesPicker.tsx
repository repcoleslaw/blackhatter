import { OBJECTIVES } from "../../lib/objectives";
import { cx } from "../../lib/cx";

export function ObjectivesPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const remaining = OBJECTIVES.filter(
    (objective) => !selectedIds.includes(objective.id),
  );

  function addObjective(id: string) {
    if (!id || selectedIds.includes(id)) return;
    onChange([...selectedIds, id]);
  }

  function removeObjective(id: string) {
    onChange(selectedIds.filter((item) => item !== id));
  }

  return (
    <section className="rounded-xl border border-line bg-card p-4">
      <h2 className="font-serif text-lg">Objectives</h2>
      <p className="mt-1 text-sm text-muted">
        Select what this meeting must accomplish. Agenda blocks are validated
        against this list.
      </p>
      <label className="mt-4 block">
        <span className="sr-only">Add objective</span>
        <select
          value=""
          onChange={(event) => {
            addObjective(event.target.value);
            event.currentTarget.value = "";
          }}
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
        >
          <option value="">Add an objective…</option>
          {remaining.map((objective) => (
            <option key={objective.id} value={objective.id}>
              {objective.label} — {objective.description}
            </option>
          ))}
        </select>
      </label>
      {selectedIds.length === 0 ? (
        <p className="mt-4 text-sm text-ember">
          No objectives yet. The agenda cannot be validated until you add at
          least one.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {selectedIds.map((id) => {
            const objective = OBJECTIVES.find((item) => item.id === id);
            return (
              <li
                key={id}
                className={cx(
                  "flex items-start justify-between gap-2 rounded-md border border-line bg-paper px-3 py-2",
                )}
              >
                <div>
                  <p className="text-sm font-medium">{objective?.label ?? id}</p>
                  <p className="text-xs text-muted">{objective?.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeObjective(id)}
                  className="text-xs text-muted hover:text-ember"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
