import { apiFetch } from "@/core/http/client";

export type AuditRow = {
  id: string;
  actor_sub: string | null;
  actor_roles: string[] | null;
  action: string;
  resource: string;
  resource_id: string | null;
  reason: string | null;
  correlation_id: string | null;
  path: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export async function fetchAudit(params: {
  user?: string;
  action?: string;
  resource?: string;
  correlationId?: string;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params.user) qs.set("user", params.user);
  if (params.action) qs.set("action", params.action);
  if (params.resource) qs.set("resource", params.resource);
  if (params.correlationId) qs.set("correlationId", params.correlationId);
  if (params.limit) qs.set("limit", String(params.limit));

  const res = await apiFetch<{ items: AuditRow[] }>(`/audit?${qs.toString()}`, { method: "GET" });
  if (!res.ok || !res.data) throw new Error((res.data as Record<string, unknown>)?.message ? String((res.data as Record<string, unknown>).message) : `HTTP ${res.status}`);
  return res.data.items;
}