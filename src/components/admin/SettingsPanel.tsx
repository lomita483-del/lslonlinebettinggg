import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Settings2, ShieldAlert, UserPlus, GraduationCap, Coins, MessageCircle, Image as ImageIcon } from "lucide-react";
import { ImageSettingControl } from "@/components/admin/ImageSettingControl";

type Settings = Record<string, any>;

const DEFAULTS: Settings = {
  maintenance_mode: false,
  maintenance_message: "We are performing maintenance.",
  maintenance_image: null,
  closed_mode: false,
  closed_message: "The website is currently closed. Please check back later.",
  closed_image: null,
  allow_signups: true,
  signup_disabled_message: "We're not accepting new members at the moment, check back later or contact support",
  tutorials_enabled: true,
  tutorials_for_new_users: true,
  tutorials_for_new_signins: false,
  tutorials_for_visitors: false,
  min_stake: 1,
  max_payout: 1000000000,
  allow_rebet: true,
  platform_tagline: "",
  hero_subtitle: "",
  hero_title: "",
  contact_email: "",
  contact_phone: "",
  contact_whatsapp: "",
  contact_discord: "",
  site_bg_url: null,
  site_bg_fit: "cover",
  site_bg_position: "center",
  nav_bg_url: null,
  nav_bg_fit: "cover",
  nav_bg_position: "center",
  admin_hero_url: null,
  admin_hero_fit: "cover",
  admin_hero_position: "center right",
  matches_arena_image_url: null,
  matches_arena_image_fit: "cover",
  matches_arena_image_position: "center",
};

function Section({ title, description, icon: Icon, children }: { title: string; description?: string; icon: any; children: React.ReactNode }) {
  return <Card className="space-y-4 border-primary/20 bg-card/70 p-4 sm:p-5">
    <div className="flex items-start gap-3"><div className="rounded-lg border border-primary/25 bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary" /></div><div><h3 className="font-bold">{title}</h3>{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}</div></div>
    {children}
  </Card>;
}

