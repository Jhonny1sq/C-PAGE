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
import { signupSchema } from "@/lib/validation";

export function SignupForm({ githubEnabled }: { githubEnabled: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setLoading(false);
      setError(data.error ?? "Could not create your account.");
      return;
    }

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      toast({
        title: "Account created",
        description: "Please log in.",
        variant: "info",
      });
      router.push("/login");
      return;
    }

    toast({
      title: "Account created",
      description: "Welcome to C-PAGE.",
      variant: "success",
    });
    router.push("/learn");
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
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="text-sm font-semibold text-slate-300"
          >
            Username
          </label>
          <Input
            id="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={update("username")}
            placeholder="coder_aldi"
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
            autoComplete="new-password"
            required
            value={form.password}
            onChange={update("password")}
            placeholder="At least 8 characters"
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create account
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
            onClick={() => signIn("github", { callbackUrl: "/learn" })}
          >
            <GithubIcon className="h-4 w-4" />
            Sign up with GitHub
          </Button>
        </>
      ) : null}

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}