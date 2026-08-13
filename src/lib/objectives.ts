export type Objective = {
  id: string;
  label: string;
  description: string;
};

export const OBJECTIVES: Objective[] = [
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

export function getObjective(id: string): Objective | undefined {
  return OBJECTIVES.find((objective) => objective.id === id);
}
