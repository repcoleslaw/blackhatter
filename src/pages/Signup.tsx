import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { authErrorMessage } from "../features/auth/authErrors";
import {
  AuthFooter,
  AuthForm,
  AuthLayout,
  GoogleButton,
} from "../features/auth/AuthForm";

export function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(email: string, password: string, displayName: string) {
    setPending(true);
    setError(null);
    try {
      await signUp(email, password, displayName);
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
    <AuthLayout
      title="Create an account"
      subtitle="Your meetings stay in your profile."
    >
      <GoogleButton onClick={() => void handleGoogle()} disabled={pending} />
      <div className="my-6 flex items-center gap-3 text-xs tracking-wide text-muted uppercase">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <AuthForm
        submitLabel="Create account"
        error={error}
        pending={pending}
        extraFields={
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Name</span>
            <input
              name="displayName"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-md border border-line bg-card px-3 py-2 outline-none ring-ember/30 focus:ring-2"
            />
          </label>
        }
        onSubmit={(form) =>
          void handleSubmit(
            String(form.get("email") ?? ""),
            String(form.get("password") ?? ""),
            String(form.get("displayName") ?? "").trim(),
          )
        }
        footer={
          <AuthFooter prompt="Already have an account?" to="/login" label="Sign in" />
        }
      />
    </AuthLayout>
  );
}
