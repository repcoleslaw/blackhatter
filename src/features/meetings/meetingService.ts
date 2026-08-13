import {
  addDoc,
  collection,
  deleteDoc,
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
import type {
  AgendaBlock,
  DocLink,
  Meeting,
  MeetingUpdates,
} from "../../types/meeting";

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
    objectiveIds: Array.isArray(data.objectiveIds)
      ? data.objectiveIds.map(String)
      : [],
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

function meetingsCollection() {
  return collection(requireFirebase().db, "meetings");
}

function blocksCollection(meetingId: string) {
  return collection(requireFirebase().db, "meetings", meetingId, "blocks");
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
    objectiveIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMeeting(
  meetingId: string,
  updates: MeetingUpdates,
): Promise<void> {
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.objectiveIds !== undefined) payload.objectiveIds = updates.objectiveIds;
  if (updates.targetDurationMinutes !== undefined) {
    payload.targetDurationMinutes = updates.targetDurationMinutes;
  }
  if (updates.scheduledAt !== undefined) {
    payload.scheduledAt = updates.scheduledAt
      ? Timestamp.fromDate(updates.scheduledAt)
      : null;
  }
  await updateDoc(doc(requireFirebase().db, "meetings", meetingId), payload);
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const { db } = requireFirebase();
  const blocks = await getDocs(blocksCollection(meetingId));
  const batch = writeBatch(db);
  for (const block of blocks.docs) {
    batch.delete(block.ref);
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
  const ref = await addDoc(blocksCollection(meetingId), {
    title: input.title,
    description: input.description,
    docLinks: input.docLinks,
    objectiveId: input.objectiveId,
    durationMinutes: input.durationMinutes,
    order: input.order,
  });
  await updateDoc(doc(requireFirebase().db, "meetings", meetingId), {
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlock(
  meetingId: string,
  blockId: string,
  updates: Partial<Omit<AgendaBlock, "id">>,
): Promise<void> {
  await updateDoc(doc(blocksCollection(meetingId), blockId), updates);
  await updateDoc(doc(requireFirebase().db, "meetings", meetingId), {
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlock(
  meetingId: string,
  blockId: string,
): Promise<void> {
  await deleteDoc(doc(blocksCollection(meetingId), blockId));
  await updateDoc(doc(requireFirebase().db, "meetings", meetingId), {
    updatedAt: serverTimestamp(),
  });
}

export async function reorderBlocks(
  meetingId: string,
  orderedIds: string[],
): Promise<void> {
  const { db } = requireFirebase();
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "meetings", meetingId, "blocks", id), { order: index });
  });
  batch.update(doc(db, "meetings", meetingId), { updatedAt: serverTimestamp() });
  await batch.commit();
}
