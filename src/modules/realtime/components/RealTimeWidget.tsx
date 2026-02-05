"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRecent, buildStreamUrl } from "../api";
import type { RealtimeEvent } from "../types";

const MAX_N = 5;

function getField(obj: unknown, key: string): string | null {
  if (typeof obj !== "object" || obj === null) return null;
  const rec = obj as Record<string, unknown>;
  if (!(key in rec)) return null;
  const v = rec[key];
  if (v === null || v === undefined) return null;
  return String(v);
}

export default function RealtimeWidget() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const lastIdRef = useRef<string>("");

  const sseUrl = useMemo(() => {
    return buildStreamUrl(lastIdRef.current);
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;
    let cancelled = false;

    async function bootstrap() {
      setError(null);

      // Fetch backlog (recent 5)
      try {
        console.log("[RealtimeWidget] Fetching recent events...");
        const recent = await fetchRecent(MAX_N);
        console.log("[RealtimeWidget] Fetched", recent.length, "events");
        
        if (!cancelled) {
          if (recent.length > 0) {
            setEvents(recent);
            lastIdRef.current = recent[0].id;
          } else {
            console.log("[RealtimeWidget] No recent events found");
            // Set empty array explicitly so we know it loaded
            setEvents([]);
          }
          setInitialLoad(false);
        }
      } catch (err: unknown) {
        console.error("[RealtimeWidget] Error fetching recent:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setInitialLoad(false);
        }
      }

      if (cancelled) return;

      // Open SSE connection
      try {
        console.log("[RealtimeWidget] Opening SSE connection to:", sseUrl);
        es = new EventSource(sseUrl, { withCredentials: false });
      } catch (err: unknown) {
        console.error("[RealtimeWidget] Error creating EventSource:", err);
        setError(err instanceof Error ? err.message : String(err));
        return;
      }

      es.onopen = () => {
        console.log("[RealtimeWidget] SSE connected");
        setConnected(true);
        setError(null);
      };

      es.onerror = () => {
        console.log("[RealtimeWidget] SSE error/disconnected");
        setConnected(false);
        setError("Disconnected — retrying…");
      };

      es.onmessage = (msg) => {
        console.log("[RealtimeWidget] Received SSE message:", msg.data);
        try {
          const evt = JSON.parse(msg.data) as RealtimeEvent;
          if (!evt || typeof evt !== "object" || !evt.id) {
            console.warn("[RealtimeWidget] Invalid event format:", evt);
            return;
          }
          lastIdRef.current = evt.id;
          setEvents((prev) => {
            const dedup = new Map(prev.map((e) => [e.id, e]));
            dedup.set(evt.id, evt);
            const arr = Array.from(dedup.values())
              .sort((a, b) => (a.ts < b.ts ? 1 : -1))
              .slice(0, MAX_N);
            return arr;
          });
        } catch (err) {
          console.error("[RealtimeWidget] Error parsing SSE message:", err);
        }
      };
    }

    bootstrap();

    return () => {
      cancelled = true;
      if (es) es.close();
    };
  }, [sseUrl]);

  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">Realtime — Submissions (last {MAX_N})</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {connected ? "live" : "offline"}
        </span>
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {initialLoad && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!initialLoad && (
        <ul className="divide-y">
          {events.length === 0 ? (
            <li className="p-4 text-sm text-gray-500">
              <div className="text-center">
                <p className="font-medium">No recent events.</p>
                <p className="text-xs mt-1">Events will appear here when submissions are created.</p>
                <p className="text-xs mt-1 text-gray-400">Note: Events are in-memory only (cleared on server restart).</p>
              </div>
            </li>
          ) : (
            events.map((e) => {
              const submissionId = getField(e.data, "submissionId");
              const schoolId = getField(e.data, "schoolId");
              const assignmentId = getField(e.data, "assignmentId");
              const studentId = getField(e.data, "studentId");
              
              return (
                <li key={e.id} className="px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-blue-600">{e.type}</div>
                    <time className="text-xs text-gray-500">
                      {isNaN(Date.parse(e.ts)) ? e.ts : new Date(e.ts).toLocaleString()}
                    </time>
                  </div>

                  <div className="mt-1 text-xs text-gray-600">
                    correlationId: <code className="font-mono bg-gray-100 px-1 rounded">{e.correlationId || "-"}</code>
                  </div>

                  {submissionId && (
                    <div className="mt-0.5 text-xs text-gray-600">
                      submissionId: <code className="font-mono bg-gray-100 px-1 rounded">{submissionId}</code>
                    </div>
                  )}

                  {assignmentId && (
                    <div className="mt-0.5 text-xs text-gray-600">
                      assignmentId: <code className="font-mono bg-gray-100 px-1 rounded">{assignmentId}</code>
                    </div>
                  )}

                  {studentId && (
                    <div className="mt-0.5 text-xs text-gray-600">
                      studentId: <code className="font-mono bg-gray-100 px-1 rounded">{studentId}</code>
                    </div>
                  )}

                  {schoolId && (
                    <div className="mt-0.5 text-xs text-gray-600">
                      schoolId: <code className="font-mono bg-gray-100 px-1 rounded">{schoolId}</code>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}