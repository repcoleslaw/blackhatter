import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { authErrorMessage } from "../features/auth/authErrors";
import {
  AuthFooter,
  AuthForm,
  AuthLayout,
  GoogleButton,
} from "../features/auth/AuthForm";

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(email: string, password: string) {
    setPending(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Continue evaluating your meetings.">
      <GoogleButton onClick={() => void handleGoogle()} disabled={pending} />
      <div className="my-6 flex items-center gap-3 text-xs tracking-wide text-muted uppercase">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <AuthForm
        submitLabel="Sign in"
        error={error}
        pending={pending}
        onSubmit={(form) =>
          void handleSubmit(
            String(form.get("email") ?? ""),
            String(form.get("password") ?? ""),
          )
        }
        footer={
          <AuthFooter
            prompt="Need an account?"
            to="/signup"
            label="Create one"
          />
        }
      />
    </AuthLayout>
  );
}
