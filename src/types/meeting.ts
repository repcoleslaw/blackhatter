export type DocLink = {
  label: string;
  url: string;
};

export type MeetingObjective = {
  id: string;
  title: string;
  categoryId: string;
};

export type AgendaBlock = {
  id: string;
  title: string;
  description: string;
  docLinks: DocLink[];
  objectiveId: string;
  durationMinutes: number;
  order: number;
};

export type Participant = {
  id: string;
  role: string;
  company: string;
  rate: number;
  order: number;
};

export type Meeting = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  scheduledAt: Date | null;
  targetDurationMinutes: number | null;
  objectives: MeetingObjective[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Date | null;
};

export type MeetingUpdates = Partial<
  Pick<
    Meeting,
    | "title"
    | "description"
    | "scheduledAt"
    | "targetDurationMinutes"
    | "objectives"
  >
>;
