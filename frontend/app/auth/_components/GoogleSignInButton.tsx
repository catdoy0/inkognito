"use client";

import { GoogleLogin } from "@react-oauth/google";

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
  isDark: boolean;
  intent: "signin" | "signup";
}

export default function GoogleSignInButton({
  onCredential,
  onError,
  disabled = false,
  isDark,
  intent,
}: GoogleSignInButtonProps) {
  return (
    <div className={`flex justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <GoogleLogin
        onSuccess={({ credential }) => {
          if (credential) onCredential(credential);
          else onError("Google sign-in failed. Please try again.");
        }}
        onError={() => onError("Google sign-in failed. Please try again.")}
        theme={isDark ? "filled_black" : "outline"}
        size="large"
        text={intent === "signup" ? "signup_with" : "signin_with"}
        shape="rectangular"
        width="360"
        use_fedcm_for_button
      />
    </div>
  );
}
