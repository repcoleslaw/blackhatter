import { usePageTitle } from "../lib/usePageTitle";
import { PageIntro, PageWidth } from "../components/Page";

export function PrivacyPage() {
  usePageTitle("Privacy");

  return (
    <PageWidth>
      <PageIntro kicker="Privacy" title="Placeholder privacy notice.">
        <p>Last updated August 2026. This is not legal advice.</p>
      </PageIntro>
      <div className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Blackhatter is in early access. Account data (email, display name) and
          meeting data (titles, descriptions, agendas, objectives) are stored so
          you can sign in and keep work on your profile.
        </p>
        <p>
          Authentication and database hosting currently use Firebase
          (Authentication and Cloud Firestore). Sign-in is email/password or
          Google.
        </p>
        <p>
          We do not sell your meeting content. A full privacy policy will replace
          this page before any paid public launch. If you want data removed,
          delete meetings in the app or close the account by contacting the
          operator of this project.
        </p>
      </div>
    </PageWidth>
  );
}
