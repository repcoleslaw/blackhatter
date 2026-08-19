export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "What is Blackhatter?",
    a: "A workspace for designing a meeting against preset objectives, checking whether the agenda covers them, and exporting a PDF pre-read plus a calendar .ics. It is meeting-quality software, not a security product.",
  },
  {
    q: "Who is it for?",
    a: "Anyone who owns the quality of a meeting before it starts: facilitators, leads, and people who are tired of sending a calendar hold with no plan attached.",
  },
  {
    q: "Is Blackhatter a security or hacking tool?",
    a: "No. Despite the name, Blackhatter is a meeting agenda builder. You pressure-test objectives, coverage, and duration, then export a pre-read and a calendar hold. It is not a penetration-testing, hacking, or security product.",
  },
  {
    q: "How do objectives work?",
    a: "You pick from a preset list (Decide, Align, Inform, Ideate, Status, Review, Problem-solve, Plan). Analytics show which of those the agenda blocks actually serve.",
  },
  {
    q: "What can I export?",
    a: "A PDF pre-read of the meeting and an .ics with the title, description, and total duration.",
  },
  {
    q: "Is it free?",
    a: "Yes during early access. Pricing will be posted here if that changes.",
  },
  {
    q: "Where is my data?",
    a: "Accounts and meetings live in your Blackhatter profile, stored with Firebase Authentication and Cloud Firestore. You sign in with email/password or Google.",
  },
  {
    q: "How do I start?",
    a: "Create an account, add a meeting, pick objectives, and build the agenda. The first useful output is a pre-read you can send before the hold.",
  },
];
