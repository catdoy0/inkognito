"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { checkEmailTaken } from "@/api/auth-api";
import { signInWithGoogle, signUp } from "@/reduxStore/authSlice";
import { useAppDispatch } from "@/reduxStore/hooks";

import CommonInput from "@/components/widgets/CommonInput";
import GoogleSignInButton from "./GoogleSignInButton";
import { validateConfirmPassword, validateEmail, validatePassword } from "./validation";

function getErrorMessage(cause: unknown, fallback: string) {
  if (typeof cause === "string") return cause;
  return cause instanceof Error ? cause.message : fallback;
}

export default function SignUpFormSection() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  async function checkEmail() {
    const validationError = validateEmail(email);
    setEmailError(validationError);
    if (validationError) return;

    if (await checkEmailTaken(email.trim())) {
      setEmailError("This email is already registered.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = validateConfirmPassword(password, confirmPassword);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);
    if (nextEmailError || nextPasswordError || nextConfirmPasswordError) return;

    setSubmitting(true);
    try {
      if (await checkEmailTaken(email.trim())) {
        setEmailError("This email is already registered.");
        return;
      }
      const session = await dispatch(signUp({
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      })).unwrap();
      if (session.user.role !== "GUEST") router.replace("/dashboard");
    } catch (cause) {
      setError(getErrorMessage(cause, "Unable to create your account. Please try again."));
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
      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Get started</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Create your account</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Create an account to upload and manage your print jobs.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <CommonInput
          id="signup-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError("");
          }}
          onBlur={() => void checkEmail()}
          error={emailError}
        />
        <CommonInput
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError("");
          }}
          onBlur={() => setPasswordError(validatePassword(password))}
          error={passwordError}
        />
        <CommonInput
          id="signup-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password again"
          required
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setConfirmPasswordError("");
          }}
          onBlur={() => setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))}
          error={confirmPasswordError}
        />

        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="h-11 w-full gap-2 rounded-lg bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800">
          {submitting ? "Creating account…" : <>Create account <ArrowRight size={16} /></>}
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
            intent="signup"
          />
        </>
      )}

      <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
