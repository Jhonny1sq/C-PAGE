"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UnlockForm() {
  const router = useRouter();
  const [key, setKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/vault/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setLoading(false);
      setError(data.error ?? "That passphrase didn't work.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-3xl">
        <Lock className="h-7 w-7 text-purple-300" />
      </span>
      <h1 className="mt-5 text-2xl font-black text-slate-50">The Vault</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
        Advanced C++ for people who read memory like a book: pointers at full
        depth, struct layouts, bit flags, pattern scanning, and aim math. This
        wing is locked — enter the passphrase.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
        Built for your own games and single-player mods. Take it online and the
        ban hammer finds you first.
      </p>

      <form onSubmit={onSubmit} className="mx-auto mt-6 max-w-sm space-y-3">
        <Input
          type="password"
          autoComplete="off"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Passphrase"
          aria-label="Vault passphrase"
        />
        {error ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading || !key}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Unlock the vault
        </Button>
      </form>
    </div>
  );
}
