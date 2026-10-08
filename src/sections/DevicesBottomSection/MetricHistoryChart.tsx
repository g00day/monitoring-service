import styles from "./DevicesBottomSection.module.css"


interface MetricHistoryChartProps {
  title: string;
  lineColor: string;
  points: string;
}

const MetricHistoryChart = ({ title, lineColor, points }: MetricHistoryChartProps) => {
  return (
    <div className={styles.chartSection}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        <div className={styles.chartYAxis}>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className={styles.chartBody}>
          <svg viewBox="0 0 500 100" className={styles.chartSvg} preserveAspectRatio="none">
            <line x1="0" y1="10" x2="500" y2="10" className={styles.gridLine} />
            <line x1="0" y1="50" x2="500" y2="50" className={styles.gridLine} />
            <line x1="0" y1="90" x2="500" y2="90" className={styles.gridLine} />
            <polyline fill="none" stroke={lineColor} strokeWidth="2" points={points} />
          </svg>
        </div>
      </div>
      <div className={styles.chartTimeline}>
        <span>18:00</span>
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
      </div>
    </div>
  );
};


export default MetricHistoryChart