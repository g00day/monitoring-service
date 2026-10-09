import styles from "./DevicesBottomSection.module.css"
import { useState, type PointerEvent } from "react";


interface MetricHistoryChartProps {
  title: string;
  lineColor: string;
  points: string[];
  samples: { time: string; value: number | null; count: number }[];
  start?: string;
  end?: string;
}

const MetricHistoryChart = ({ title, lineColor, points, samples, start, end }: MetricHistoryChartProps) => {
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const duration = start && end ? Date.parse(end) - Date.parse(start) : 0;
  const chartSamples = samples.flatMap((sample) => {
    if (sample.value == null || !Number.isFinite(sample.value) || !start || duration <= 0) return [];
    const x = (Date.parse(sample.time) - Date.parse(start)) / duration * 100;
    if (x < 0 || x > 100) return [];
    return [{ ...sample, value: sample.value, x, y: 90 - Math.max(0, Math.min(100, sample.value)) * 0.8 }];
  });
  const hovered = chartSamples.find((sample) => sample.time === hoverTime);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 100;
    const nearest = chartSamples.reduce<typeof chartSamples[number] | undefined>((best, sample) =>
      !best || Math.abs(sample.x - x) < Math.abs(best.x - x) ? sample : best, undefined);
    // В пустой области не показываем значение далёкого измерения.
    setHoverTime(nearest && Math.abs(nearest.x - x) * bounds.width / 100 <= 24 ? nearest.time : null);
  };
  const timeline = start && end ? Array.from({ length: 5 }, (_, index) =>
    new Date(Date.parse(start) + (Date.parse(end) - Date.parse(start)) * index / 4)
      .toLocaleString(undefined, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
  ) : [];
  return (
    <div className={styles.chartSection}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        <div className={styles.chartYAxis}>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className={styles.chartBody} onPointerMove={onPointerMove} onPointerLeave={() => setHoverTime(null)} onPointerCancel={() => setHoverTime(null)}>
          <svg role="img" aria-label={`${title}: история загрузки в процентах`} viewBox="0 0 500 100" className={styles.chartSvg} preserveAspectRatio="none">
            <line x1="0" y1="10" x2="500" y2="10" className={styles.gridLine} />
            <line x1="0" y1="50" x2="500" y2="50" className={styles.gridLine} />
            <line x1="0" y1="90" x2="500" y2="90" className={styles.gridLine} />
            {points.map((segment, index) => segment.includes(" ")
              ? <polyline key={index} fill="none" stroke={lineColor} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" points={segment} />
              : <circle key={index} cx={segment.split(",")[0]} cy={segment.split(",")[1]} r="2" fill={lineColor} />)}
            {!points.length && <text x="250" y="50" textAnchor="middle" fill="#91A0B8" fontSize="10">Нет данных</text>}
          </svg>
          {hovered && <>
            <div className={styles.chartCursor} style={{ left: `${hovered.x}%` }} />
            <div className={styles.chartDot} style={{ left: `${hovered.x}%`, top: `${hovered.y}%`, background: lineColor }} />
            <div role="tooltip" className={styles.chartTooltip} style={{ left: `${Math.max(0, Math.min(100, hovered.x))}%`, transform: hovered.x > 50 ? "translateX(-100%)" : undefined }}>
              <span>{new Date(hovered.time).toLocaleString()}</span>
              <strong style={{ color: lineColor }}>{title}: {hovered.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%</strong>
            </div>
          </>}
        </div>
      </div>
      <div className={styles.chartTimeline}>
        {timeline.map((label, index) => <span key={index}>{label}</span>)}
      </div>
    </div>
  );
};


export default MetricHistoryChart
