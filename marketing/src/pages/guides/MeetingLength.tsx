import { Link } from "react-router-dom";
import { GuideH2, GuideLayout } from "../../components/GuideLayout";

export function MeetingLengthPage() {
  return (
    <GuideLayout
      kicker="Guide"
      title="How long should this meeting be?"
      lede="The hold is a budget. The agenda is the spend. If they do not match, someone is lying — usually the invite."
    >
      <p>
        Default lengths are habits, not estimates. Thirty minutes because the
        calendar snaps there. Sixty because that is what last week’s recurring
        used. The honest question is:{" "}
        <strong className="font-medium text-ink">
          how long should this meeting be
        </strong>{" "}
        given the objectives and the blocks you actually planned? Blackhatter
        compares agenda duration to the hold so that gap is visible before
        anyone sits down.
      </p>
      <p>
        Time is also money when you count the people in the room. A bloated
        status hour with eight salaries in it is an expensive way to read a
        document aloud. Duration analytics exist to make that uncomfortable
        early, while you can still cut a block or shrink the guest list.
      </p>

      <GuideH2>Add the blocks, then pick the hold</GuideH2>
      <p>
        Work backwards from the agenda, not forwards from a round number. List
        the objectives, give each a block with a duration you would defend in
        front of the group, and sum them. That sum is the meeting. Round to a
        calendar-friendly length only after you have a real total — and only
        upward if you need a buffer, never downward to “make it fit.”
      </p>
      <p>
        If the sum is eighteen minutes, book twenty-five or send a prompt
        instead. If the sum is seventy, do not book sixty and talk faster. Split
        the meeting, move Inform into a{" "}
        <Link
          to="/guides/meeting-pre-read"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          pre-read
        </Link>
        , or drop an objective. Optimism is not a facilitation technique.
      </p>
      <p>
        Buffers are for transitions and the one decision that always runs hot,
        not for mystery content. Five minutes on a forty-minute Decide is
        reasonable. Twenty minutes of unnamed “discussion” is how Status
        colonizes the hour.
      </p>

      <GuideH2>Match the length to the objective</GuideH2>
      <p>
        Inform can often leave the room entirely. If it must stay, keep it
        short and pointed at a question, not a tour of slides. Status belongs
        in a tight loop: what moved, what is stuck, what you need. Ideate needs
        more time than people admit, and it fails if you also expect a decision
        in the same half hour.
      </p>
      <p>
        Decide needs a packet and a framed choice. With that, twenty-five
        focused minutes can beat a meandering sixty. Without it, sixty minutes
        still will not decide; it will discover that you were not ready. Align
        is similar: alignment on a written draft is faster than alignment on
        vibes.
      </p>
      <p>
        Problem-solve and Plan usually need more wall clock than a standup, and
        fewer people. Review can be short if the work is already in a place
        attendees could have opened yesterday. When objectives mix, the longest
        honest block sets a floor. Do not staple Ideate onto Decide and keep
        the original thirty-minute hold.
      </p>
      <p>
        Build those blocks from aims first. The companion guide{" "}
        <Link
          to="/guides/meeting-agenda-from-objectives"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          how to build a meeting agenda from objectives
        </Link>{" "}
        is the other half of this math.
      </p>

      <GuideH2>Watch the hold, not just the clock</GuideH2>
      <p>
        The booked hold is a contract with everyone who accepted. If your
        agenda overruns it, you are spending time they allocated to something
        else. If your agenda is far under it, you trained them that this
        meeting will fill itself with leftovers. Either mismatch is a design
        bug, visible in coverage and duration before the start.
      </p>
      <p>
        Recurring meetings rot here. The hold stays sixty minutes after the
        work shrank to twenty, or the work grew and nobody changed the invite.
        Re-sum the blocks when the objectives change. Export a new pre-read and
        a new .ics when the duration changes. The artifacts should match the
        meeting you intend to run this week, not the one you ran in March.
      </p>

      <GuideH2>Cost is a duration check in disguise</GuideH2>
      <p>
        Once you know how long the meeting is, the next honest question is who
        needs to be there for that whole time. A ninety-minute Plan with a
        dozen people is a different object from a twenty-minute Decide with
        three. Blackhatter can estimate cost from headcount and rate so “we
        always invite the whole team” has a number next to it. You do not need
        a finance model to use the instinct: more minutes times more people is
        more expensive, and most Inform does not need the expensive version.
      </p>
      <p>
        Cut length or cut the list. Both are legitimate. What is not legitimate
        is a hold that cannot cover the agenda you wrote. Pressure-test duration
        the same way you pressure-test objectives: on the page, before anyone
        sits down, while you can still change the design.
      </p>
    </GuideLayout>
  );
}
