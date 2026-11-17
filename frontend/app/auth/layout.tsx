"use client";

import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AuthShell from "./_components/AuthShell";
import RedirectSignedInUser from "./_components/RedirectSignedInUser";
import SignInLeftPanel from "./_components/SignInLeftPanel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const layout = (
    <main className="flex min-h-screen">
      <SignInLeftPanel />
      <AuthShell>
        <RedirectSignedInUser>{children}</RedirectSignedInUser>
      </AuthShell>
    </main>
  );

  return clientId
    ? <GoogleOAuthProvider clientId={clientId}>{layout}</GoogleOAuthProvider>
    : layout;
}
