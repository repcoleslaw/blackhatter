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
import type { UserProfile } from "../../types/meeting";

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
    photoURL: data.photoURL ? String(data.photoURL) : null,
    createdAt: createdAt?.toDate?.() ?? null,
  };
}

async function ensureUserProfile(user: User): Promise<UserProfile> {
  if (!db) throw new Error("Firestore is not configured.");
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
    return {
      uid: user.uid,
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? null,
      createdAt: new Date(),
    };
  }
  return toProfile(user.uid, snapshot.data());
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
        await updateProfile(credential.user, { displayName });
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            displayName,
            email: credential.user.email ?? email,
            photoURL: credential.user.photoURL ?? null,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
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
        await updateProfile(auth.currentUser, { displayName });
        await updateDoc(doc(db, "users", auth.currentUser.uid), { displayName });
        setProfile((current) =>
          current ? { ...current, displayName } : current,
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
