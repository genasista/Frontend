"use client";
import styles from "./swagger.module.css";
import { cfg } from "@/core/config";

export default function SwaggerProxyPage() {
  return (
    <div className={styles.viewport}>
      <iframe title="Swagger UI" src={cfg.swaggerUiUrl} className={styles.frame} />
    </div>
  );
}