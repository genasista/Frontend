"use client";

import * as React from "react";
import SandboxBanner from "@/components/sandboxBanner/SandboxBanner";
import StatusCard from "@/components/statusCard/StatusCard";
import { cfg } from "@/core/config";
import dynamic from "next/dynamic";

// Din befintliga css-modul
import styles from "@/app/control-center/control-center.module.css";

// Ladda ConnectionsPanel client-side för att undvika hydration-mismatch
const ConnectionsPanel = dynamic(
  () => import("@/modules/connections/components/ConnectionsPanel"),
  { ssr: false, loading: () => <div className="rounded-md border p-4">Loading…</div> }
);

// Samma CONNECTORS/carts som din nuvarande sida använder:
const CONNECTORS = ["(all)", "gateway", "core", "db", "queue"] as const;
const CARDS = [
  { title: "Gateway", path: "/status/gateway" },
  { title: "Core",    path: "/status/core"    },
  { title: "DB",      path: "/status/db"      },
  { title: "Queue",   path: "/status/queue"   },
];

export default function ControlCenterView() {
  const [connector, setConnector] = React.useState<string>("(all)");
  const grafanaHref = cfg.grafanaUrl && cfg.grafanaUrl.length > 0 ? cfg.grafanaUrl : null;

  return (
    <>
      <SandboxBanner />
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <h1 className={styles.title}>
            Control Center {connector !== "(all)" && `– ${connector}`}
          </h1>

          {!!grafanaHref && (
            <a
              href={grafanaHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open Grafana dashboard"
              className={styles.grafanaBtn}
            >
              Open Grafana
            </a>
          )}

          <label className={styles.selectLabel}>
            <span className={styles.selectHelp}>Connector</span>
            <select
              value={connector}
              onChange={(e) => setConnector(e.target.value)}
              className={styles.select}
              aria-label="Choose connector"
            >
              {CONNECTORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.grid}>
          {CARDS.map((c) => (
            <StatusCard
              key={c.title}
              title={c.title}
              path={c.path}
              connector={connector === "(all)" ? null : connector}
              refreshMs={cfg.statusPollMs}
            />
          ))}
        </div>

        {/* Nytt: Connections under grid:en */}
        <div style={{ marginTop: "2rem" }}>
          <ConnectionsPanel />
        </div>
      </div>
    </>
  );
}
