import type { Metadata } from "next";

import SignUpFormSection from "../_components/SignUpFormSection";

export const metadata: Metadata = {
  title: "Sign up | Inkognito",
};

export default function SignUpPage() {
  return <SignUpFormSection />;
}
