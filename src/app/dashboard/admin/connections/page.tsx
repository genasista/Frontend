"use client";

import dynamic from "next/dynamic";

const ConnectionsPanel = dynamic(
  () => import("@/modules/connections/components/ConnectionsPanel"),
  { ssr: false, loading: () => <div className="rounded-md border p-4">Loading…</div> }
);

export default function AdminConnectionsPage() {
  return (
    <main className="container mx-auto p-6">
      <ConnectionsPanel showDevAuthControls />
    </main>
  );
}
