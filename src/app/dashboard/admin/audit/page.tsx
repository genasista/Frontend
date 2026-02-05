"use client";

import dynamic from "next/dynamic";

const AuditViewer = dynamic(
  () => import("@/modules/audit/components/AuditViewer"),
  { ssr: false, loading: () => <div className="rounded-md border p-4">Loading…</div> }
);

export default function AdminOverviewPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <AuditViewer />
    </main>
  );
}
