import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../features/auth/AuthContext";
import { deleteMeeting, listMeetings } from "../features/meetings/meetingService";
import { formatDuration } from "../lib/duration";
import type { Meeting } from "../types/meeting";

export function DashboardPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    listMeetings(user.uid)
      .then((items) => {
        if (!cancelled) setMeetings(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load meetings.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleDelete(meeting: Meeting) {
    if (!confirm(`Delete “${meeting.title}”? This cannot be undone.`)) return;
    await deleteMeeting(meeting.id);
    setMeetings((current) => current.filter((item) => item.id !== meeting.id));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-ember uppercase">
              Your collection
            </p>
            <h1 className="mt-2 font-serif text-4xl">Meetings</h1>
            <p className="mt-2 max-w-xl text-muted">
              Blackhat a meeting by designing its agenda against objectives before
              you send the invite.
            </p>
          </div>
          <Link
            to="/meetings/new"
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
          >
            New meeting
          </Link>
        </div>

        {loading ? (
          <p className="mt-12 text-muted">Loading meetings…</p>
        ) : error ? (
          <p className="mt-12 text-ember">{error}</p>
        ) : meetings.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-line bg-card px-6 py-16 text-center">
            <p className="font-serif text-2xl">No meetings yet</p>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Start with a title and description. You will add the agenda, date,
              and objectives next.
            </p>
            <Link
              to="/meetings/new"
              className="mt-6 inline-flex rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper"
            >
              Create your first meeting
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {meetings.map((meeting) => (
              <li
                key={meeting.id}
                className="flex flex-col rounded-xl border border-line bg-card p-5 shadow-[0_1px_0_rgba(20,19,17,0.04)]"
              >
                <Link to={`/meetings/${meeting.id}`} className="flex-1">
                  <h2 className="font-serif text-xl leading-snug">{meeting.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">
                    {meeting.description || "No description"}
                  </p>
                  <p className="mt-4 text-xs tracking-wide text-muted uppercase">
                    {meeting.scheduledAt
                      ? meeting.scheduledAt.toLocaleString()
                      : "Date not set"}
                    {meeting.targetDurationMinutes
                      ? ` · Target ${formatDuration(meeting.targetDurationMinutes)}`
                      : ""}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDelete(meeting)}
                  className="mt-4 self-start text-sm text-muted hover:text-ember"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
