import { cfg } from "@/core/config";
import { getAuthToken } from "@/core/auth/token";

function newCorrelationId() {
  return `${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

export type FetchResult<T = unknown> = {
  ok: boolean;
  status: number;
  headers: Headers;
  data: T | null;
  rawText: string;
};

export type ApiInit = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  connector?: string | null;
  authToken?: string | null; // optional override
};

function safeParseJson<T>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

export async function apiFetch<T = unknown>(path: string, init: ApiInit = {}): Promise<FetchResult<T>> {
  const normalizedUrl = path.startsWith("http")
    ? path
    : `${cfg.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = { ...(init.headers || {}) };

  // Inject standard headers
  if (cfg.apiKey && !headers["X-Api-Key"]) headers["X-Api-Key"] = cfg.apiKey;
  if (cfg.dataMode) headers["x-data-mode"] = cfg.dataMode;
  if (!headers["x-correlation-id"]) headers["x-correlation-id"] = newCorrelationId();
  if (init.connector) headers["x-connector"] = init.connector;

  // Attach Bearer automatically unless explicitly overridden
  const resolvedToken = init.authToken ?? getAuthToken();
  if (resolvedToken && !headers["authorization"]) {
    headers["authorization"] = `Bearer ${resolvedToken}`;
  }

  // Serialize JSON by default unless string/FormData
  let body: BodyInit | undefined;
  if (init.body == null) {
    body = undefined;
  } else if (typeof init.body === "string" || init.body instanceof FormData) {
    body = init.body as BodyInit;
  } else {
    headers["content-type"] = headers["content-type"] || "application/json";
    body = JSON.stringify(init.body);
  }

  if (process.env.NODE_ENV !== "production" && !cfg.apiBaseUrl) {
    console.warn("[apiFetch] NEXT_PUBLIC_API_BASE_URL is empty – calls will hit the Next server (8081).");
  }

  try {
    const res = await fetch(normalizedUrl, {
      method: init.method || "GET",
      headers,
      body,
      cache: "no-store",
    });

    const rawText = await res.text();
    const json = safeParseJson<T>(rawText);

    return { ok: res.ok, status: res.status, headers: res.headers, data: json, rawText };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, headers: new Headers(), data: null, rawText: msg };
  }
}