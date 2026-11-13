"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {
    error: null,
  });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5">
      <p className="voice-label">/admin</p>
      <h1 className="voice-display mt-3 text-4xl text-fg">
        Who goes there<span className="text-accent">?</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The shelf is managed here. Sign in with the admin password to edit,
        upload covers, and publish.
      </p>

      <form action={action} className="mt-8">
        <label htmlFor="password" className="voice-label block">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className="mt-3 w-full border-b border-line bg-transparent py-2.5 font-mono text-sm text-fg focus:border-line-strong focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full bg-fg py-2.5 font-mono text-[13px] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "checking…" : "unlock the dashboard"}
        </button>
        {state.error && (
          <p role="alert" className="mt-4 font-mono text-xs text-accent-ink dark:text-accent">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
