import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { requireFirebase } from "../../lib/firebase";
import { getCategory, MAX_OBJECTIVES } from "../../lib/objectives";
import { isAllowedDocLinkUrl } from "../../lib/urls";
import type {
  AgendaBlock,
  DocLink,
  Meeting,
  MeetingObjective,
  MeetingUpdates,
  Participant,
} from "../../types/meeting";

const MAX_DOC_LINKS = 10;
export const MAX_PARTICIPANTS = 20;
export const DEFAULT_PARTICIPANT_COMPANY = "my company";
export const DEFAULT_PARTICIPANT_RATE = 100;

function assertSafeDocLinks(docLinks: DocLink[]) {
  if (docLinks.length > MAX_DOC_LINKS) {
    throw new Error("A block can have at most 10 documentation links.");
  }
  for (const link of docLinks) {
    if (!isAllowedDocLinkUrl(link.url)) {
      throw new Error("Documentation links must use https:// URLs.");
    }
  }
}

function toDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }
  return null;
}

function toObjectives(data: DocumentData): MeetingObjective[] {
  if (Array.isArray(data.objectives)) {
    return data.objectives
      .map((item: unknown) => {
        const objective = (item ?? {}) as Record<string, unknown>;
        return {
          id: String(objective.id ?? ""),
          title: String(objective.title ?? ""),
          categoryId: String(objective.categoryId ?? ""),
        };
      })
      .filter((objective) => objective.id);
  }
  if (Array.isArray(data.objectiveIds)) {
    return data.objectiveIds.map(String).map((id) => {
      const category = getCategory(id);
      return {
        id,
        title: category?.label ?? id,
        categoryId: id,
      };
    });
  }
  return [];
}

function serializeObjectives(objectives: MeetingObjective[]): MeetingObjective[] {
  if (objectives.length > MAX_OBJECTIVES) {
    throw new Error(`A meeting can have at most ${MAX_OBJECTIVES} objectives.`);
  }
  return objectives.map((objective) => {
    const title = objective.title.trim().slice(0, 200);
    if (!objective.id || !title || !getCategory(objective.categoryId)) {
      throw new Error("Each objective needs a title and category.");
    }
    return {
      id: objective.id.slice(0, 64),
      title,
      categoryId: objective.categoryId,
    };
  });
}

function meetingTouchPayload(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): Record<string, unknown> {
  const data = snapshot.data();
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (!Array.isArray(data.objectives) || data.objectiveIds !== undefined) {
    payload.objectives = serializeObjectives(toObjectives(data));
    payload.objectiveIds = deleteField();
  }
  return payload;
}

async function touchMeeting(meetingId: string): Promise<void> {
  const ref = doc(requireFirebase().db, "meetings", meetingId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await updateDoc(
    ref,
    meetingTouchPayload(snapshot as QueryDocumentSnapshot<DocumentData>),
  );
}

function toMeeting(snapshot: QueryDocumentSnapshot<DocumentData>): Meeting {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ownerId: String(data.ownerId ?? ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    scheduledAt: toDate(data.scheduledAt),
    targetDurationMinutes:
      typeof data.targetDurationMinutes === "number"
        ? data.targetDurationMinutes
        : null,
    objectives: toObjectives(data),
    createdAt: toDate(data.createdAt) ?? new Date(0),
    updatedAt: toDate(data.updatedAt) ?? new Date(0),
  };
}

function toBlock(snapshot: QueryDocumentSnapshot<DocumentData>): AgendaBlock {
  const data = snapshot.data();
  const docLinks: DocLink[] = Array.isArray(data.docLinks)
    ? data.docLinks.map((link: unknown) => {
        const item = (link ?? {}) as Record<string, unknown>;
        return {
          label: String(item.label ?? ""),
          url: String(item.url ?? ""),
        };
      })
    : [];
  return {
    id: snapshot.id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    docLinks,
    objectiveId: String(data.objectiveId ?? ""),
    durationMinutes: Number(data.durationMinutes) || 0,
    order: Number(data.order) || 0,
  };
}

function toParticipant(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): Participant {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    role: String(data.role ?? ""),
    company: String(data.company ?? DEFAULT_PARTICIPANT_COMPANY),
    rate: Number(data.rate) || 0,
    order: Number(data.order) || 0,
  };
}

function meetingsCollection() {
  return collection(requireFirebase().db, "meetings");
}

function blocksCollection(meetingId: string) {
  return collection(requireFirebase().db, "meetings", meetingId, "blocks");
}

function participantsCollection(meetingId: string) {
  return collection(requireFirebase().db, "meetings", meetingId, "participants");
}

export function createDraftParticipant(order: number): Participant {
  return {
    id: crypto.randomUUID(),
    role: "",
    company: DEFAULT_PARTICIPANT_COMPANY,
    rate: DEFAULT_PARTICIPANT_RATE,
    order,
  };
}

