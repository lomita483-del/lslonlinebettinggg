import { Link } from "@tanstack/react-router";
import { ArrowRight, Crosshair, Trophy, Zap } from "lucide-react";

const games = [
  { title: "Instant Shooters", description: "Fast-paced shootout action.", to: "/virtual/instant-shooters", Icon: Zap, tone: "from-emerald-500/20 via-emerald-900/10 to-transparent" },
  { title: "Championship Shooter", description: "A championship-style shooters arena.", to: "/virtual/championship-shooter", Icon: Trophy, tone: "from-amber-400/20 via-amber-900/10 to-transparent" },
] as const;

export function ShootersGameEntry() {
  return <section aria-label="Shooters virtual games" className="container py-5">
    <div className="mb-3 flex items-center gap-2"><Crosshair className="h-5 w-5 text-primary" /><h2 className="text-lg font-black tracking-wide">SHOOTERS VIRTUAL GAMES</h2></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {games.map(({ title, description, to, Icon, tone }) => <Link key={to} to={to} className={`group relative flex min-h-36 items-center gap-4 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br ${tone} bg-card/80 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-primary/70 focus-visible:outline-2 focus-visible:outline-primary`}>
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-primary/30 bg-background/70"><Icon className="h-7 w-7 text-primary" /></span>
        <span className="min-w-0 flex-1"><strong className="block text-lg font-black">{title}</strong><span className="mt-1 block text-sm text-muted-foreground">{description}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">Open arena <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></span>
      </Link>)}
    </div>
  </section>;
}
