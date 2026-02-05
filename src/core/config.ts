export type DataMode = "sandbox" | "prod" | "";

/** Parse JSON from NEXT_PUBLIC_STATUS_PATHS if provided. */
function parseStatusPaths(): Record<string, string> {
  try {
    const raw = process.env.NEXT_PUBLIC_STATUS_PATHS;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Ensure exactly one trailing slash
function withTrailingSlash(u: string) {
  if (!u) return u;
  return u.endsWith("/") ? u : `${u}/`;
}

// --- Prefer explicit .env values; fall back to local dev ports ---
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

// If NEXT_PUBLIC_SWAGGER_UI_URL is set, use it as-is (normalized with trailing slash).
// Otherwise fall back to <apiBaseUrl>/docs/
const swaggerUiUrl = withTrailingSlash(
  process.env.NEXT_PUBLIC_SWAGGER_UI_URL || `${apiBaseUrl}/docs`
);

export const cfg = {
  apiBaseUrl,
  swaggerUiUrl,
  swaggerJsonUrl:
    process.env.NEXT_PUBLIC_SWAGGER_JSON_URL || `${apiBaseUrl}/openapi.json`,
  grafanaUrl: process.env.NEXT_PUBLIC_GRAFANA_URL || "",
  dataMode: (process.env.NEXT_PUBLIC_DATA_MODE || "").toLowerCase() as DataMode,
  statusPaths: {
    gateway: "/health",
    core: "/health",
    db: "/health",
    queue: "/health",
    ...parseStatusPaths(),
  },
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
  statusPollMs: Number(process.env.NEXT_PUBLIC_CC_POLL_MS ?? "5000"),

  devAuth: (process.env.NEXT_PUBLIC_DEV_AUTH ?? "").toLowerCase() === "true",
} as const;
