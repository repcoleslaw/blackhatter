import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../features/auth/AuthContext";
import { authErrorMessage } from "../features/auth/authErrors";
import { listMeetings } from "../features/meetings/meetingService";

export function ProfilePage() {
  const { user, profile, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [meetingCount, setMeetingCount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? "");
  }, [profile?.displayName]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    listMeetings(user.uid)
      .then((meetings) => {
        if (!cancelled) setMeetingCount(meetings.length);
      })
      .catch(() => {
        if (!cancelled) setMeetingCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await updateDisplayName(displayName.trim());
      setMessage("Profile updated.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-xs font-medium tracking-[0.22em] text-ember uppercase">
          Account
        </p>
        <h1 className="mt-2 font-serif text-4xl">Profile</h1>
        <p className="mt-2 text-muted">
          Your meetings live with this account. Date and agenda details are
          stored per meeting.
        </p>

        <div className="mt-8 flex items-center gap-4 rounded-xl border border-line bg-card p-5">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-serif text-xl text-paper">
              {(profile?.displayName || profile?.email || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{profile?.displayName || "Unnamed"}</p>
            <p className="text-sm text-muted">{profile?.email || user?.email}</p>
            <p className="mt-1 text-sm text-muted">
              {meetingCount == null
                ? "Counting meetings…"
                : `${meetingCount} meeting${meetingCount === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-8 space-y-4 rounded-xl border border-line bg-card p-5"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Display name</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-ember/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input
              value={profile?.email || user?.email || ""}
              disabled
              className="w-full rounded-md border border-line bg-paper/60 px-3 py-2 text-muted"
            />
          </label>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          {message ? <p className="text-sm text-moss">{message}</p> : null}
          <button
            type="submit"
            disabled={pending || !displayName.trim()}
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save name"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
