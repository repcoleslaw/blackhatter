import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  setLogLevel,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";

setLogLevel("error");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_ID = "demo-blackhatter";

/** @type {import("@firebase/rules-unit-testing").RulesTestEnvironment} */
let testEnv;

function alice() {
  return testEnv.authenticatedContext("alice", { email: "alice@example.com" });
}

function userFields(email, extra = {}) {
  return {
    displayName: "Alice",
    email,
    photoURL: null,
    createdAt: serverTimestamp(),
    ...extra,
  };
}

function meetingFields(ownerId, extra = {}) {
  return {
    ownerId,
    title: "Planning",
    description: "Weekly",
    scheduledAt: null,
    targetDurationMinutes: null,
    objectives: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...extra,
  };
}

function blockFields(extra = {}) {
  return {
    title: "Intro",
    description: "",
    docLinks: [],
    objectiveId: "inform",
    durationMinutes: 15,
    order: 0,
    ...extra,
  };
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(join(root, "firestore.rules"), "utf8"),
    },
    storage: {
      rules: readFileSync(join(root, "storage.rules"), "utf8"),
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.clearStorage();
});

describe("users", () => {
  it("allows an owner to create their profile", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "users", "alice"), userFields("alice@example.com")),
    );
  });

  it("denies writing another user's profile", async () => {
    const db = alice().firestore();
    await assertFails(
      setDoc(doc(db, "users", "bob"), userFields("bob@example.com")),
    );
  });

  it("denies extra keys on a profile", async () => {
    const db = alice().firestore();
    await assertFails(
      setDoc(
        doc(db, "users", "alice"),
        userFields("alice@example.com", { role: "admin" }),
      ),
    );
  });

  it("denies deleting a profile", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "users", "alice"), userFields("alice@example.com")),
    );
    await assertFails(deleteDoc(doc(db, "users", "alice")));
  });
});

describe("meetings", () => {
  it("denies creating a meeting with another user's ownerId", async () => {
    const db = alice().firestore();
    await assertFails(
      setDoc(doc(db, "meetings", "m1"), meetingFields("bob")),
    );
  });

  it("denies transferring ownerId to another user", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertFails(
      updateDoc(doc(db, "meetings", "m1"), {
        ownerId: "bob",
        updatedAt: serverTimestamp(),
      }),
    );
  });

  it("allows custom meeting objectives", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(
        doc(db, "meetings", "m1"),
        meetingFields("alice", {
          objectives: [
            {
              id: "obj-1",
              title: "Approve hiring plan",
              categoryId: "decide",
            },
          ],
        }),
      ),
    );
  });

  it("denies an unknown objective category", async () => {
    const db = alice().firestore();
    await assertFails(
      setDoc(
        doc(db, "meetings", "m1"),
        meetingFields("alice", {
          objectives: [
            { id: "obj-1", title: "Ship it", categoryId: "unknown" },
          ],
        }),
      ),
    );
  });
});

describe("blocks", () => {
  it("denies docLinks that are not https", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertFails(
      addDoc(collection(db, "meetings", "m1", "blocks"), blockFields({
        docLinks: [{ label: "docs", url: "javascript:alert(1)" }],
      })),
    );
  });

  it("allows an https documentation link", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertSucceeds(
      addDoc(collection(db, "meetings", "m1", "blocks"), blockFields({
        docLinks: [{ label: "docs", url: "https://example.com/spec" }],
      })),
    );
  });
});

describe("participants", () => {
  it("allows an owner to add a participant", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1", "participants", "p1"), {
        role: "PM",
        company: "my company",
        rate: 100,
        order: 0,
      }),
    );
  });

  it("denies extra keys on a participant", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertFails(
      setDoc(doc(db, "meetings", "m1", "participants", "p1"), {
        role: "PM",
        company: "my company",
        rate: 100,
        order: 0,
        email: "pm@example.com",
      }),
    );
  });

  it("denies a negative rate", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "meetings", "m1"), meetingFields("alice")),
    );
    await assertFails(
      setDoc(doc(db, "meetings", "m1", "participants", "p1"), {
        role: "PM",
        company: "my company",
        rate: -1,
        order: 0,
      }),
    );
  });
});

describe("storage", () => {
  it("denies uploads even for the authenticated owner", async () => {
    const storage = alice().storage();
    await assertFails(
      uploadString(ref(storage, "users/alice/payload.exe"), "MZ"),
    );
  });
});
