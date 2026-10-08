import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign up — C-PAGE" };

export default function SignupPage() {
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free, no credit card, and your progress saves automatically."
      footer={<span>Your code autosaves after every run.</span>}
    >
      <SignupForm githubEnabled={githubEnabled} />
    </AuthShell>
  );
}