import { useState } from "react";
import styles from "./DevicesBottomSection.module.css";

import MetricHistoryChart from "./MetricHistoryChart";

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
  cpuPoints: string;
  ramPoints: string;
}

const DevicesBottomSection = ({ disks, services, cpuPoints, ramPoints }: DevicesBottomSectionProps) => {
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
          points={cpuPoints || "0,90 500,90"}
        />
        <MetricHistoryChart
          title="Память"
          lineColor="#14b8a6"
          points={ramPoints || "0,90 500,90"}
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
