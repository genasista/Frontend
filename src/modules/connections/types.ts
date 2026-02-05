export type Connection = {
  id: string;
  name: string;
  enabled: boolean;
  lastSeen: string | null;      // normalized on client
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateConnectionDto = {
  name: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
};