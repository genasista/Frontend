"use client";

import { useEffect, useMemo, useState } from "react";
import { listConnections, createConnection, deleteConnection } from "../api";
import type { Connection } from "../types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { cfg } from "@/core/config";
import { currentRole, devMintToken, getAuthToken, clearDevAuth } from "@/core/auth/token";

function StatusChip({ enabled }: { enabled: boolean }) {
  return <Badge variant={enabled ? "default" : "secondary"}>{enabled ? "enabled" : "disabled"}</Badge>;
}

type Role = "admin" | "teacher";

interface Config {
  devAuth?: boolean;
}

export default function ConnectionsPanel({ showDevAuthControls = true }: { showDevAuthControls?: boolean }) {
  const [items, setItems] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);

  // auth state (derived from localStorage)
  const [role, setRole] = useState<Role | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const busy = useMemo(() => loading, [loading]);

  // Only show the dev auth UI in dev contexts
  const showDevAuth =
    !!showDevAuthControls &&
    ((cfg as Config).devAuth === true ||
      (typeof window !== "undefined" && location.hostname === "localhost"));

  async function load() {
    // avoid unauthorized fetch noise
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const rows = await listConnections();
      setItems(rows);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to load connections";
      setErr(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // init auth state on mount
    setRole(currentRole() as Role | null);
    setToken(getAuthToken());
    load();
  }, []);

  async function onCreate() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await createConnection({ name: name.trim(), enabled, config: {} });
      setName("");
      setEnabled(true);
      toast.success("Connection created");
      await load();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Create failed";
      toast.error(errorMessage);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteConnection(id);
      toast.success("Connection deleted");
      await load();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Delete failed";
      toast.error(errorMessage);
    }
  }

  async function signInAs(r: Role) {
    try {
      const t = await devMintToken(r);
      setRole(r);
      setToken(t);
      toast.success(`Signed in as ${r}`);
      await load();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Sign-in failed";
      toast.error(errorMessage);
    }
  }

  function signOut() {
    clearDevAuth();
    setRole(null);
    setToken(null);
    setItems([]);
    toast.success("Signed out");
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Connections</CardTitle>

        {/* Dev auth controls (only in dev / when enabled) */}
        <div className="flex items-center gap-2">
          {showDevAuth ? (
            !token ? (
              <>
                <span className="text-sm text-muted-foreground">Not signed in (dev)</span>
                <Button size="sm" onClick={() => signInAs("admin")}>Sign in as Admin</Button>
                <Button size="sm" variant="secondary" onClick={() => signInAs("teacher")}>Teacher</Button>
              </>
            ) : (
              <>
                <Badge variant="outline">{role ?? "unknown"}</Badge>
                <Button size="sm" variant="ghost" onClick={signOut}>Sign out</Button>
              </>
            )
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {/* Create form */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="GC Mock" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="enabled"
              type="checkbox"
              className="h-4 w-4"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <Label htmlFor="enabled">Enabled</Label>
          </div>
          <Button className="mt-2 sm:mt-6" onClick={onCreate} disabled={busy || !token}>
            Create
          </Button>
        </div>

        {!token && (
          <div className="text-amber-600 text-sm mb-2">
            Missing Bearer token — {showDevAuth ? "use the dev sign-in buttons above" : "sign in"}
          </div>
        )}

        {loading && <div>Loading…</div>}
        {err && !loading && <div className="text-red-600">{err}</div>}
        {!loading && token && items.length === 0 && <div className="text-muted-foreground">No connections yet.</div>}
        {!loading && token && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Last seen</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{c.name}</td>
                    <td className="py-2 pr-4"><StatusChip enabled={c.enabled} /></td>
                    <td className="py-2 pr-4">{c.lastSeen ? new Date(c.lastSeen).toLocaleString() : "—"}</td>
                    <td className="py-2 pr-4">
                      <Button size="sm" variant="ghost" onClick={() => onDelete(c.id)}>
                        Delete
                      </Button>
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