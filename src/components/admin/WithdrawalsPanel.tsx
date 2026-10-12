import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function WithdrawalsPanel() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setList(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-wd")
      .on("postgres_changes", { event: "*", schema: "public", table: "withdrawal_requests" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  async function updateStatus(id: string, status: "approved" | "declined", admin_note?: string) {
    const { error } = await supabase
      .from("withdrawal_requests")
      .update({ status, admin_note: admin_note ?? null })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Withdrawal updated");
      load();
    }
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading withdrawals…</div>;

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        {list.length} total withdrawal request{list.length !== 1 ? "s" : ""}
      </div>
      {list.map((r) => (
        <Card key={r.id} className="glass p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="font-bold">{r.amount.toLocaleString()} tokens</div>
              <div className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString()} · {r.ingame_name} · {r.gang_name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {r.status === "approved" && <CheckCircle className="h-5 w-5 text-accent" />}
              {r.status === "declined" && <XCircle className="h-5 w-5 text-destructive" />}
              {r.status === "pending" && <Clock className="h-5 w-5 text-muted-foreground" />}
              <Badge variant="outline" className="capitalize">
                {r.status}
              </Badge>
            </div>
          </div>
          {r.admin_note && (
            <div className="text-xs text-muted-foreground italic">Admin note: {r.admin_note}</div>
          )}
          {r.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="btn-luxury flex-1"
                onClick={() => updateStatus(r.id, "approved")}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  const note = prompt("Decline reason?");
                  if (note !== null) updateStatus(r.id, "declined", note);
                }}
              >
                Decline
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
