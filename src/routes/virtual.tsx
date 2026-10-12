import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { ShootersGameEntry } from "@/components/ShootersGameEntry";

export const Route = createFileRoute("/virtual")({
  head: () => ({ meta: [
    { title: "Virtual Arenas — Instant Shootouts & Championship | LSL" },
    { name: "description", content: "Choose between Instant Shooters and Championship Shooter virtual arenas at Lomita Shooters League." },
  ] }),
  component: VirtualHubPage,
});

function VirtualHubPage() {
  return <Layout><PageShell tone="default">
    <div className="mx-auto max-w-6xl py-8 sm:py-12">
      <header className="mx-auto max-w-2xl px-4 text-center">
        <Badge variant="outline" className="mb-3 border-primary/40 bg-primary/10 text-[10px] uppercase tracking-[0.3em] text-primary">LSL Virtual Arenas</Badge>
        <h1 className="font-display text-4xl font-black leading-tight gradient-gold-text sm:text-5xl">Pick your battlefield</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">Two virtual formats. Same adrenaline. Choose the arena that fits your mood.</p>
      </header>
      <ShootersGameEntry />
      <div className="mt-2 text-center"><Link to="/virtual/history" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:text-primary"><History className="h-3.5 w-3.5" /> Rounds history</Link></div>
    </div>
  </PageShell></Layout>;
}
