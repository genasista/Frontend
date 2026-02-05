import { apiFetch } from "@/core/http/client";
import { getAuthToken } from "@/core/auth/token";
import type { Connection, CreateConnectionDto } from "./types";

interface RawConnection {
  id: string;
  name: string;
  enabled: boolean;
  last_seen?: string | null;
  lastSeen?: string | null;
  config?: Record<string, unknown>;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

const normalize = (row: RawConnection): Connection => ({
  id: row.id,
  name: row.name,
  enabled: row.enabled,
  lastSeen: row.last_seen ?? row.lastSeen ?? null,
  config: row.config ?? {},
  createdAt: row.created_at ?? row.createdAt ?? "",
  updatedAt: row.updated_at ?? row.updatedAt ?? "",
});

// Helper function to extract error message safely
function getErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'message' in data) {
    return String(data.message);
  }
  return `HTTP ${status}`;
}

export async function listConnections(): Promise<Connection[]> {
  const res = await apiFetch<{ items: RawConnection[] }>("/connections", {
    method: "GET",
    authToken: getAuthToken(),
  });
  if (!res.ok) throw new Error(getErrorMessage(res.data, res.status));
  return (res.data?.items ?? []).map(normalize);
}

export async function createConnection(dto: CreateConnectionDto): Promise<Connection> {
  const res = await apiFetch<RawConnection>("/connections", {
    method: "POST",
    body: dto,
    authToken: getAuthToken(),
  });
  if (!res.ok) throw new Error(getErrorMessage(res.data, res.status));
  return normalize(res.data!);
}

export async function deleteConnection(id: string): Promise<{ ok: boolean }> {
  const res = await apiFetch<{ ok: boolean }>(`/connections/${id}`, {
    method: "DELETE",
    authToken: getAuthToken(),
  });
  if (!res.ok) throw new Error(getErrorMessage(res.data, res.status));
  return res.data!;
}