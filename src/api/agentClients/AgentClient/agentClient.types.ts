export type ISODateTime = string;

export interface DiskMetrics {
  name: string;
  disk_used_bytes: number;
  disk_total_bytes: number;
}

export interface AgentMetricsPayload {
  collected_at: ISODateTime;
  cpu_percent: number | null;
  memory_used_bytes: number | null;
  memory_total_bytes: number | null;
  disks: DiskMetrics[] | null;
  services: Record<string, string> | null;
}

export interface VerifyAgentResponse {
  status: string;
  device_id: number;
  device_name: string;
}

export interface ValidationErrorElement {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail: string | ValidationErrorElement[];
}