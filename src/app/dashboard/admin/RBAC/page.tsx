"use client";

import dynamic from "next/dynamic";

// RBAC demo (client-only)
const RoleAwareDemo = dynamic(
  () => import("@/modules/admin/components/RoleAwareDemo"),
  { ssr: false, loading: () => <div className="rounded-md border p-4">Loading…</div> }
);


export default function AdminOverviewPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <RoleAwareDemo />

    </main>
  );
}
