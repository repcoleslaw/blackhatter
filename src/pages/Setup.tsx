export function SetupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-paper px-6">
      <div className="max-w-lg rounded-xl border border-line bg-card p-8">
        <p className="text-xs font-medium tracking-[0.28em] text-ember uppercase">
          Blackhatter
        </p>
        <h1 className="mt-4 font-serif text-3xl">Firebase is not configured</h1>
        <p className="mt-3 text-muted">
          Copy <code className="rounded bg-paper px-1.5 py-0.5 text-sm">.env.example</code>{" "}
          to <code className="rounded bg-paper px-1.5 py-0.5 text-sm">.env</code>, paste
          your Firebase web config, then restart the dev server.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Create a Firebase project</li>
          <li>Enable Email/Password and Google sign-in</li>
          <li>Create a Firestore database and enable Storage</li>
          <li>Deploy the rules in this repo when you are ready</li>
        </ol>
      </div>
    </div>
  );
}
