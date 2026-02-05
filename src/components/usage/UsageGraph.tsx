"use client";

import { useMemo, useState } from "react";
import { useUsageData } from "@/hooks/useUsageData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type School = { id: string; name: string };

type Props = {
  schools?: School[];
  initialFrom?: string; // YYYY-MM-DD
  initialTo?: string;   // YYYY-MM-DD
  /** Keep at most this many distinct school lines; others are aggregated */
  topK?: number;
  /** Minimum total requests to "earn" a line when in All-schools mode */
  minRequestsForOwnLine?: number;
  /** Include "unknown" inside Others (true) or give it its own line (false) */
  showUnknownInAll?: boolean;
};

const ALL = "";

function toISO(d: Date) { return d.toISOString().slice(0, 10); }
function parseISODate(s: string): Date {
  // Treat YYYY-MM-DD as UTC to avoid TZ drift
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function listDatesInclusive(from: string, to: string): string[] {
  const start = parseISODate(from);
  const end = parseISODate(to);
  const out: string[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    out.push(toISO(new Date(t)));
  }
  return out;
}

export default function UsageGraph({
  schools = [],
  initialFrom,
  initialTo,
  topK = 6,
  minRequestsForOwnLine = 5,
  showUnknownInAll = true,
}: Props) {
  // One-time initialization for date range
  const [dateRange, setDateRange] = useState(() => {
    const today = initialTo ?? toISO(new Date());
    const from = initialFrom ?? toISO(new Date(Date.now() - 30 * 24 * 3600 * 1000));
    return { from, to: today };
  });

  // One-time init for selected school: All by default
  const [selectedSchool, setSelectedSchool] = useState<string>(ALL);

  const { data, loading, error } = useUsageData(
    selectedSchool || undefined,
    dateRange.from,
    dateRange.to
  );

  // Build **all** dates in the selected range (so 0-days appear)
  const allDates = useMemo(
    () => listDatesInclusive(dateRange.from, dateRange.to),
    [dateRange.from, dateRange.to]
  );

  // Sum totals by school across the returned window
  const totalsBySchool = useMemo(() => {
    const t = new Map<string, number>();
    for (const r of data) {
      t.set(r.school_id, (t.get(r.school_id) ?? 0) + r.requests);
    }
    return t;
  }, [data]);

  // Pick top-K schools (except unknown if folding into Others)
  const topSchools = useMemo(() => {
    if (selectedSchool) return new Set<string>([selectedSchool]);

    const entries = Array.from(totalsBySchool.entries())
      .filter(([id]) => !(showUnknownInAll && id === "unknown"))
      .sort((a, b) => b[1] - a[1]);

    const picked: string[] = [];
    for (const [id, total] of entries) {
      if (picked.length >= topK) break;
      if (total >= minRequestsForOwnLine) picked.push(id);
    }
    return new Set<string>(picked);
  }, [selectedSchool, totalsBySchool, topK, minRequestsForOwnLine, showUnknownInAll]);

  // Build chart rows from the full date range; then fill series
  const chartData = useMemo(() => {
    // Preseed rows with just the date
    const rows = allDates.map(d => ({ date: d } as Record<string, number | string>));

    // Quick index lookup
    const idxByDate = new Map<string, number>();
    allDates.forEach((d, i) => idxByDate.set(d, i));

    // Accumulate per series
    for (const r of data) {
      const i = idxByDate.get(r.day);
      if (i == null) continue;

      const school = r.school_id;

      if (selectedSchool) {
        // Single-school mode: plot ONLY the selected school
        if (school === selectedSchool) {
          rows[i][school] = (rows[i][school] as number | undefined ?? 0) + r.requests;
        }
      } else {
        // All-schools mode: top lines + Others (optionally folding unknown)
        if (school === "unknown" && showUnknownInAll) {
          rows[i]["Others"] = (rows[i]["Others"] as number | undefined ?? 0) + r.requests;
        } else if (topSchools.has(school)) {
          rows[i][school] = (rows[i][school] as number | undefined ?? 0) + r.requests;
        } else {
          rows[i]["Others"] = (rows[i]["Others"] as number | undefined ?? 0) + r.requests;
        }
      }
    }

    // Decide final series list
    const seriesKeys = new Set<string>();
    if (selectedSchool) {
      seriesKeys.add(selectedSchool);
      // (No Others in single-school view)
    } else {
      for (const k of topSchools) seriesKeys.add(k);
      // Add Others if it exists
      const hasOthers = rows.some(r => typeof r["Others"] === "number");
      if (hasOthers) seriesKeys.add("Others");
    }

    // Zero-fill missing dates for each series (for clean lines)
    const keys = Array.from(seriesKeys);
    for (const r of rows) {
      for (const k of keys) {
        if (typeof r[k] !== "number") r[k] = 0;
      }
    }

    return { rows, series: keys };
  }, [allDates, data, selectedSchool, topSchools, showUnknownInAll]);

  // Friendly labels (id → name)
  const labelFor = (id: string) => {
    if (id === "Others") return "Others";
    if (id === "unknown") return "Unknown";
    const found = schools.find(s => s.id === id);
    return found?.name ?? id;
  };

  // Colors
  const palette = [
    "#2563eb", "#16a34a", "#ef4444", "#a855f7", "#f59e0b",
    "#06b6d4", "#dc2626", "#7c3aed", "#1d4ed8", "#059669"
  ];
  const lineColor = (i: number) => palette[i % palette.length];

  return (
    <div className="w-full space-y-4 p-6 bg-white rounded-lg shadow">
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">API Usage Overview</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* School Filter (All + listed) */}
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-3 py-2 border rounded-md"
            aria-label="School filter"
          >
            <option value={ALL}>All schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="px-3 py-2 border rounded-md"
            aria-label="From date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="px-3 py-2 border rounded-md"
            aria-label="To date"
          />
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && chartData.rows.length === 0 && (
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p className="text-lg font-medium">No usage data</p>
          <p className="text-sm">Adjust the filters or generate demo traffic.</p>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && chartData.rows.length > 0 && (
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData.rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(v: string | number | (string | number)[], name: string) => [v, labelFor(name)]} />
            <Legend formatter={(v: string) => <span className="text-sm">{labelFor(v)}</span>} />

            {chartData.series.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={labelFor(key)}
                stroke={lineColor(idx)}
                strokeWidth={2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Summary */}
      {!loading && !error && chartData.rows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold">
              {chartData.rows.reduce((sum, r) =>
                sum + chartData.series.reduce((s, k) => s + (r[k] as number ?? 0), 0), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average / Day</p>
            <p className="text-2xl font-bold">
              {Math.round(
                chartData.rows.reduce((sum, r) =>
                  sum + chartData.series.reduce((s, k) => s + (r[k] as number ?? 0), 0), 0
                ) / chartData.rows.length
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Series</p>
            <p className="text-2xl font-bold">{chartData.series.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}