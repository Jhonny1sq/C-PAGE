import Link from "next/link";
import { Flame, Gem, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/sign-out-button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link href={user ? "/learn" : "/"} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-black text-slate-950">
            C+
          </span>
          <span className="text-lg font-black tracking-tight text-slate-50">
            C-PAGE
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1.5 text-sm font-semibold sm:flex">
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="h-4 w-4" /> {user.streak}
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <Zap className="h-4 w-4" /> {user.xp}
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <Gem className="h-4 w-4" /> {user.gems}
              </span>
            </div>
            <Link href="/profile" aria-label="Profile">
              <Avatar
                src={user.avatarUrl}
                alt={user.username}
                fallback={user.username}
                className="h-9 w-9"
              />
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_3px_0_0_#047857] transition-colors hover:bg-emerald-400"
            >
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}