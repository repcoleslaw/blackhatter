import { Route, Routes } from "react-router-dom";
import { Analytics } from "./components/Analytics";
import { SeoHead } from "./components/SeoHead";
import { SiteShell } from "./components/SiteShell";
import { AboutPage } from "./pages/About";
import { FaqPage } from "./pages/Faq";
import { GuideIndexPage } from "./pages/guides/Index";
import { AgendaFromObjectivesPage } from "./pages/guides/AgendaFromObjectives";
import { MeetingLengthPage } from "./pages/guides/MeetingLength";
import { MeetingPreReadPage } from "./pages/guides/MeetingPreRead";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { PricingPage } from "./pages/Pricing";
import { PrivacyPage } from "./pages/Privacy";
import { TermsPage } from "./pages/Terms";

export function AppRoutes() {
  return (
    <>
      <SeoHead />
      <Analytics />
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/guides" element={<GuideIndexPage />} />
          <Route
            path="/guides/meeting-agenda-from-objectives"
            element={<AgendaFromObjectivesPage />}
          />
          <Route
            path="/guides/meeting-pre-read"
            element={<MeetingPreReadPage />}
          />
          <Route
            path="/guides/meeting-length"
            element={<MeetingLengthPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
