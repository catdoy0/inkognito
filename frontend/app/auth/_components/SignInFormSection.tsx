"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { signIn, signInWithGoogle } from "@/reduxStore/authSlice";
import { useAppDispatch } from "@/reduxStore/hooks";

import CommonInput from "@/components/widgets/CommonInput";
import GoogleSignInButton from "./GoogleSignInButton";

function getErrorMessage(cause: unknown, fallback: string) {
  if (typeof cause === "string") return cause;
  return cause instanceof Error ? cause.message : fallback;
}

export default function SignInFormSection() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const session = await dispatch(signIn({ email: email.trim(), password })).unwrap();
      if (session.user.role !== "GUEST") router.replace("/dashboard");
    } catch (cause) {
      setError(getErrorMessage(cause, "Unable to sign in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleCredential(credential: string) {
    setError("");
    setSubmitting(true);
    try {
      const session = await dispatch(signInWithGoogle(credential)).unwrap();
      if (session.user.role !== "GUEST") router.replace("/dashboard");
    } catch (cause) {
      setError(getErrorMessage(cause, "Google sign-in failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Welcome back</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Sign in</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Sign in to manage your documents and print jobs.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <CommonInput
          id="signin-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
        />
        <CommonInput
          id="signin-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError("");
          }}
        />

        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="h-11 w-full gap-2 rounded-lg bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800">
          {submitting ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            onError={setError}
            disabled={submitting}
            isDark={isDark}
            intent="signin"
          />
        </>
      )}

      <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
