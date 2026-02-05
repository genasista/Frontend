"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@/core/http/client";
import { cfg } from "@/core/config";
import styles from "./StatusCard.module.css";

type Props = {
  title: string;
  path: string;
  connector: string | null;
  refreshMs?: number;
};

type State = {
  ts?: Date;
  json?: unknown;
  raw?: string;
  status?: number;
  err?: string | null;
  sentConnector?: string | null;
  respCorrelationId?: string | null;
};

export default function StatusCard({ title, path, connector, refreshMs = 5000 }: Props) {
  const [state, setState] = useState<State>({});
  const requestKey = useMemo(() => `${path}|${connector ?? "all"}`, [path, connector]);

  const load = useCallback(async () => {
    const res = await apiFetch(path, { connector });
    setState({
      ts: new Date(),
      json: res.data,
      raw: res.rawText,
      status: res.status,
      err: res.ok ? null : `HTTP ${res.status}`,
      sentConnector: connector,
      respCorrelationId: res.headers.get("x-correlation-id"),
    });
  }, [path, connector]);

  useEffect(() => {
    let id: number | null = null;

    const start = () => {
      if (refreshMs > 0 && document.visibilityState === "visible") {
        id = window.setInterval(load, refreshMs) as unknown as number;
      }
    };
    const stop = () => {
      if (id !== null) {
        window.clearInterval(id);
        id = null;
      }
    };

    load();
    start();

    const onVis = () => {
      stop();
      if (document.visibilityState === "visible") {
        load();
        start();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [requestKey, refreshMs, load]);

  const badgeClass =
    connector ? `${styles.badge} ${styles.badgeConnector}` : `${styles.badge} ${styles.badgeAll}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={badgeClass}>
          {connector ? `x-connector: ${connector}` : "all connectors"}
        </span>
        <span className={styles.time}>{state.ts ? state.ts.toLocaleTimeString() : "…"}</span>
      </div>

      <div className={styles.meta}>
        <div>
          path: <code>{path}</code>
        </div>
        {cfg.dataMode && (
          <div>
            x-data-mode: <code>{cfg.dataMode}</code>
          </div>
        )}
        {state.respCorrelationId && (
          <div>
            resp corr-id: <code>{state.respCorrelationId}</code>
          </div>
        )}
        {state.status !== undefined && (
          <div>
            status: <code>{state.status}</code>
          </div>
        )}
      </div>

      <pre className={styles.code}>{state.raw ?? ""}</pre>

      {state.err && <div className={styles.error}>{state.err}</div>}
    </div>
  );
}