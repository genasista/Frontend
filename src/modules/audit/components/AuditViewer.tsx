"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAudit, type AuditRow } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function badgeClass(a: string) {
  switch (a.toLowerCase()) {
    case "read":   return "audit-badge audit-badge--read";
    case "create": return "audit-badge audit-badge--create";
    case "update": return "audit-badge audit-badge--update";
    case "delete": return "audit-badge audit-badge--delete";
    default:       return "audit-badge";
  }
}

// Map action -> badge styling for quick visual parsing
function actionVariant(a: string): "default" | "secondary" | "destructive" | "outline" {
  const k = a.toLowerCase();
  if (k === "delete") return "secondary";
  if (k === "create" || k === "update") return "default";
  if (k === "read") return "secondary";
  return "outline";
}

export default function AuditViewer() {
  const [user, setUser] = useState("");
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("connections");
  const [correlationId, setCorrelationId] = useState("");
  const [items, setItems] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsJson, setDetailsJson] = useState<Record<string, unknown> | null>(null);

  async function load() {
    setLoading(true);
    try {
      const rows = await fetchAudit({
        user: user || undefined,
        action: action || undefined,
        resource: resource || undefined,
        correlationId: correlationId || undefined,
        limit: 100,
      });
      setItems(rows);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Audit fetch failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial auto-load
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onLinkCorrelation(id: string | null) {
    if (!id) return;
    setCorrelationId(id);
    // run with the updated state
    setTimeout(load, 0);
  }

  // CSV export of the currently visible table
  const csvReady = useMemo(() => items.length > 0, [items.length]);
  function exportCsv() {
    if (!items.length) return;

    const rows = items.map((i) => ({
      id: i.id,
      created_at: i.created_at,
      actor_sub: i.actor_sub ?? "",
      actor_roles: (i.actor_roles ?? []).join(";"),
      action: i.action,
      resource: i.resource,
      resource_id: i.resource_id ?? "",
      reason: i.reason ?? "",
      correlation_id: i.correlation_id ?? "",
      path: i.path ?? "",
    }));

    const headers = Object.keys(rows[0] ?? { id: "", created_at: "" });
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => JSON.stringify((r as Record<string, string>)[h] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Audit Log</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={!csvReady}>
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUser("");
              setAction("");
              setResource("connections");
              setCorrelationId("");
              setItems([]);
              setTimeout(load, 0);
            }}
          >
            Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-5">
          <Input
            placeholder="user (sub)"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <Input
            placeholder="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <Input
            placeholder="resource"
            value={resource}
            onChange={(e) => setResource(e.target.value)}
          />
          <Input
            placeholder="correlationId"
            value={correlationId}
            onChange={(e) => setCorrelationId(e.target.value)}
          />
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Search"}
          </Button>
        </div>

        {items.length === 0 && !loading && (
          <div className="text-muted-foreground text-sm">
            No audit records yet. Try relaxing filters.
          </div>
        )}

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Who</th>
                  <th className="py-2 pr-4">What</th>
                  <th className="py-2 pr-4">Resource</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Correlation</th>
                  <th className="py-2 pr-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">
                      {new Date(r.created_at).toLocaleString()}
                    </td>

                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <span>{r.actor_sub ?? "—"}</span>
                        {r.actor_roles?.length ? (
                          <Badge variant="outline">{r.actor_roles.join(",")}</Badge>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-2 pr-4">
                      <Badge variant={actionVariant(r.action)}>{r.action}</Badge>
                    </td>

                    <td className="py-2 pr-4">
                      {/* Using Badge for consistent shape; colors forced by our utility class */}
                      <Badge className={badgeClass(r.action)} variant="outline">
                        {r.action}
                      </Badge>
                    </td>

                    <td className="py-2 pr-4">{r.reason ?? "—"}</td>

                    <td className="py-2 pr-4">
                      {r.correlation_id ? (
                        <button
                          className="underline text-blue-600"
                          onClick={() => onLinkCorrelation(r.correlation_id!)}
                          title="Filter by this correlationId"
                        >
                          {r.correlation_id}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-2 pr-4">
                      {r.details ? (
                        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDetailsJson(r.details);
                                setDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </DialogTrigger>

                          {/* Use your vars directly (not bg-card/text-card-foreground) */}
                          <DialogContent className="max-w-2xl border border-border shadow-lg bg-[var(--card)] text-[var(--card-foreground)]">
                            <DialogHeader>
                              <DialogTitle>Details (JSON)</DialogTitle>
                            </DialogHeader>

                            <div className="rounded-md border border-border max-h-[70vh] overflow-auto bg-[var(--input-background)]">
                              <pre className="m-0 p-4 text-sm leading-5 font-mono whitespace-pre-wrap break-words text-[var(--foreground)]">
                                {JSON.stringify(detailsJson ?? {}, null, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}