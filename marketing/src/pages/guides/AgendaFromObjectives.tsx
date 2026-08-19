import { Link } from "react-router-dom";
import { GuideH2, GuideLayout } from "../../components/GuideLayout";

export function AgendaFromObjectivesPage() {
  return (
    <GuideLayout
      kicker="Guide"
      title="How to build a meeting agenda from objectives"
      lede="A calendar title is not a plan. Name what the meeting must achieve, then write agenda blocks that can actually get you there."
    >
      <p>
        Most holds go out as a title and a hope. The agenda, if it exists, is
        written after people have already accepted. Objectives stay implicit:
        someone wanted a decision, someone else wanted a status dump, and the
        room discovers the mismatch in minute twelve. Building a{" "}
        <strong className="font-medium text-ink">meeting agenda from
        objectives</strong> reverses that. You say what success looks like, then
        you refuse to put a block on the page that does not serve those aims.
      </p>
      <p>
        Blackhatter is built for that loop. It is a meeting agenda builder, not a
        security tool. You pick preset objectives, assemble duration blocks, and
        check coverage before anyone sits down.
      </p>

      <GuideH2>Start with aims, not topics</GuideH2>
      <p>
        Topics describe what you might talk about. Objectives describe what must
        be true when people stand up. “Q3 roadmap” is a topic. “Decide the two
        bets we will staff this quarter” is an objective. The second one tells
        you whether the meeting worked.
      </p>
      <p>
        Use a short, preset list so the room shares a vocabulary. Blackhatter
        ships with Decide, Align, Inform, Ideate, Status, Review, Problem-solve,
        and Plan. You do not need all eight. Two or three honest aims beat a
        kitchen-sink agenda. If you cannot pick from that list, you may not need
        a meeting — you may need a document.
      </p>
      <p>
        Write each objective as a sentence the owner would defend. “Align on
        scope” is still mushy. “Align on what is in and out of the v1 cut, in
        writing” can be checked. If an objective cannot be checked, it will not
        survive contact with a talkative room.
      </p>

      <GuideH2>Map every block to an objective</GuideH2>
      <p>
        Once the aims are named, build the agenda as timed blocks: a label, a
        duration, and a reason it exists. A block that cannot point at an
        objective is decoration. Cut it, or change the objectives if you
        discover a real aim you forgot to write down.
      </p>
      <p>
        Coverage is the test. If you claimed Decide and Align but every block is
        a round-robin status, the meeting will not decide or align. It will
        inform, late, at high cost. Checking coverage before you send the hold
        is cheaper than discovering the gap in the room.
      </p>
      <p>
        Sequence matters as much as inclusion. Inform and Status usually belong
        early, in small doses, so Decide and Problem-solve have facts to work
        with. Ideate before Decide if you have not generated options yet. Review
        after Plan if you are checking work already promised. Do not open with a
        thirty-minute brainstorm if the only objective is a binary decision that
        already has two options on paper.
      </p>

      <GuideH2>Give each aim enough minutes</GuideH2>
      <p>
        An objective without time is a slogan. Decide on a hiring bar in five
        minutes only if the packet was read and the options are already framed.
        Otherwise you are scheduling a performance of deciding. Put the minutes
        on the block, then add them up against the hold. If the agenda is
        forty-two minutes and the invite is thirty, you are already late.
      </p>
      <p>
        Resist the urge to “fit it all in.” Drop an objective, split the meeting,
        or move Inform into a{" "}
        <Link
          to="/guides/meeting-pre-read"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          pre-read
        </Link>
        . The calendar is not obligated to carry every anxiety you had on
        Monday.
      </p>
      <p>
        For a walkthrough of duration versus the booked hold, see{" "}
        <Link
          to="/guides/meeting-length"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          how long this meeting should be
        </Link>
        .
      </p>

      <GuideH2>A simple sequence you can reuse</GuideH2>
      <p>
        Name the meeting and the owner. Pick two or three objectives from the
        preset list. Draft blocks that cover those objectives, with durations
        that look realistic for this group. Check coverage: every objective has
        at least one block, and every block has an objective. Compare total
        duration to the hold. Export a pre-read so attendees see the plan, then
        put the matching hold on the calendar.
      </p>
      <p>
        That is the whole product loop: objectives first, coverage not vibes,
        then artifacts people can use. If you skip the first step, the rest is
        theatre. If you skip coverage, you will still be surprised in the room.
        If you skip the pre-read, you will spend the first ten minutes reading
        the agenda aloud.
      </p>
      <p>
        Facilitators and leads who own the quality of the hour should be able to
        defend every block. If you cannot, delete it before you send the invite.
        The meeting should earn the calendar hold — and the agenda is how you
        prove it in advance.
      </p>
    </GuideLayout>
  );
}
