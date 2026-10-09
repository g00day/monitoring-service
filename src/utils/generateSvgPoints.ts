import type { HistoryPoint, MetricsHistory } from "@api/devicesClients/deviceClient/deviceClient.types";

// Отдельные линии сохраняют разрывы при null и пропущенных интервалах.
const generateSvgPoints = (
  points: HistoryPoint[],
  valueExtractor: (point: HistoryPoint) => number | null,
  history: Pick<MetricsHistory, "start" | "end" | "step_seconds"> | null,
  offlineTimeoutSeconds = 180,
): string[] => {
  if (!history || !points.length) return [];
  const start = Date.parse(history.start);
  const duration = Date.parse(history.end) - start;
  if (duration <= 0) return [];
  const maxGap = Math.max(offlineTimeoutSeconds, history.step_seconds * 1.5) * 1000;
  const segments: string[] = [];
  let current: string[] = [];
  let previous: number | null = null;
  const flush = () => {
    if (current.length) segments.push(current.join(" "));
    current = [];
  };
  for (const point of points) {
    const time = Date.parse(point.bucket_start);
    const value = valueExtractor(point);
    if (value == null || !Number.isFinite(value)) {
      flush();
      previous = null;
      continue;
    }
    if (previous !== null && time - previous > maxGap) flush();
    const x = Math.max(0, Math.min(500, (time - start) / duration * 500));
    const y = 90 - Math.max(0, Math.min(100, value)) * 0.8;
    current.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    previous = time;
  }
  flush();
  return segments;
};

export default generateSvgPoints;
