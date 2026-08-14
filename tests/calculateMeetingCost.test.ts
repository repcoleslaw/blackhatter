import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateMeetingCost,
  formatUsd,
} from "../src/features/analytics/calculateMeetingCost.ts";
import type { Participant } from "../src/types/meeting.ts";

function participant(
  patch: Partial<Participant> & Pick<Participant, "id" | "company" | "rate">,
): Participant {
  return {
    role: "",
    order: 0,
    ...patch,
  };
}

describe("calculateMeetingCost", () => {
  it("returns zero when there are no participants", () => {
    const cost = calculateMeetingCost([], 60);
    assert.equal(cost.total, 0);
    assert.equal(cost.participantCount, 0);
    assert.deepEqual(cost.byCompany, []);
  });

  it("multiplies hourly rates by agenda duration", () => {
    const cost = calculateMeetingCost(
      [
        participant({ id: "1", company: "my company", rate: 100 }),
        participant({ id: "2", company: "Acme", rate: 200 }),
      ],
      30,
    );
    assert.equal(cost.total, 150);
    assert.equal(cost.byCompany[0]?.company, "Acme");
    assert.equal(cost.byCompany[0]?.cost, 100);
    assert.equal(cost.byCompany[1]?.company, "my company");
    assert.equal(cost.byCompany[1]?.cost, 50);
  });

  it("groups people from the same company", () => {
    const cost = calculateMeetingCost(
      [
        participant({ id: "1", company: "my company", rate: 100 }),
        participant({ id: "2", company: "my company", rate: 100 }),
      ],
      60,
    );
    assert.equal(cost.byCompany.length, 1);
    assert.equal(cost.byCompany[0]?.participantCount, 2);
    assert.equal(cost.byCompany[0]?.cost, 200);
  });
});

describe("formatUsd", () => {
  it("formats USD with cents", () => {
    assert.equal(formatUsd(150), "$150.00");
  });
});
