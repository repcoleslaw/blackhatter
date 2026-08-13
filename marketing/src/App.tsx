import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "./components/SiteShell";
import { AboutPage } from "./pages/About";
import { FaqPage } from "./pages/Faq";
import { HomePage } from "./pages/Home";
import { PricingPage } from "./pages/Pricing";
import { PrivacyPage } from "./pages/Privacy";
import { TermsPage } from "./pages/Terms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
