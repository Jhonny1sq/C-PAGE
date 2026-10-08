import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { hasVaultAccess, vaultEnabled } from "@/lib/vault";
import { buildLearningPath } from "@/lib/learning";
import { SkillTree } from "@/components/learning/skill-tree";
import { UnlockForm } from "@/components/vault/unlock-form";

export const metadata: Metadata = { title: "The Vault — C-PAGE" };

export default async function VaultPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/vault");

  if (!vaultEnabled()) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-slate-50">The Vault</h1>
        <p className="mt-2 text-sm text-slate-400">
          The vault is disabled on this server. Set a SECRET_KEY to open it.
        </p>
      </div>
    );
  }

  const unlocked = await hasVaultAccess(user.id);
  if (!unlocked) {
    return <UnlockForm />;
  }

  const path = await buildLearningPath(user.id, { secretOnly: true });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
          🔓 Unlocked
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-50 sm:text-3xl">
          The Vault
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Advanced track: memory, offsets, flags, scanning, and aim math. Same
          rules — real compiler, real tests.
        </p>
      </div>

      <SkillTree
        path={path}
        dueReviewIds={path.stats.dueReviewLessonIds}
        basePath="/vault"
      />
    </div>
  );
}
