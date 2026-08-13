import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../features/auth/AuthContext";
import { createMeeting } from "../features/meetings/meetingService";

export function MeetingCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setPending(true);
    setError(null);
    try {
      const id = await createMeeting({
        ownerId: user.uid,
        title: title.trim(),
        description: description.trim(),
      });
      navigate(`/meetings/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create meeting.");
      setPending(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-xs font-medium tracking-[0.22em] text-ember uppercase">
          New meeting
        </p>
        <h1 className="mt-2 font-serif text-4xl">Blackhat this meeting</h1>
        <p className="mt-2 text-muted">
          Start with a title and description. Duration, date, and objectives come
          next in the agenda builder.
        </p>
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
              className="w-full rounded-md border border-line bg-card px-3 py-2 outline-none ring-ember/30 focus:ring-2"
              placeholder="Q3 planning review"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full resize-y rounded-md border border-line bg-card px-3 py-2 outline-none ring-ember/30 focus:ring-2"
              placeholder="Why this meeting exists, and who it is for."
            />
          </label>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending || !title.trim()}
              className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create meeting"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-line px-4 py-2.5 text-sm hover:bg-card"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
