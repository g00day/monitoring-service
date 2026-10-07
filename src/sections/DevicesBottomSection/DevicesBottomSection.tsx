import { useState } from "react";
import styles from "./DevicesBottomSection.module.css";

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

interface DiskItem {
  label: string;
  value: string;
  percentage: number;
}

interface ServiceItem {
  name: string;
  status: "running" | "stopped";
}

interface DevicesBottomSectionProps {
  disks: DiskItem[];
  services: ServiceItem[];
}

const DevicesBottomSection = ({ disks, services }: DevicesBottomSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("24 часа");
  const tabs = ["1 час", "6 часов", "24 часа", "Период"];

  return (
    <section className={styles.container}>
      {/* Шапка секции истории */}
      <div className={styles.historyHeader}>
        <h2 className={styles.sectionTitle}>История показателей</h2>
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        <MetricHistoryChart
          title="CPU"
          lineColor="#4f46e5"
          points="0,60 25,25 45,65 65,25 80,85 105,45 130,25 155,60 185,75 215,25 240,40 265,55 290,30 315,45 340,85 365,85 390,45 420,25 450,55 470,35 500,60"
        />
        <MetricHistoryChart
          title="Память"
          lineColor="#14b8a6"
          points="0,60 25,25 45,65 65,25 80,85 105,45 130,25 155,60 185,75 215,25 240,40 265,55 290,30 315,45 340,85 365,85 390,45 420,25 450,55 470,35 500,60"
        />
      </div>

      {/* Сетка нижних информационных панелей */}
      <div className={styles.detailsGrid}>
        {/* Файловые системы */}
        <div className={styles.detailsCard}>
          <h2 className={styles.cardHeaderTitle}>Файловые системы</h2>
          <div className={styles.diskSection}>
            {disks.map((disk, index) => (
              <div key={index} className={styles.diskRow}>
                <div className={styles.diskHeader}>
                  <span className={styles.diskLabel}>{disk.label}</span>
                  <span className={styles.diskValue}>{disk.value}</span>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${disk.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Отслеживаемые службы */}
        <div className={styles.detailsCard}>
          <h2 className={styles.cardHeaderTitle}>Отслеживаемые службы</h2>
          <div className={styles.servicesList}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceRow}>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={`${styles.serviceStatus} ${styles[service.status]}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevicesBottomSection;
