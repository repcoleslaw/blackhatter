import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../../lib/firebase";
import { isHttpsUrl } from "../../lib/urls";
import type { UserProfile } from "../../types/meeting";

const MAX_DISPLAY_NAME = 80;

function profileFields(user: User, displayName?: string) {
  return {
    displayName: (displayName ?? user.displayName ?? "").slice(0, MAX_DISPLAY_NAME),
    email: user.email ?? "",
    photoURL: isHttpsUrl(user.photoURL) ? user.photoURL : null,
  };
}

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toProfile(
  uid: string,
  data: Record<string, unknown>,
): UserProfile {
  const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
  return {
    uid,
    displayName: String(data.displayName ?? ""),
    email: String(data.email ?? ""),
    photoURL: isHttpsUrl(data.photoURL) ? data.photoURL : null,
    createdAt: createdAt?.toDate?.() ?? null,
  };
}

async function ensureUserProfile(
  user: User,
  overrides?: { displayName?: string },
): Promise<UserProfile> {
  if (!db) throw new Error("Firestore is not configured.");
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  const fields = profileFields(user, overrides?.displayName);
  if (!snapshot.exists()) {
    try {
      await setDoc(ref, {
        ...fields,
        createdAt: serverTimestamp(),
      });
      return {
        uid: user.uid,
        ...fields,
        createdAt: new Date(),
      };
    } catch (error) {
      const raced = await getDoc(ref);
      if (!raced.exists()) throw error;
      return finishProfile(user.uid, raced.data(), fields, overrides);
    }
  }
  return finishProfile(user.uid, snapshot.data(), fields, overrides);
}

async function finishProfile(
  uid: string,
  data: Record<string, unknown>,
  fields: ReturnType<typeof profileFields>,
  overrides?: { displayName?: string },
): Promise<UserProfile> {
  if (
    overrides?.displayName != null &&
    fields.displayName !== String(data.displayName ?? "")
  ) {
    if (!db) throw new Error("Firestore is not configured.");
    await updateDoc(doc(db, "users", uid), { displayName: fields.displayName });
    return toProfile(uid, { ...data, displayName: fields.displayName });
  }
  return toProfile(uid, data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const nextProfile = await ensureUserProfile(nextUser);
        setProfile(nextProfile);
      } catch (error) {
        console.error(error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      async signIn(email, password) {
        if (!auth) throw new Error("Firebase is not configured.");
        await signInWithEmailAndPassword(auth, email, password);
      },
      async signUp(email, password, displayName) {
        if (!auth || !db) throw new Error("Firebase is not configured.");
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const name = displayName.trim().slice(0, MAX_DISPLAY_NAME);
        await updateProfile(credential.user, { displayName: name });
        await ensureUserProfile(credential.user, { displayName: name });
      },
      async signInWithGoogle() {
        if (!auth || !googleProvider) {
          throw new Error("Firebase is not configured.");
        }
        await signInWithPopup(auth, googleProvider);
      },
      async signOut() {
        if (!auth) return;
        await firebaseSignOut(auth);
      },
      async updateDisplayName(displayName) {
        if (!auth?.currentUser || !db) {
          throw new Error("Firebase is not configured.");
        }
        const nextName = displayName.trim().slice(0, MAX_DISPLAY_NAME);
        await updateProfile(auth.currentUser, { displayName: nextName });
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          displayName: nextName,
        });
        setProfile((current) =>
          current ? { ...current, displayName: nextName } : current,
        );
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
