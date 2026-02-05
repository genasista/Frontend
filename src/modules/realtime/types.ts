export type RealtimeRaw = Record<string, unknown>;

export type RealtimeEvent = {
  id: string;
  type: string;
  ts: string; // ISO
  correlationId: string | null;
  data?: Record<string, unknown> | null;
};
