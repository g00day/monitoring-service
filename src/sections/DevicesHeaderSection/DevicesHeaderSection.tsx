import styles from "./DevicesHeaderSection.module.css";


import StatusLabel from "@ui/StatusLabel/StatusLabel";
import SubmitButton from "@ui/SubmitButton/SubmitButton";

interface MetricItem {
  label: string;
  value: string | number;
}

interface DevicesHeaderSectionProps {
  title: string;
  status: "online" | "offline";
  statusText: string;
  lastMeasurement: string;
  metrics: MetricItem[];
  onRename?: () => void;
  onBackClick?: () => void;
}

const DevicesHeaderSection = ({
  title,
  status,
  statusText,
  lastMeasurement,
  metrics,
  onRename,
  onBackClick,
}: DevicesHeaderSectionProps) => {
  return (
    <section className={styles.container}>
      <button type="button" className={styles.backButton} onClick={onBackClick}>
        ← Все устройства
      </button>

      {/* Основная инфо-строка */}
      <div className={styles.mainRow}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            <StatusLabel status={status} text={statusText} />
          </div>
          <p className={styles.timestamp}>
            Последнее измерение: {lastMeasurement}
          </p>
        </div>

        <div className={styles.buttonWrapper}>
            <SubmitButton coloringType="submit">
                Переименовать
            </SubmitButton>
            <SubmitButton coloringType="submit">
              Изменить токен агента
            </SubmitButton>
        </div>
      </div>

      {/* Сетка мини-метрик */}
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <span className={styles.metricValue}>{metric.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DevicesHeaderSection;