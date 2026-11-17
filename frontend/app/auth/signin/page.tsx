import type { Metadata } from "next";

import SignInFormSection from "../_components/SignInFormSection";

export const metadata: Metadata = {
  title: "Sign in | Inkognito",
};

export default function SignInPage() {
  return <SignInFormSection />;
}
