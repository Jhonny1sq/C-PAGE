import Link from "next/link";
import {
  Flame,
  Gem,
  GitBranch,
  Sparkles,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STEPS = [
  {
    icon: Terminal,
    title: "1. Read the guide",
    description:
      "A short, focused explanation with highlighted C++ snippets. No walls of text.",
  },
  {
    icon: Sparkles,
    title: "2. Run the example",
    description:
      "See real output from a compiled example before you touch the keyboard.",
  },
  {
    icon: Zap,
    title: "3. Write real code",
    description:
      "A Monaco editor, a Run button, and test cases validated by a real C++ compiler.",
  },
];

const FEATURES = [
  {
    icon: GitBranch,
    title: "A skill tree that unlocks",
    description:
      "Variables to Templates. Each node opens only after the last one falls.",
  },
  {
    icon: Flame,
    title: "Streaks that bite",
    description: "Practice daily or the chain breaks. No participation trophies.",
  },
  {
    icon: Gem,
    title: "XP, gems, and hearts",
    description: "Fewer hints means more XP. Three mistakes and you retry.",
  },
  {
    icon: Trophy,
    title: "Weekly leaderboard",
    description: "See where you stack up against everyone else this week.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
      <section className="flex flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" /> Gamified C++ learning
        </span>
        <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-50 sm:text-6xl">
          Learn C++ the way games teach you to keep playing.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
          Short lessons, a real compiler behind every challenge, XP for clean
          solves, and a streak that keeps you honest. No setup. No ceremony.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <Button asChild size="lg">
              <Link href="/learn">Continue learning</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/signup">Start from zero</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <Link href={user ? "/dashboard" : "/login"}>
              {user ? "Your dashboard" : "I already have an account"}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.title} className="text-left">
            <CardHeader>
              <step.icon className="h-6 w-6 text-emerald-400" />
              <CardTitle className="mt-3">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-center text-2xl font-black text-slate-100 sm:text-3xl">
          Everything you need to actually get good
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-5">
                <feature.icon className="h-7 w-7 text-emerald-400" />
                <h3 className="mt-3 font-bold text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-black text-slate-50 sm:text-3xl">
          The compiler is waiting.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Nine chapters, dozens of challenges, and a dashboard that tells you
          exactly which topics are your weakest. Ship your first lesson in under
          five minutes.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href={user ? "/learn" : "/signup"}>
            {user ? "Pick up where you left off" : "Create your account"}
          </Link>
        </Button>
      </section>
    </div>
  );
}