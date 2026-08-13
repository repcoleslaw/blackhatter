import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { GuestRoute, ProtectedRoute } from "./features/auth/ProtectedRoute";
import { isFirebaseConfigured } from "./lib/firebase";
import { AgendaBuilderPage } from "./pages/AgendaBuilder";
import { DashboardPage } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { MeetingCreatePage } from "./pages/MeetingCreate";
import { ProfilePage } from "./pages/Profile";
import { SetupPage } from "./pages/Setup";
import { SignupPage } from "./pages/Signup";

export default function App() {
  if (!isFirebaseConfigured) {
    return <SetupPage />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/meetings/new" element={<MeetingCreatePage />} />
            <Route path="/meetings/:id" element={<AgendaBuilderPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
