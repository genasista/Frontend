import { apiFetch } from "@/core/http/client";
import { getAuthToken } from "@/core/auth/token";
import { cfg } from "@/core/config";
import type { RealtimeRaw, RealtimeEvent } from "./types";

function normalize(raw: RealtimeRaw): RealtimeEvent | null {
  try {
    const id = String(raw["id"] ?? raw["event_id"] ?? raw["submission_id"] ?? raw["submissionId"] ?? "");
    if (!id) return null;
    const type = String(raw["type"] ?? raw["event_type"] ?? raw["event"] ?? "unknown");
    const tsRaw = raw["ts"] ?? raw["created_at"] ?? raw["createdAt"] ?? raw["timestamp"];
    let ts = "";
    if (typeof tsRaw === "string") ts = tsRaw;
    else if (typeof tsRaw === "number") ts = new Date(tsRaw).toISOString();
    else ts = new Date().toISOString();
    const correlationId = raw["correlationId"] ?? raw["correlation_id"] ?? raw["correlation"] ?? null;

    let payload: unknown = raw["data"] ?? raw["payload"] ?? null;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch { payload = { raw: payload }; }
    }

    return {
      id,
      type,
      ts,
      correlationId: correlationId ? String(correlationId) : null,
      data: (payload as Record<string, unknown> | null) ?? null,
    };
  } catch (e) {
    console.error("[realtime] normalize error:", e, "raw:", raw);
    return null;
  }
}

/** Fetch recent events from backend */
export async function fetchRecent(limit = 5): Promise<RealtimeEvent[]> {
  try {
    const res = await apiFetch<{ items: RealtimeRaw[] }>(`/realtime/recent?limit=${limit}`, {
      method: "GET",
      authToken: getAuthToken(),
    });

    console.log("[fetchRecent] Response:", {
      ok: res.ok,
      status: res.status,
      data: res.data,
    });

    // ADD THIS: Show the exact structure
    console.log("[fetchRecent] typeof res.data:", typeof res.data);
    console.log("[fetchRecent] res.data keys:", res.data ? Object.keys(res.data) : 'null');
    
    if (!res.ok) {
      // Safe error message extraction
      let errorMsg = `HTTP ${res.status}`;
      if (res.data && typeof res.data === 'object' && 'message' in res.data) {
        errorMsg = String(res.data.message);
      } else if (res.rawText) {
        errorMsg = res.rawText;
      }
      throw new Error(errorMsg);
    }

    // Handle different response structures
    let rawEvents: RealtimeRaw[] = [];

    if (res.data) {
      // Case 1: { items: [...] }
      if (typeof res.data === 'object' && 'items' in res.data && Array.isArray(res.data.items)) {
        rawEvents = res.data.items as RealtimeRaw[];
      }
      // Case 2: Direct array response
      else if (Array.isArray(res.data)) {
        rawEvents = res.data;
      }
      // Case 3: Wrapped in data property
      else if (typeof res.data === 'object' && 'data' in res.data && Array.isArray(res.data.data)) {
        rawEvents = res.data.data as RealtimeRaw[];
      }
      // Case 4: Single object (wrap in array)
      else if (typeof res.data === 'object' && res.data !== null) {
        // Check if it looks like a single event
        if ('id' in res.data || 'type' in res.data) {
          rawEvents = [res.data as RealtimeRaw];
        }
      }
    }

    console.log("[fetchRecent] Parsed events count:", rawEvents.length);

    if (!Array.isArray(rawEvents)) {
      console.error("[fetchRecent] rawEvents is not an array:", rawEvents);
      return [];
    }

    const normalized = rawEvents
      .map((r) => normalize(r))
      .filter((x): x is RealtimeEvent => x !== null);

    console.log("[fetchRecent] Normalized events count:", normalized.length);

    return normalized;
  } catch (err: unknown) {
    console.error("[fetchRecent] Error:", err);
    throw err;
  }
}

/** Build SSE URL for frontend to connect to */
export function buildStreamUrl(lastEventId?: string): string {
  // Use cfg.apiBaseUrl if present; otherwise fall back to origin
  const base = (cfg.apiBaseUrl || "").replace(/\/+$/, "");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const root = base || origin || "http://localhost:3001";
  const u = new URL("/realtime/stream", root);
  if (cfg.apiKey) u.searchParams.set("key", cfg.apiKey);
  const token = getAuthToken();
  if (token) u.searchParams.set("token", token);
  if (lastEventId) u.searchParams.set("lastEventId", lastEventId);
  return u.toString();
}
