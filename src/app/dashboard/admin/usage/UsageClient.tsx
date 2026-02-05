"use client";

import UsageGraph, { type School } from "@/components/usage/UsageGraph";

function toISO(d: Date) { return d.toISOString().slice(0, 10); }
function sameDayPrevMonthRange() {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  const from = new Date(y, m - 1, d);
  return { from: toISO(from), to: toISO(today) };
}

type Props = {
  schools?: School[];
  topK?: number;
  minRequestsForOwnLine?: number;
  showUnknownInAll?: boolean;
};

export default function UsageClient({
  schools = [
    { id: "school_1", name: "School 1" },
    { id: "school_2", name: "School 2" },
    { id: "school_3", name: "School 3" },
  ],
  topK = 6,
  minRequestsForOwnLine = 5,
  showUnknownInAll = true,
}: Props) {
  const { from, to } = sameDayPrevMonthRange();

  return (
    <UsageGraph
      schools={schools}
      initialFrom={from}
      initialTo={to}
      topK={topK}
      minRequestsForOwnLine={minRequestsForOwnLine}
      showUnknownInAll={showUnknownInAll}
    />
  );
}




// import { UsageGraph } from '@/components/usage/UsageGraph';

// export default function ControlCenterPage() {
//   const schools = [
//     { id: 'school_1', name: 'School 1' },
//     { id: 'school_2', name: 'School 2' },
//     { id: 'school_3', name: 'School 3' },
//   ];

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Control Center</h1>
//       <UsageGraph schools={schools} />
//     </div>
//   );
// }

// ________________________________________________

// // src/app/dashboard/admin/usage/UsageClient.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/core/http/client";
// import { UsageGraph } from "@/components/usage/UsageGraph";

// type School = { id: string; name: string };

// export default function UsageClient() {
//   const [schools, setSchools] = useState<School[]>([
//     { id: "school_1", name: "School 1" },
//     { id: "school_2", name: "School 2" },
//   ]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       try {
//         // If your schools are exposed via /connections (adjust mapping to your shape)
//         const res = await apiFetch<{ items?: any[] }>("/connections");
//         if (mounted && res.ok && Array.isArray(res.data?.items)) {
//           const map = new Map<string, School>();
//           for (const c of res.data!.items!) {
//             const id = c?.schoolId ?? c?.school_id ?? c?.school?.id ?? null;
//             const name = c?.schoolName ?? c?.school_name ?? c?.school?.name ?? id;
//             if (id) map.set(String(id), { id: String(id), name: String(name) });
//           }
//           if (map.size > 0) setSchools(Array.from(map.values()));
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   return (
//     <div className="space-y-4">
//       <UsageGraph schools={schools} />
//       {loading && <p className="text-sm text-gray-500">Loading schools…</p>}
//     </div>
//   );
// }
