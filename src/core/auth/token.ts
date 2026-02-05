import { apiFetch } from "@/core/http/client";

export type AccessLevel = "municipality" | "school" | "teacher";

const AUTH_TOKEN_KEY  = "auth_token";
const AUTH_CLAIMS_KEY = "auth_claims";

// Legacy keys (kept for full backward-compat)
const ADMIN_KEY  = "admin_token";
const TEACHER_KEY = "teacher_token";

export type DevClaims = {
  sub: string;
  roles?: string[];
  level?: AccessLevel;
  orgId?: string | null;
  schoolId?: string | null;
};

// --- helpers ---------------------------------------------------------------

function isLevel(v: unknown): v is AccessLevel {
  return v === "municipality" || v === "school" || v === "teacher";
}

function decodeJwtClaims(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** On first read, copy legacy tokens to new scheme so claims are available. */
function migrateLegacyTokensIfNeeded() {
  if (typeof window === "undefined") return;
  const hasNew = !!localStorage.getItem(AUTH_TOKEN_KEY);
  if (hasNew) return;

  const legacy = localStorage.getItem(ADMIN_KEY) || localStorage.getItem(TEACHER_KEY);
  if (!legacy) return;

  localStorage.setItem(AUTH_TOKEN_KEY, legacy);
  const claims = decodeJwtClaims(legacy);
  if (claims) {
    localStorage.setItem(
      AUTH_CLAIMS_KEY,
      JSON.stringify({
        sub: claims.sub,
        roles: claims.roles,
        level: claims.level,
        orgId: claims.orgId ?? null,
        schoolId: claims.schoolId ?? null,
      } as DevClaims)
    );
  }
  // NOTE: we intentionally DO NOT remove legacy keys to keep old code paths alive.
}

// --- public API (backwards-compatible) -------------------------------------

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  migrateLegacyTokensIfNeeded();
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(ADMIN_KEY) ||
    localStorage.getItem(TEACHER_KEY) ||
    null
  );
}

export function getClaims(): DevClaims | null {
  if (typeof window === "undefined") return null;
  migrateLegacyTokensIfNeeded();
  const raw = localStorage.getItem(AUTH_CLAIMS_KEY);
  if (raw) {
    try { return JSON.parse(raw) as DevClaims; } catch { /* ignore */ }
  }
  // fallback: decode from token if claims were never stored
  const t = getAuthToken();
  if (!t) return null;
  const decoded = decodeJwtClaims(t);
  if (!decoded) return null;
  return {
    sub: decoded.sub as string,
    roles: decoded.roles as string[] | undefined,
    level: decoded.level as AccessLevel | undefined,
    orgId: (decoded.orgId as string | null) ?? null,
    schoolId: (decoded.schoolId as string | null) ?? null,
  };
}

export function currentRole(): "admin" | "teacher" | null {
  // Prefer claims (works for new unified storage), fall back to legacy flags
  const c = getClaims();
  if (c?.roles?.includes("admin")) return "admin";
  if (c?.roles?.includes("teacher")) return "teacher";
  if (typeof window !== "undefined") {
    if (localStorage.getItem(ADMIN_KEY)) return "admin";
    if (localStorage.getItem(TEACHER_KEY)) return "teacher";
  }
  return null;
}

export function currentLevel(): AccessLevel | null {
  return (getClaims()?.level ?? null) as AccessLevel | null;
}

export function clearDevAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_CLAIMS_KEY);
  // keep legacy cleanup too for consistency
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(TEACHER_KEY);
}

/** Keep legacy behavior AND store unified keys so SCRUM-19 claims are available. */
export function setAuthToken(token: string, role: "admin" | "teacher") {
  if (typeof window === "undefined") return;

  // Unified storage
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  const decoded = decodeJwtClaims(token);
  if (decoded) {
    localStorage.setItem(
      AUTH_CLAIMS_KEY,
      JSON.stringify({
        sub: decoded.sub,
        roles: decoded.roles,
        level: decoded.level,
        orgId: decoded.orgId ?? null,
        schoolId: decoded.schoolId ?? null,
      } as DevClaims)
    );
  }

  // Legacy storage (to not break any older checks)
  if (role === "admin") {
    localStorage.setItem(ADMIN_KEY, token);
    localStorage.removeItem(TEACHER_KEY);
  } else {
    localStorage.setItem(TEACHER_KEY, token);
    localStorage.removeItem(ADMIN_KEY);
  }
}

/**
 * Dev-only: mint a token and store it.
 * Back-compat signature: devMintToken(role, sub?)
 * New usage (SCRUM-19):   devMintToken(role, level)  OR devMintToken(role, level, sub)
 */
export async function devMintToken(
  role: "admin" | "teacher",
  levelOrSub?: AccessLevel | string,
  maybeSub?: string
): Promise<string> {
  // Interpret args to keep old calls working:
  const suppliedLevel = isLevel(levelOrSub) ? levelOrSub : undefined;
  const suppliedSub   = !isLevel(levelOrSub) ? levelOrSub : maybeSub;

  const level: AccessLevel = suppliedLevel ?? (role === "admin" ? "municipality" : "teacher");
  const sub   : string      = suppliedSub   ?? (role === "admin" ? "admin_1" : "teacher_1");

  const qs = new URLSearchParams({ role, sub, level });
  // Use apiFetch like before; no auth header needed for dev mint endpoint
  const res = await apiFetch<{ token: string; claims?: DevClaims }>(
    `/auth/dev/token?${qs.toString()}`,
    { method: "GET" }
  );
  if (!res.ok || !res.data?.token) {
    const msg = (res.data as Record<string, unknown>)?.message ?? `Mint token failed (HTTP ${res.status})`;
    throw new Error(String(msg));
  }

  const token = res.data.token;
  // Prefer claims from response; fall back to JWT decode if issuer didn't send them
  setAuthToken(token, role);
  if (typeof window !== "undefined") {
    const claims = res.data.claims ?? decodeJwtClaims(token);
    if (claims) {
      localStorage.setItem(
        AUTH_CLAIMS_KEY,
        JSON.stringify({
          sub: claims.sub,
          roles: claims.roles,
          level: claims.level,
          orgId: claims.orgId ?? null,
          schoolId: claims.schoolId ?? null,
        } as DevClaims)
      );
    }
  }
  return token;
}