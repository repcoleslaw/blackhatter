import type { MeetingObjective } from "../types/meeting";

export type ObjectiveCategory = {
  id: string;
  label: string;
  description: string;
};

export const OBJECTIVE_CATEGORIES: ObjectiveCategory[] = [
  { id: "decide", label: "Decide", description: "Make a decision" },
  { id: "align", label: "Align", description: "Get alignment" },
  { id: "inform", label: "Inform", description: "Share information" },
  {
    id: "ideate",
    label: "Ideate",
    description: "Brainstorm / generate options",
  },
  { id: "status", label: "Status", description: "Status update" },
  { id: "review", label: "Review", description: "Review work or outcomes" },
  {
    id: "problem_solve",
    label: "Problem-solve",
    description: "Diagnose and solve a problem",
  },
  { id: "plan", label: "Plan", description: "Plan next steps" },
];

export const MAX_OBJECTIVES = 20;
export const OBJECTIVE_NA_ID = "na";

export function isObjectiveNa(id: string): boolean {
  return id === OBJECTIVE_NA_ID;
}

export function isValidBlockObjective(
  objectiveId: string,
  objectives: MeetingObjective[],
): boolean {
  return (
    isObjectiveNa(objectiveId) ||
    Boolean(getMeetingObjective(objectives, objectiveId))
  );
}

export function getCategory(id: string): ObjectiveCategory | undefined {
  return OBJECTIVE_CATEGORIES.find((category) => category.id === id);
}

export function getMeetingObjective(
  objectives: MeetingObjective[],
  id: string,
): MeetingObjective | undefined {
  return objectives.find((objective) => objective.id === id);
}

export function createMeetingObjective(
  title: string,
  categoryId: string,
): MeetingObjective {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    categoryId,
  };
}
