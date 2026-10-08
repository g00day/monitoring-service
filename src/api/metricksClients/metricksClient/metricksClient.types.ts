export type ISODateTime = string;

export interface DiskMetrics {
  name: string;
  disk_used_bytes: number;
  disk_total_bytes: number;
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
  max_points?: number; // 1-1000, по умолчанию 500
}

export interface ApiErrorResponse {
  detail: string | Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}
