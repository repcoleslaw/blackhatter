import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { MeetingDetails } from "../features/meetings/MeetingDetails";
import { ParticipantsModal } from "../features/meetings/ParticipantsModal";
import { AgendaTimeline } from "../features/agenda/AgendaTimeline";
import { ObjectivesPicker } from "../features/agenda/ObjectivesPicker";
import { MeetingAnalytics } from "../features/analytics/MeetingAnalytics";
import { analyzeMeeting } from "../features/analytics/analyzeMeeting";
import { calculateMeetingCost } from "../features/analytics/calculateMeetingCost";
import { useAuth } from "../features/auth/AuthContext";
import { IcsDateModal } from "../features/export/IcsDateModal";
import { downloadMeetingIcs } from "../features/export/exportIcs";
import {
  addBlock,
  deleteBlock,
  reorderBlocks,
  saveParticipants,
  subscribeToBlocks,
  subscribeToMeeting,
  subscribeToParticipants,
  updateBlock,
  updateMeeting,
} from "../features/meetings/meetingService";
import { sumDurationMinutes } from "../lib/duration";
import type { AgendaBlock, Meeting, Participant } from "../types/meeting";

export function AgendaBuilderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [blocks, setBlocks] = useState<AgendaBlock[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [icsOpen, setIcsOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
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
    const unsubParticipants = subscribeToParticipants(id, setParticipants);
    return () => {
      unsubMeeting();
      unsubBlocks();
      unsubParticipants();
      for (const timer of Object.values(timers)) {
        window.clearTimeout(timer);
      }
    };
  }, [id]);

  const analysis = useMemo(
    () => (meeting ? analyzeMeeting(meeting, blocks) : null),
    [meeting, blocks],
  );
  const actualMinutes = useMemo(() => sumDurationMinutes(blocks), [blocks]);
  const cost = useMemo(
    () => calculateMeetingCost(participants, actualMinutes),
    [participants, actualMinutes],
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
      objectiveId: meeting.objectives[0]?.id ?? "",
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

  async function handleSaveParticipants(next: Participant[]) {
    if (!id) return;
    setParticipantsOpen(false);
    setParticipants(next);
    try {
      await saveParticipants(id, next);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save participants.",
      );
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

        <MeetingDetails
          meeting={meeting}
          actualMinutes={actualMinutes}
          participantCount={participants.length}
          exporting={exporting}
          onChange={(next) => setMeeting(next)}
          onPatch={(updates) => void patchMeeting(updates)}
          onAddParticipants={() => setParticipantsOpen(true)}
          onPdf={() => void handlePdf()}
          onIcs={handleIcsClick}
        />

        {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
          <ObjectivesPicker
            objectives={meeting.objectives}
            onChange={(objectives) => {
              setMeeting({ ...meeting, objectives });
              void patchMeeting({ objectives });
            }}
          />
          <AgendaTimeline
            blocks={blocks}
            objectives={meeting.objectives}
            onAdd={() => void handleAddBlock()}
            onDelete={(blockId) => void handleDeleteBlock(blockId)}
            onReorder={(orderedIds) => void handleReorder(orderedIds)}
            onChange={handleChangeBlock}
          />
          {analysis ? (
            <MeetingAnalytics
              analysis={analysis}
              cost={cost}
              objectives={meeting.objectives}
            />
          ) : null}
        </div>
      </div>

      {icsOpen ? (
        <IcsDateModal
          initialDate={new Date()}
          onCancel={() => setIcsOpen(false)}
          onConfirm={(date) => void confirmIcs(date)}
        />
      ) : null}

      {participantsOpen ? (
        <ParticipantsModal
          initialParticipants={participants}
          onCancel={() => setParticipantsOpen(false)}
          onSave={(next) => void handleSaveParticipants(next)}
        />
      ) : null}
    </AppShell>
  );
}
