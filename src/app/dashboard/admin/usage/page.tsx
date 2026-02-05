"use client";

import UsageClient from "./UsageClient";
// If your @ alias isn't active for this route, use the relative path instead:
// import UsageClient from "../../../../components/usage/UsageClient";

export default function AdminUsagePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Control Center — Usage</h1>
      <UsageClient />
    </div>
  );
}
