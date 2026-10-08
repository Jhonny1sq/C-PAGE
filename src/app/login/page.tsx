import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in — C-PAGE" };

export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;
  const nextParam = typeof params.next === "string" ? params.next : "/learn";
  const nextPath = nextParam.startsWith("/") ? nextParam : "/learn";
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep your streak alive."
      footer={
        <span>
          {githubEnabled
            ? "Email, password, or GitHub — your call."
            : "Email and password login."}
        </span>
      }
    >
      <LoginForm githubEnabled={githubEnabled} nextPath={nextPath} />
    </AuthShell>
  );
}