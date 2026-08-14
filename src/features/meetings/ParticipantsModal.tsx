import { useState, type FormEvent } from "react";
import {
  createDraftParticipant,
  MAX_PARTICIPANTS,
} from "../meetings/meetingService";
import type { Participant } from "../../types/meeting";

export function ParticipantsModal({
  initialParticipants,
  onCancel,
  onSave,
}: {
  initialParticipants: Participant[];
  onCancel: () => void;
  onSave: (participants: Participant[]) => void;
}) {
  const [participants, setParticipants] = useState<Participant[]>(() =>
    initialParticipants.length > 0
      ? initialParticipants.map((participant) => ({ ...participant }))
      : [createDraftParticipant(0)],
  );

  function updateParticipant(id: string, patch: Partial<Participant>) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id ? { ...participant, ...patch } : participant,
      ),
    );
  }

  function removeParticipant(id: string) {
    setParticipants((current) =>
      current.filter((participant) => participant.id !== id),
    );
  }

  function addParticipant() {
    setParticipants((current) => {
      if (current.length >= MAX_PARTICIPANTS) return current;
      return [...current, createDraftParticipant(current.length)];
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSave(participants);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-line bg-card p-6 shadow-xl"
      >
        <h2 className="font-serif text-2xl">Add participants</h2>
        <p className="mt-2 text-sm text-muted">
          Role, company, and hourly rate are used to estimate the cost of this
          meeting.
        </p>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {participants.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
              No participants yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {participants.map((participant, index) => (
                <li
                  key={participant.id}
                  className="grid gap-3 rounded-lg border border-line bg-paper p-3 sm:grid-cols-[1fr_1fr_8rem_auto]"
                >
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted">Role</span>
                    <input
                      value={participant.role}
                      onChange={(event) =>
                        updateParticipant(participant.id, {
                          role: event.target.value,
                        })
                      }
                      placeholder="Role"
                      maxLength={100}
                      className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted">Company</span>
                    <input
                      value={participant.company}
                      onChange={(event) =>
                        updateParticipant(participant.id, {
                          company: event.target.value,
                        })
                      }
                      maxLength={100}
                      className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none ring-ember/30 focus:ring-2"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted">Rate</span>
                    <span className="flex items-center rounded-md border border-line bg-card ring-ember/30 focus-within:ring-2">
                      <span className="pl-3 text-sm text-muted">$</span>
                      <input
                        type="number"
                        min={0}
                        max={100000}
                        step={1}
                        value={participant.rate}
                        onChange={(event) =>
                          updateParticipant(participant.id, {
                            rate: Math.max(0, Number(event.target.value) || 0),
                          })
                        }
                        className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                        aria-label={`Hourly rate for participant ${index + 1}`}
                      />
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="self-end pb-2 text-sm text-muted hover:text-ember sm:justify-self-start"
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
          onClick={addParticipant}
          disabled={participants.length >= MAX_PARTICIPANTS}
          className="mt-4 self-start text-sm text-ember hover:text-ink disabled:opacity-50"
        >
          + Add another
        </button>

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
            Save participants
          </button>
        </div>
      </form>
    </div>
  );
}
