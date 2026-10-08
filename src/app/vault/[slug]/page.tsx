import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { hasVaultAccess } from "@/lib/vault";
import { buildLearningPath } from "@/lib/learning";
import { parseTestCases } from "@/lib/validation";
import { LessonClient } from "@/components/lesson/lesson-client";
import type { PublicTestCase } from "@/lib/lesson-types";

export async function generateMetadata(
  props: PageProps<"/vault/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    select: { title: true, chapter: { select: { isSecret: true } } },
  });
  if (!lesson || !lesson.chapter.isSecret) return { title: "Vault — C-PAGE" };
  return { title: `${lesson.title} — Vault — C-PAGE` };
}

export default async function VaultLessonPage(
  props: PageProps<"/vault/[slug]">
) {
  const { slug } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/vault/${slug}`);

  if (!(await hasVaultAccess(user.id))) {
    redirect("/vault");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: { chapter: true },
  });
  if (!lesson || !lesson.chapter.isSecret) notFound();

  const path = await buildLearningPath(user.id, { secretOnly: true });

  const ordered = path.chapters.flatMap((chapter) => chapter.lessons);
  const index = ordered.findIndex((l) => l.id === lesson.id);
  const node = index >= 0 ? ordered[index] : null;

  if (node?.locked) {
    redirect("/vault");
  }

  const nextNode = index >= 0 ? ordered[index + 1] ?? null : null;

  const progress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  const testCases = parseTestCases(lesson.testCases);
  const publicTests: PublicTestCase[] = testCases.map((test) => ({
    name: test.name,
    hidden: test.hidden,
  }));

  return (
    <LessonClient
      lesson={{
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        guideContent: lesson.guideContent,
        exampleCode: lesson.exampleCode,
        exampleOutput: lesson.exampleOutput,
        starterCode: lesson.starterCode,
        solutionCode: lesson.solutionCode,
        hints: lesson.hints,
        xpReward: lesson.xpReward,
        chapterTitle: lesson.chapter.title,
        chapterIcon: lesson.chapter.icon,
      }}
      publicTests={publicTests}
      initialCode={progress?.code ?? lesson.starterCode}
      initialHints={progress?.hintsUsed ?? 0}
      completed={progress?.completed ?? false}
      nextSlug={nextNode?.slug ?? null}
      basePath="/vault"
    />
  );
}
