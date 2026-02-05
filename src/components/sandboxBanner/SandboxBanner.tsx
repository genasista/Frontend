"use client";
import { cfg } from "@/core/config";
import styles from "./SandboxBanner.module.css";

export default function SandboxBanner() {
  if (cfg.dataMode !== "sandbox") return null;
  return <div className={styles.banner}>SANDBOX – dummydata</div>;
}