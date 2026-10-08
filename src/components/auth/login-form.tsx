"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function LoginForm({
  githubEnabled,
  nextPath,
}: {
  githubEnabled: boolean;
  nextPath: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("That email and password don't match.");
      toast({ title: "Sign-in failed", variant: "error" });
      return;
    }

    toast({ title: "Welcome back", variant: "success" });
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-slate-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-300"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Log in
        </Button>
      </form>

      {githubEnabled ? (
        <>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-800" />
            OR
            <span className="h-px flex-1 bg-slate-800" />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: nextPath })}
          >
            <GithubIcon className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </>
      ) : null}

      <p className="text-center text-sm text-slate-400">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-emerald-400 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}