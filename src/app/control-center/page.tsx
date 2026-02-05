"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StatusCard from "@/components/statusCard/StatusCard";
import { cfg } from "@/core/config";
import styles from "./control-center.module.css";
import SandboxBanner from "@/components/sandboxBanner/SandboxBanner";
// import ConnectionsPanel from "@/modules/connections/components/ConnectionsPanel";

/** The four cards we want to show, in order. */
const KEYS = ["gateway", "core", "db", "queue"] as const;
type ServiceKey = typeof KEYS[number];

const TITLES: Record<ServiceKey, string> = {
  gateway: "Gateway",
  core: "Core",
  db: "DB",
  queue: "Queue",
};

const CONNECTORS = ["(all)", "google-classroom", "vklass", "unikum", "tink"];

const ConnectionsPanel = dynamic(
  () => import("@/modules/connections/components/ConnectionsPanel"),
  { ssr: false }
);

export default function ControlCenterPage() {
  const [connector, setConnector] = useState<string>("(all)");

  const grafanaHref = useMemo(() => {
    if (!cfg.grafanaUrl) return "";
    if (connector === "(all)") return cfg.grafanaUrl;
    const sep = cfg.grafanaUrl.includes("?") ? "&" : "?";
    return `${cfg.grafanaUrl}${sep}var-connector=${encodeURIComponent(connector)}`;
  }, [connector]);

  // Access status paths via a plain index signature to avoid TS widening issues.
  const pathFor = (k: ServiceKey) =>
    (cfg.statusPaths as Record<string, string>)[k] || "/health";

  const cards = useMemo(
    () =>
      KEYS.map((k) => ({
        title: TITLES[k],
        path: pathFor(k),
      })),
    [] // cfg/status paths are static at runtime; no need to re-create
  );


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
          {cards.map((c) => (
            <StatusCard
              key={c.title}
              title={c.title}
              path={c.path}
              connector={connector === "(all)" ? null : connector}
              refreshMs={cfg.statusPollMs}
            />
          ))}
        </div>

        {/* 👇 Add the connections panel *below* your existing grid */}
        <div style={{ marginTop: "2rem" }}>
          <ConnectionsPanel />
        </div>
      </div>
    </>
  );
}
//   return (
//     <>
//     <SandboxBanner />
//     <div className={styles.container}>
//         <div className={styles.toolbar}>
//             <h1 className={styles.title}>
//             Control Center {connector !== "(all)" && `– ${connector}`}
//             </h1>

//             {!!grafanaHref && (
//                 <a
//                 href={grafanaHref}
//                 target="_blank"
//                 rel="noreferrer noopener"
//                 aria-label="Open Grafana dashboard"
//                 className={styles.grafanaBtn}
//                 >
//                 Open Grafana
//             </a>
//             )}

//             <label className={styles.selectLabel}>
//             <span className={styles.selectHelp}>Connector</span>
//             <select
//                 value={connector}
//                 onChange={(e) => setConnector(e.target.value)}
//                 className={styles.select}
//                 aria-label="Choose connector"
//                 >
//                 {CONNECTORS.map((c) => (
//                     <option key={c} value={c}>
//                     {c}
//                 </option>
//                 ))}
//             </select>
//             </label>
//         </div>

//         <div className={styles.grid}>
//             {cards.map((c) => (
//                 <StatusCard
//                 key={c.title}
//                 title={c.title}
//                 path={c.path}
//                 connector={connector === "(all)" ? null : connector}
//                 refreshMs={cfg.statusPollMs}
//                 />
//             ))}
//         </div>
//     </div>
//     </>
//   );
// }