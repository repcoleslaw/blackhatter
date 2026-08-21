import { getMeetingObjective, isValidBlockObjective } from "../../lib/objectives";
import { sumDurationMinutes } from "../../lib/duration";
import type { AgendaBlock, Meeting, MeetingObjective } from "../../types/meeting";

export type DurationStatus = "none" | "under" | "on" | "over";

export type MeetingAnalysis = {
  selectedCount: number;
  objectivesMet: boolean;
  uncoveredObjectiveIds: string[];
  invalidBlocks: AgendaBlock[];
  actualMinutes: number;
  targetMinutes: number | null;
  durationStatus: DurationStatus;
};

export function analyzeMeeting(
  meeting: Meeting,
  blocks: AgendaBlock[],
): MeetingAnalysis {
  const selected = meeting.objectives.map((objective) => objective.id);
  const validBlocks = blocks.filter((block) =>
    selected.includes(block.objectiveId),
  );
  const covered = new Set(validBlocks.map((block) => block.objectiveId));
  const uncoveredObjectiveIds = selected.filter((id) => !covered.has(id));
  const invalidBlocks = blocks.filter(
    (block) => !isValidBlockObjective(block.objectiveId, meeting.objectives),
  );
  const actualMinutes = sumDurationMinutes(blocks);
  const targetMinutes = meeting.targetDurationMinutes;
  let durationStatus: DurationStatus = "none";
  if (targetMinutes != null && targetMinutes > 0) {
    if (actualMinutes < targetMinutes) durationStatus = "under";
    else if (actualMinutes === targetMinutes) durationStatus = "on";
    else durationStatus = "over";
  }

  return {
    selectedCount: selected.length,
    objectivesMet: selected.length > 0 && uncoveredObjectiveIds.length === 0,
    uncoveredObjectiveIds,
    invalidBlocks,
    actualMinutes,
    targetMinutes,
    durationStatus,
  };
}

export function uncoveredLabels(
  ids: string[],
  objectives: MeetingObjective[],
): string[] {
  return ids.map((id) => getMeetingObjective(objectives, id)?.title ?? id);
}