export async function listMeetings(ownerId: string): Promise<Meeting[]> {
  const snapshot = await getDocs(
    query(meetingsCollection(), where("ownerId", "==", ownerId)),
  );
  return snapshot.docs
    .map(toMeeting)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getMeeting(meetingId: string): Promise<Meeting | null> {
  const snapshot = await getDoc(doc(requireFirebase().db, "meetings", meetingId));
  if (!snapshot.exists()) return null;
  return toMeeting(snapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function createMeeting(input: {
  ownerId: string;
  title: string;
  description: string;
}): Promise<string> {
  const ref = await addDoc(meetingsCollection(), {
    ownerId: input.ownerId,
    title: input.title.trim(),
    description: input.description.trim(),
    scheduledAt: null,
    targetDurationMinutes: null,
    objectives: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMeeting(
  meetingId: string,
  updates: MeetingUpdates,
): Promise<void> {
  const ref = doc(requireFirebase().db, "meetings", meetingId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    throw new Error("Meeting not found.");
  }
  const current = toMeeting(snapshot as QueryDocumentSnapshot<DocumentData>);
  const objectives = serializeObjectives(updates.objectives ?? current.objectives);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
    objectives,
    objectiveIds: deleteField(),
  };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.targetDurationMinutes !== undefined) {
    payload.targetDurationMinutes = updates.targetDurationMinutes;
  }
  if (updates.scheduledAt !== undefined) {
    payload.scheduledAt = updates.scheduledAt
      ? Timestamp.fromDate(updates.scheduledAt)
      : null;
  }
  await updateDoc(ref, payload);
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const { db } = requireFirebase();
  const [blocks, participants] = await Promise.all([
    getDocs(blocksCollection(meetingId)),
    getDocs(participantsCollection(meetingId)),
  ]);
  const batch = writeBatch(db);
  for (const block of blocks.docs) {
    batch.delete(block.ref);
  }
  for (const participant of participants.docs) {
    batch.delete(participant.ref);
  }
  batch.delete(doc(db, "meetings", meetingId));
  await batch.commit();
}

export function subscribeToMeeting(
  meetingId: string,
  onNext: (meeting: Meeting | null) => void,
): () => void {
  return onSnapshot(doc(requireFirebase().db, "meetings", meetingId), (snapshot) => {
    if (!snapshot.exists()) {
      onNext(null);
      return;
    }
    onNext(toMeeting(snapshot as QueryDocumentSnapshot<DocumentData>));
  });
}

export function subscribeToBlocks(
  meetingId: string,
  onNext: (blocks: AgendaBlock[]) => void,
): () => void {
  return onSnapshot(
    query(blocksCollection(meetingId), orderBy("order")),
    (snapshot) => {
      onNext(snapshot.docs.map(toBlock));
    },
  );
}

export async function addBlock(
  meetingId: string,
  input: Omit<AgendaBlock, "id">,
): Promise<string> {
  assertSafeDocLinks(input.docLinks);
  const ref = await addDoc(blocksCollection(meetingId), {
    title: input.title,
    description: input.description,
    docLinks: input.docLinks,
    objectiveId: input.objectiveId,
    durationMinutes: input.durationMinutes,
    order: input.order,
  });
  await touchMeeting(meetingId);
  return ref.id;
}

export async function updateBlock(
  meetingId: string,
  blockId: string,
  updates: Partial<Omit<AgendaBlock, "id">>,
): Promise<void> {
  if (updates.docLinks) {
    assertSafeDocLinks(updates.docLinks);
  }
  await updateDoc(doc(blocksCollection(meetingId), blockId), updates);
  await touchMeeting(meetingId);
}

export async function deleteBlock(
  meetingId: string,
  blockId: string,
): Promise<void> {
  await deleteDoc(doc(blocksCollection(meetingId), blockId));
  await touchMeeting(meetingId);
}

export async function reorderBlocks(
  meetingId: string,
  orderedIds: string[],
): Promise<void> {
  const { db } = requireFirebase();
  const meetingRef = doc(db, "meetings", meetingId);
  const snapshot = await getDoc(meetingRef);
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "meetings", meetingId, "blocks", id), { order: index });
  });
  if (snapshot.exists()) {
    batch.update(
      meetingRef,
      meetingTouchPayload(snapshot as QueryDocumentSnapshot<DocumentData>),
    );
  }
  await batch.commit();
}

export function subscribeToParticipants(
  meetingId: string,
  onNext: (participants: Participant[]) => void,
): () => void {
  return onSnapshot(
    query(participantsCollection(meetingId), orderBy("order")),
    (snapshot) => {
      onNext(snapshot.docs.map(toParticipant));
    },
  );
}

export async function saveParticipants(
  meetingId: string,
  next: Participant[],
): Promise<void> {
  if (next.length > MAX_PARTICIPANTS) {
    throw new Error(`A meeting can have at most ${MAX_PARTICIPANTS} participants.`);
  }
  const { db } = requireFirebase();
  const meetingRef = doc(db, "meetings", meetingId);
  const [existing, meetingSnapshot] = await Promise.all([
    getDocs(participantsCollection(meetingId)),
    getDoc(meetingRef),
  ]);
  const nextIds = new Set(next.map((participant) => participant.id));
  const batch = writeBatch(db);

  for (const snapshot of existing.docs) {
    if (!nextIds.has(snapshot.id)) {
      batch.delete(snapshot.ref);
    }
  }

  next.forEach((participant, index) => {
    const rate = Math.min(100000, Math.max(0, Number(participant.rate) || 0));
    batch.set(doc(db, "meetings", meetingId, "participants", participant.id), {
      role: participant.role.trim().slice(0, 100),
      company: (participant.company.trim() || DEFAULT_PARTICIPANT_COMPANY).slice(
        0,
        100,
      ),
      rate,
      order: index,
    });
  });

  if (meetingSnapshot.exists()) {
    batch.update(
      meetingRef,
      meetingTouchPayload(
        meetingSnapshot as QueryDocumentSnapshot<DocumentData>,
      ),
    );
  }
  await batch.commit();
}
