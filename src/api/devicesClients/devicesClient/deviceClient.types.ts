export type ISODateTime = string;

export interface DiskMetrics {
  name: string;
  disk_used_bytes: number;
  disk_total_bytes: number;
}

export interface MetricsResponse {
  id: number;
  device_id: number;
  collected_at: ISODateTime;
  received_at: ISODateTime;
  cpu_percent: number | null;
  memory_used_bytes: number | null;
  memory_total_bytes: number | null;
  disks: DiskMetrics[] | null;
  services: Record<string, string> | null;
}

export interface DeviceResponse {
  id: number;
  name: string;
  created_at: ISODateTime;
  last_seen_at: ISODateTime | null;
  status: "online" | "offline";
  latest_metrics: MetricsResponse | null;
}

export interface CreateDeviceDto {
  name: string;
  agent_token: string;
}

export interface RenameDeviceDto {
  name: string;
}

export interface UpdateAgentTokenDto {
  agent_token: string;
}

export interface ApiErrorResponse {
  detail: string | Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}


export interface HistoryPoint {
  bucket_start: ISODateTime;
  samples: number;
  cpu_percent: number | null;
  cpu_max_percent: number | null;
  memory_used_bytes: number | null;
  memory_total_bytes: number | null;
  disks: DiskMetrics[] | null;
}

export interface MetricsHistory {
  device_id: number;
  start: ISODateTime;
  end: ISODateTime;
  step_seconds: number;
  points: HistoryPoint[];
}

export interface GetMetricsHistoryParams {
  start?: ISODateTime;
  end?: ISODateTime;
  max_points?: number; // Допустимый диапазон: 1-1000, по умолчанию 500
}