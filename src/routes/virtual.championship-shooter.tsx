import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Crosshair, Trophy } from "lucide-react";

export const Route = createFileRoute("/virtual/championship-shooter")({
  head: () => ({ meta: [{ title: "Championship Shooter | Lomita Shooters League" }, { name: "description", content: "Championship shooters arena in Lomita Shooters League." }] }),
  component: ShootersPage,
});

function ShootersPage() {
  return <Layout>
    <section className="container min-h-[65vh] py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-emerald-950/70 via-card to-amber-950/30 p-7 shadow-xl sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary"><Crosshair className="h-4 w-4" /> LSL Virtual Arena</div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Championship Shooter</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Championship shooters arena. This dedicated game mode is being prepared. Live matches, odds and gameplay are not available yet.</p>
          <div className="mt-8 rounded-2xl border border-primary/20 bg-background/60 p-6"><Trophy className="mb-3 h-8 w-8 text-primary" /><h2 className="text-xl font-bold">Arena coming soon</h2><p className="mt-2 text-sm text-muted-foreground">Check back when this game mode is launched. No bets or tokens can be placed here yet.</p></div>
          <Link to="/virtual" className="mt-6 inline-flex items-center rounded-xl border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-bold text-primary hover:bg-primary/20">Explore Virtual Gang League</Link>
        </div>
      </div>
    </section>
  </Layout>;
}
