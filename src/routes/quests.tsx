import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ListChecks, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ChallengesPanel } from "@/components/ChallengesPanel";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Quests & Rewards — Lomita Shooters League" },
      { name: "description", content: "Track daily challenges, earn rewards, and build your shooting league profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuestsPage,
});

function QuestsPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-5">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 p-5 md:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-3 text-primary"><ListChecks className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Quests & Rewards</h1>
              <p className="mt-1 text-sm text-muted-foreground">Complete active challenges and claim the rewards available to your account.</p>
            </div>
          </div>
        </div>
        <ChallengesPanel />
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">More ways to progress</h2>
              <p className="text-sm text-muted-foreground">Check your assigned tasks for additional league rewards.</p>
            </div>
          </div>
          <Link to="/tasks" className="shrink-0 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">View tasks</Link>
        </Card>
      </div>
    </Layout>
  );
}