function ToggleRow({ label, help, checked, onChange }: { label: string; help?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3"><div><div className="text-sm font-medium">{label}</div>{help && <p className="mt-1 text-xs text-muted-foreground">{help}</p>}</div><Switch checked={checked} onCheckedChange={onChange} /></div>;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await (supabase as any).from("app_settings").select("*").eq("id", 1).maybeSingle();
      if (!alive) return;
      if (error) { toast.error("Could not load settings: " + error.message); return; }
      setSettings({ ...DEFAULTS, ...(data ?? {}) });
    })();
    const channel = supabase.channel("admin-settings-panel")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "app_settings", filter: "id=eq.1" }, (payload: any) => {
        if (alive && !dirty) setSettings((prev) => ({ ...DEFAULTS, ...(prev ?? {}), ...(payload.new ?? {}) }));
      }).subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, [dirty]);

  const set = (key: string, value: any) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
    setDirty(true);
  };

  async function save() {
    if (!settings) return;
    setBusy(true);
    // Only update controls owned by this panel; never write the entire settings row.
    const keys = [
      "maintenance_mode", "maintenance_message", "maintenance_image",
      "closed_mode", "closed_message", "closed_image",
      "allow_signups", "signup_disabled_message",
      "tutorials_enabled", "tutorials_for_new_users", "tutorials_for_new_signins", "tutorials_for_visitors",
      "min_stake", "max_payout", "allow_rebet",
      "platform_tagline", "hero_subtitle", "hero_title",
      "contact_email", "contact_phone", "contact_whatsapp", "contact_discord",
      "site_bg_url", "site_bg_fit", "site_bg_position",
      "nav_bg_url", "nav_bg_fit", "nav_bg_position",
      "admin_hero_url", "admin_hero_fit", "admin_hero_position",
      "matches_arena_image_url", "matches_arena_image_fit", "matches_arena_image_position",
    ];
    const patch: Settings = {};
    for (const key of keys) if (key in settings) patch[key] = settings[key];
    const { error } = await (supabase as any).from("app_settings").update(patch).eq("id", 1);
    if (error) {
      setBusy(false);
      toast.error("Settings were not saved: " + error.message);
      return;
    }
    try {
      await supabase.rpc("admin_log_action", { _action: "settings_updated", _target_type: "app_settings", _target_id: "1", _metadata: { fields: Object.keys(patch) } } as any);
    } catch { /* Audit RPC may not exist in every deployment; settings save remains authoritative. */ }
    setBusy(false);
    setDirty(false);
    toast.success("Settings saved");
  }

  if (!settings) return <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Loading admin settings…</div>;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-card/70 p-4">
      <div className="flex items-center gap-3"><Settings2 className="h-5 w-5 text-primary" /><div><h2 className="font-bold">Website settings</h2><p className="text-xs text-muted-foreground">Availability, registration, tutorials, betting limits, contact details and appearance.</p></div></div>
      <Button onClick={save} disabled={busy || !dirty} className="gap-2"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save settings"}</Button>
    </div>

    <Section title="Maintenance mode" description="Temporarily block the public website while administrators retain access." icon={ShieldAlert}>
      <ToggleRow label="Enable maintenance mode" checked={!!settings.maintenance_mode} onChange={(v) => set("maintenance_mode", v)} />
      <Textarea value={settings.maintenance_message ?? ""} onChange={(e) => set("maintenance_message", e.target.value)} placeholder="Maintenance notice shown to visitors" />
      <ImageSettingControl label="Maintenance screen image" value={settings.maintenance_image} onChange={(v) => set("maintenance_image", v)} aspect="16 / 9" />
    </Section>

    <Section title="Website closed" description="A separate public-facing closure switch and message, independent from maintenance mode." icon={ShieldAlert}>
      <ToggleRow label="Close website to non-admin visitors" checked={!!settings.closed_mode} onChange={(v) => set("closed_mode", v)} />
      <Textarea value={settings.closed_message ?? ""} onChange={(e) => set("closed_message", e.target.value)} placeholder="Website closed notice" />
      <ImageSettingControl label="Website closed screen image" value={settings.closed_image} onChange={(v) => set("closed_image", v)} aspect="16 / 9" />
    </Section>

    <Section title="Registration and tutorials" description="Controls signup availability and the guided-tour audience." icon={UserPlus}>
      <ToggleRow label="Allow new sign-ups" checked={settings.allow_signups !== false} onChange={(v) => set("allow_signups", v)} />
      <Textarea value={settings.signup_disabled_message ?? DEFAULTS.signup_disabled_message} onChange={(e) => set("signup_disabled_message", e.target.value)} placeholder={DEFAULTS.signup_disabled_message} />
      <div className="border-t border-border/60 pt-3"><ToggleRow label="Enable tutorials" checked={settings.tutorials_enabled !== false} onChange={(v) => set("tutorials_enabled", v)} /></div>
      <ToggleRow label="Show tutorials for new users" checked={!!settings.tutorials_for_new_users} onChange={(v) => set("tutorials_for_new_users", v)} />
      <ToggleRow label="Show tutorials on new sign-ins" checked={!!settings.tutorials_for_new_signins} onChange={(v) => set("tutorials_for_new_signins", v)} />
      <ToggleRow label="Show tutorials to visitors" checked={!!settings.tutorials_for_visitors} onChange={(v) => set("tutorials_for_visitors", v)} />
    </Section>

    <Section title="Betting limits and re-bet" description="The real, virtual and seasonal bet placement flows consume these shared controls where supported." icon={Coins}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-muted-foreground">Minimum stake<input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" type="number" min="1" value={settings.min_stake ?? 1} onChange={(e) => set("min_stake", Math.max(1, Number(e.target.value) || 1))} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Maximum payout cap<input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" type="number" min="1" value={settings.max_payout ?? 1000000000} onChange={(e) => set("max_payout", Math.max(1, Number(e.target.value) || 1))} /></label>
      </div>
      <ToggleRow label="Allow re-bet after successful placement" help="Controls the shared allow_rebet setting used by the betting slip." checked={settings.allow_rebet !== false} onChange={(v) => set("allow_rebet", v)} />
    </Section>

    <Section title="Homepage copy and contact" description="Editable public-facing copy and support contact details." icon={MessageCircle}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-muted-foreground">Hero tagline<Input value={settings.platform_tagline ?? ""} onChange={(e) => set("platform_tagline", e.target.value)} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Home headline<Input value={settings.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Contact email<Input value={settings.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Contact phone<Input value={settings.contact_phone ?? ""} onChange={(e) => set("contact_phone", e.target.value)} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">WhatsApp contact<Input value={settings.contact_whatsapp ?? ""} onChange={(e) => set("contact_whatsapp", e.target.value)} /></label>
        <label className="space-y-1 text-xs text-muted-foreground">Discord support URL<Input value={settings.contact_discord ?? ""} onChange={(e) => set("contact_discord", e.target.value)} /></label>
      </div>
      <label className="block space-y-1 text-xs text-muted-foreground">Home sub-text<Textarea value={settings.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} /></label>
    </Section>

    <Section title="Backgrounds and appearance" description="Upload, paste a public image URL, preview, crop/fit, position, or remove each background." icon={ImageIcon}>
      <ImageSettingControl label="Site-wide background" value={settings.site_bg_url} onChange={(v) => set("site_bg_url", v)} fit={settings.site_bg_fit ?? "cover"} onFitChange={(v) => set("site_bg_fit", v)} position={settings.site_bg_position ?? "center"} onPositionChange={(v) => set("site_bg_position", v)} aspect="16 / 9" />
      <ImageSettingControl label="Top navigation background" value={settings.nav_bg_url} onChange={(v) => set("nav_bg_url", v)} fit={settings.nav_bg_fit ?? "cover"} onFitChange={(v) => set("nav_bg_fit", v)} position={settings.nav_bg_position ?? "center"} onPositionChange={(v) => set("nav_bg_position", v)} aspect="16 / 9" />
      <ImageSettingControl label="Admin welcome banner" value={settings.admin_hero_url} onChange={(v) => set("admin_hero_url", v)} fit={settings.admin_hero_fit ?? "cover"} onFitChange={(v) => set("admin_hero_fit", v)} position={settings.admin_hero_position ?? "center right"} onPositionChange={(v) => set("admin_hero_position", v)} aspect="16 / 5" />
      <ImageSettingControl label="League Arena background" value={settings.matches_arena_image_url} onChange={(v) => set("matches_arena_image_url", v)} fit={settings.matches_arena_image_fit ?? "cover"} onFitChange={(v) => set("matches_arena_image_fit", v)} position={settings.matches_arena_image_position ?? "center"} onPositionChange={(v) => set("matches_arena_image_position", v)} aspect="16 / 9" />
    </Section>

    <div className="flex justify-end"><Button onClick={save} disabled={busy || !dirty} className="gap-2"><Save className="h-4 w-4" />{busy ? "Saving…" : "Save settings"}</Button></div>
  </div>;
}
