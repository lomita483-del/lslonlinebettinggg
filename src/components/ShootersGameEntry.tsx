import { Link } from "@tanstack/react-router";
import { ArrowRight, Crosshair, Radio, Trophy, Users } from "lucide-react";

const arenas = [
  { to: "/virtual/instant-shooters", title: "Instant Shootouts", tag: "INSTANT VIRTUAL", description: "Fast gang vs gang shootouts. Choose your arena and enter the action.", icon: Crosshair, cta: "Enter arena", tone: "from-red-950/80 via-black/80 to-black/95", glow: "bg-red-500/20" },
  { to: "/virtual/championship-shooter", title: "Knockout Tournament", tag: "CHAMPIONSHIP VIRTUAL", description: "16 gangs. Four knockout rounds. Follow the tournament bracket and championship stages.", icon: Trophy, cta: "View bracket", tone: "from-amber-950/80 via-black/80 to-black/95", glow: "bg-amber-500/20" },
] as const;

export function ShootersGameEntry() {
  return <section aria-label="Shooters virtual arenas" className="container py-6 sm:py-8">
    <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2">
      {arenas.map(({ to, title, tag, description, icon: Icon, cta, tone, glow }) =>
        <Link key={to} to={to} className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br ${tone} p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] focus-visible:outline-2 focus-visible:outline-primary sm:min-h-[300px] sm:p-7`}>
          <div aria-hidden="true" className={`pointer-events-none absolute -right-14 -top-16 h-64 w-64 rounded-full blur-3xl ${glow}`} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_35%,rgba(255,215,100,0.2)_50%,transparent_65%)]" />
          <div className="relative flex items-start justify-between gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/40 bg-background/50 text-primary"><Icon className="h-7 w-7" /></span><span className="rounded-full border border-muted/40 bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Coming soon</span></div>
          <div className="relative mt-6 flex-1"><p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">{tag}</p><h2 className="font-display text-2xl font-black sm:text-3xl">{title}</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p></div>
          <div className="relative mt-6 flex items-center justify-between gap-3 text-xs"><span className="inline-flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" /> Waiting</span><span className="inline-flex items-center gap-2 font-bold text-primary">{cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div>
        </Link>
      )}
    </div>
  </section>;
}
