import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/core/http/client";

export interface UsageDataPoint {
  day: string;
  school_id: string;
  requests: number;
}

export interface UsageResponse {
  items: UsageDataPoint[];
  from: string;
  to: string;
  schoolId: string | null;
}

type State = {
  data: UsageDataPoint[];
  loading: boolean;
  error: string | null;
  meta: { from: string; to: string; schoolId: string | null } | null;
};

export function useUsageData(schoolId?: string, from?: string, to?: string) {
  const [state, setState] = useState<State>({
    data: [],
    loading: true,
    error: null,
    meta: null,
  });

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (schoolId) p.set("schoolId", schoolId);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    const qs = p.toString();
    return qs ? `?${qs}` : "";
  }, [schoolId, from, to]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState(s => ({ ...s, loading: true, error: null }));

      const res = await apiFetch<UsageResponse>(`/usage/daily${queryString}`);

      if (cancelled) return;

      if (!res.ok) {
        // Extract error message safely
        let msg = `Failed to fetch usage data (${res.status})`;
        
        if (res.data && typeof res.data === 'object' && 'message' in res.data) {
          msg = String(res.data.message);
        } else if (res.rawText) {
          msg = res.rawText;
        }
        
        setState({ data: [], loading: false, error: msg, meta: null });
        return;
      }

      const json = res.data as UsageResponse | null;
      setState({
        data: json?.items ?? [],
        loading: false,
        error: null,
        meta: json ? { from: json.from, to: json.to, schoolId: json.schoolId } : null,
      });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  return state;
}