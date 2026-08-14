import type { Participant } from "../../types/meeting";

export type CompanyCost = {
  company: string;
  participantCount: number;
  cost: number;
};

export type MeetingCost = {
  total: number;
  hours: number;
  durationMinutes: number;
  participantCount: number;
  byCompany: CompanyCost[];
};

const UNSPECIFIED_COMPANY = "Unspecified";

function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateMeetingCost(
  participants: Participant[],
  durationMinutesInput: number,
): MeetingCost {
  const durationMinutes = Math.max(0, Number(durationMinutesInput) || 0);
  const hours = durationMinutes / 60;
  const byCompanyMap = new Map<string, CompanyCost>();
  let total = 0;

  for (const participant of participants) {
    const cost = roundCents((Number(participant.rate) || 0) * hours);
    total = roundCents(total + cost);
    const company = participant.company.trim() || UNSPECIFIED_COMPANY;
    const previous = byCompanyMap.get(company);
    if (previous) {
      previous.participantCount += 1;
      previous.cost += cost;
    } else {
      byCompanyMap.set(company, {
        company,
        participantCount: 1,
        cost,
      });
    }
  }

  const byCompany = [...byCompanyMap.values()].sort(
    (a, b) => b.cost - a.cost || a.company.localeCompare(b.company),
  );

  return {
    total,
    hours,
    durationMinutes,
    participantCount: participants.length,
    byCompany,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
