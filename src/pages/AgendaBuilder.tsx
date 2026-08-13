import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { AgendaTimeline } from "../features/agenda/AgendaTimeline";
import { ObjectivesPicker } from "../features/agenda/ObjectivesPicker";
import { MeetingAnalytics } from "../features/analytics/MeetingAnalytics";
import { analyzeMeeting } from "../features/analytics/analyzeMeeting";
import { useAuth } from "../features/auth/AuthContext";
import { IcsDateModal } from "../features/export/IcsDateModal";
import { downloadMeetingIcs } from "../features/export/exportIcs";
import { fromDatetimeLocal, toDatetimeLocal } from "../lib/dates";
import {
  addBlock,
  deleteBlock,
  reorderBlocks,
  subscribeToBlocks,
  subscribeToMeeting,
  updateBlock,
  updateMeeting,
} from "../features/meetings/meetingService";
import { formatDuration, sumDurationMinutes } from "../lib/duration";
import type { AgendaBlock, Meeting } from "../types/meeting";

export function AgendaBuilderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [blocks, setBlocks] = useState<AgendaBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [icsOpen, setIcsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pendingBlockUpdates = useRef<Record<string, Partial<AgendaBlock>>>({});
  const blockTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    const timers = blockTimers.current;
    const unsubMeeting = subscribeToMeeting(id, (next) => {
      setMeeting(next);
      setLoading(false);
    });
    const unsubBlocks = subscribeToBlocks(id, (next) => {
      const pending = pendingBlockUpdates.current;
      if (Object.keys(pending).length === 0) {
        setBlocks(next);
        return;
      }
      setBlocks(
        next.map((block) =>
          pending[block.id] ? { ...block, ...pending[block.id] } : block,
        ),
      );
    });
    return () => {
      unsubMeeting();
      unsubBlocks();
      for (const timer of Object.values(timers)) {
        window.clearTimeout(timer);
      }
    };
  }, [id]);

  const analysis = useMemo(
    () => (meeting ? analyzeMeeting(meeting, blocks) : null),
    [meeting, blocks],
  );

  if (loading) {
    return (
      <AppShell>
        <p className="px-6 py-16 text-muted">Loading agenda…</p>
      </AppShell>
    );
  }

  if (!meeting || !id || (user && meeting.ownerId !== user.uid)) {
    return (
      <AppShell>
        <div className="px-6 py-16">
          <p className="font-serif text-2xl">Meeting not found</p>
          <Link to="/" className="mt-3 inline-block text-sm text-ember">
            Back to meetings
          </Link>
        </div>
      </AppShell>
    );
  }

  const actualMinutes = sumDurationMinutes(blocks);

  async function patchMeeting(updates: Parameters<typeof updateMeeting>[1]) {
    if (!id) return;
    try {
      await updateMeeting(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save meeting.");
    }
  }

  async function handleAddBlock() {
    if (!id || !meeting) return;
    await addBlock(id, {
      title: "Untitled block",
      description: "",
      docLinks: [],
      objectiveId: meeting.objectiveIds[0] ?? "",
      durationMinutes: 15,
      order: blocks.length,
    });
  }

  function handleChangeBlock(blockId: string, updates: Partial<AgendaBlock>) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block,
      ),
    );
    pendingBlockUpdates.current[blockId] = {
      ...pendingBlockUpdates.current[blockId],
      ...updates,
    };
    window.clearTimeout(blockTimers.current[blockId]);
    blockTimers.current[blockId] = window.setTimeout(() => {
      const patch = pendingBlockUpdates.current[blockId];
      delete pendingBlockUpdates.current[blockId];
      if (id && patch) void updateBlock(id, blockId, patch);
    }, 400);
  }

  async function handleDeleteBlock(blockId: string) {
    if (!id) return;
    window.clearTimeout(blockTimers.current[blockId]);
    delete pendingBlockUpdates.current[blockId];
    setBlocks((current) => current.filter((block) => block.id !== blockId));
    await deleteBlock(id, blockId);
  }

  async function handleReorder(orderedIds: string[]) {
    if (!id) return;
    setBlocks((current) => {
      const map = new Map(current.map((block) => [block.id, block]));
      return orderedIds
        .map((blockId, index) => {
          const block = map.get(blockId);
          return block ? { ...block, order: index } : null;
        })
        .filter((block): block is AgendaBlock => block !== null);
    });
    await reorderBlocks(id, orderedIds);
  }

  async function handlePdf() {
    if (!meeting) return;
    setExporting(true);
    setError(null);
    try {
      const { downloadPreReadPdf } = await import("../features/export/exportPdf");
      await downloadPreReadPdf(meeting, blocks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF export failed.");
    } finally {
      setExporting(false);
    }
  }

  function handleIcsClick() {
    if (meeting?.scheduledAt) {
      try {
        downloadMeetingIcs(meeting, blocks, meeting.scheduledAt);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Calendar export failed.");
      }
      return;
    }
    setIcsOpen(true);
  }

  async function confirmIcs(date: Date) {
    if (!meeting || !id) return;
    setIcsOpen(false);
    try {
      downloadMeetingIcs(meeting, blocks, date);
      await updateMeeting(id, { scheduledAt: date });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calendar export failed.");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-muted hover:text-ink"
        >
          ← Meetings
        </button>

        <header className="mt-4 grid gap-4 rounded-xl border border-line bg-card p-5 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0 space-y-3">
            <input
              value={meeting.title}
              onChange={(event) =>
                setMeeting({ ...meeting, title: event.target.value })
              }
              onBlur={() => void patchMeeting({ title: meeting.title.trim() })}
              className="w-full bg-transparent font-serif text-3xl outline-none"
            />
            <textarea
              value={meeting.description}
              onChange={(event) =>
                setMeeting({ ...meeting, description: event.target.value })
              }
              onBlur={() => void patchMeeting({ description: meeting.description })}
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
                    meeting.scheduledAt
                      ? toDatetimeLocal(meeting.scheduledAt)
                      : ""
                  }
                  onChange={(event) => {
                    const next = fromDatetimeLocal(event.target.value);
                    setMeeting({ ...meeting, scheduledAt: next });
                    void patchMeeting({ scheduledAt: next });
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
                    setMeeting({ ...meeting, targetDurationMinutes: next });
                    void patchMeeting({ targetDurationMinutes: next });
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
          </div>
          <div className="flex flex-wrap items-start gap-2 lg:flex-col lg:items-stretch">
            <button
              type="button"
              onClick={() => void handlePdf()}
              disabled={exporting}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Export PDF pre-read"}
            </button>
            <button
              type="button"
              onClick={handleIcsClick}
              className="rounded-md border border-line px-4 py-2 text-sm"
            >
              Export .ics
            </button>
          </div>
        </header>

        {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
          <ObjectivesPicker
            selectedIds={meeting.objectiveIds}
            onChange={(objectiveIds) => {
              setMeeting({ ...meeting, objectiveIds });
              void patchMeeting({ objectiveIds });
            }}
          />
          <AgendaTimeline
            blocks={blocks}
            objectiveIds={meeting.objectiveIds}
            onAdd={() => void handleAddBlock()}
            onDelete={(blockId) => void handleDeleteBlock(blockId)}
            onReorder={(orderedIds) => void handleReorder(orderedIds)}
            onChange={handleChangeBlock}
          />
          {analysis ? <MeetingAnalytics analysis={analysis} /> : null}
        </div>
      </div>

      {icsOpen ? (
        <IcsDateModal
          initialDate={new Date()}
          onCancel={() => setIcsOpen(false)}
          onConfirm={(date) => void confirmIcs(date)}
        />
      ) : null}
    </AppShell>
  );
}
