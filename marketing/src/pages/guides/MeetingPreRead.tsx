import { Link } from "react-router-dom";
import { GuideH2, GuideLayout } from "../../components/GuideLayout";

export function MeetingPreReadPage() {
  return (
    <GuideLayout
      kicker="Guide"
      title="Meeting pre-read: what to send before the hold"
      lede="If people sit down without a plan, the first ten minutes are a briefing you already could have written. A pre-read is that briefing, sent on purpose."
    >
      <p>
        A <strong className="font-medium text-ink">meeting pre-read</strong> is
        the document attendees can use before the hold: what the meeting is for,
        which objectives you refuse to miss, how the time is blocked, and what
        they should do (or not do) in advance. It is not a slide dump, and it is
        not the minutes from last time. It is the design of this meeting, made
        portable.
      </p>
      <p>
        Blackhatter exports that as a PDF so the plan, the timing, and the
        purpose travel with the invite. You still have to write a meeting worth
        reading. The export only helps if the agenda was designed against real
        objectives first.
      </p>

      <GuideH2>Why the invite is not enough</GuideH2>
      <p>
        Calendar descriptions are a graveyard of one-liners. “Quick sync.”
        “Catch up on X.” “Planning.” Recipients accept because declining is
        social work, then arrive with no shared picture of success. The owner
        spends the opening reconstructing context that could have been a
        one-page pre-read.
      </p>
      <p>
        A hold without a plan also hides duration lies. If the invite says
        thirty minutes and the work needs fifty, nobody can push back until they
        are already in the room. Putting the agenda on a page before the hold
        makes that mismatch visible while people can still reschedule or cut
        scope.
      </p>
      <p>
        Pre-reads respect the people who prepare and constrain the people who
        do not. You cannot force reading. You can refuse to replay the document
        out loud for those who skipped it. State that in the pre-read itself:
        we will not recap pages one and two.
      </p>

      <GuideH2>What to put on the page</GuideH2>
      <p>
        Title and owner, in human language. Objectives as sentences, not tags
        alone — Decide, Align, Inform, and the rest of the preset list, each
        spelled out so a new attendee knows what “done” means. Timed agenda
        blocks with labels long enough to be understood out of context. Total
        duration next to the booked hold so a mismatch is obvious.
      </p>
      <p>
        Add only the context that unblocks the hour: the two options under
        decision, the draft you want alignment on, the metric the status block
        will inspect. Link out instead of pasting a novel. If the packet takes
        twenty minutes to read, say so, and send it with enough lead time that
        “I didn’t see this” is a choice.
      </p>
      <p>
        Say who must attend and who is optional. A pre-read that lists twelve
        people for a decision that three can make is a warning. Cut the list or
        split Inform into an async note. The pre-read is a good place to write
        that down before the hold goes out.
      </p>

      <GuideH2>When to send it</GuideH2>
      <p>
        Same day as the invite when the meeting is in the next week and the
        packet is short. A day or two ahead when people need to review options
        or pull numbers. Same morning only for true operational huddles whose
        “pre-read” is a three-line agenda. Do not send a ten-page brief an hour
        before a decision meeting and call it preparation.
      </p>
      <p>
        Pair the PDF with a calendar hold that matches. Title, description, and
        duration on the .ics should not contradict the pre-read. If the agenda
        changed, export again. A stale pre-read is worse than none: people
        prepare for the wrong hour.
      </p>

      <GuideH2>How this ties to the agenda</GuideH2>
      <p>
        A pre-read cannot rescue an agenda that was not built from objectives.
        If coverage is thin — you claimed Decide but scheduled only Status —
        the PDF will simply advertise the gap. Fix the design first. Use{" "}
        <Link
          to="/guides/meeting-agenda-from-objectives"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          building an agenda from objectives
        </Link>{" "}
        as the checklist, then export.
      </p>
      <p>
        Duration belongs on the same page. If the blocks add up past the hold,
        the pre-read should show it. See{" "}
        <Link
          to="/guides/meeting-length"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          how long this meeting should be
        </Link>{" "}
        before you lock the invite.
      </p>
      <p>
        Facilitators who send a pre-read are not being precious. They are moving
        Inform out of the room so Decide and Align can use the time. The meeting
        starts when people sit down; the design has to start earlier. Export the
        plan, attach the hold, and let the hour be for the work the page already
        named.
      </p>
    </GuideLayout>
  );
}
