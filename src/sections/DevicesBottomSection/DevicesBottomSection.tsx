import { useState } from "react";
import styles from "./DevicesBottomSection.module.css";

import MetricHistoryChart from "./MetricHistoryChart";
import type { HistoryPoint } from "@api/devicesClients/deviceClient/deviceClient.types";

interface DiskItem {
  label: string;
  value: string;
  percentage: number;
}

interface ServiceItem {
  name: string;
  status: string;
}

interface DevicesBottomSectionProps {
  disks: DiskItem[];
  services: ServiceItem[];
  cpuPoints: string[];
  ramPoints: string[];
  historyStart?: string;
  historyEnd?: string;
  historyPoints: HistoryPoint[];
  onPeriodChange: (period: { hours?: number; start?: string; end?: string }) => void;
}

const DevicesBottomSection = ({ disks, services, cpuPoints, ramPoints, historyStart, historyEnd, historyPoints, onPeriodChange }: DevicesBottomSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("15 минут");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [periodError, setPeriodError] = useState("");
  const tabs = ["5 минут", "15 минут", "1 час", "6 часов", "24 часа", "Период"];
  const hoursByTab: Record<string, number> = { "5 минут": 5 / 60, "15 минут": 0.25, "1 час": 1, "6 часов": 6, "24 часа": 24 };

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
              onClick={() => {
                setActiveTab(tab);
                setPeriodError("");
                if (tab !== "Период") onPeriodChange({ hours: hoursByTab[tab] });
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка графиков */}
      {activeTab === "Период" && <form onSubmit={(event) => {
        event.preventDefault();
        if (!customStart || !customEnd || Date.parse(customStart) >= Date.parse(customEnd)) {
          setPeriodError("Укажите начало периода раньше его окончания");
          return;
        }
        setPeriodError("");
        onPeriodChange({ start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() });
      }} className={styles.periodForm}>
        <label>С <input aria-label="Начало периода" type="datetime-local" required value={customStart} onChange={(e) => setCustomStart(e.target.value)} /></label>
        <label>По <input aria-label="Конец периода" type="datetime-local" required value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} /></label>
        <button type="submit" className={styles.tabButton}>Применить</button>
        {periodError && <p role="alert">{periodError}</p>}
      </form>}
      <div className={styles.chartsGrid}>
        <MetricHistoryChart
          title="CPU"
          lineColor="#4f46e5"
          points={cpuPoints}
          samples={historyPoints.map((point) => ({ time: point.bucket_start, value: point.cpu_percent, count: point.samples }))}
          start={historyStart}
          end={historyEnd}
        />
        <MetricHistoryChart
          title="Память"
          lineColor="#14b8a6"
          points={ramPoints}
          samples={historyPoints.map((point) => ({ time: point.bucket_start, value: point.memory_used_bytes == null || !point.memory_total_bytes ? null : point.memory_used_bytes / point.memory_total_bytes * 100, count: point.samples }))}
          start={historyStart}
          end={historyEnd}
        />
      </div>

      {/* Сетка нижних информационных панелей */}
      <div className={styles.detailsGrid}>
        {/* Файловые системы */}
        <div className={styles.detailsCard}>
          <h2 className={styles.cardHeaderTitle}>Файловые системы</h2>
          <div className={styles.diskSection}>
            {!disks.length && <p style={{ color: "var(--secondary-text-color)" }}>Нет данных о дисках</p>}
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
            {!services.length && <p style={{ color: "var(--secondary-text-color)" }}>Нет данных о службах</p>}
            {services.map((service, index) => (
              <div key={index} className={styles.serviceRow}>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={`${styles.serviceStatus} ${styles[service.status] || ""}`}>
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
