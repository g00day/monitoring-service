import styles from "./MainStubSection.module.css";
import logoUrl from "@assets/icons/logo.svg";


const MainStubSection = () => {



  return (
    <section className={styles.MainStubSection}>
        {/* Шапка */}
        <div className={styles.heading}>
            <div className={styles.logoWrapper}>
            <img src={logoUrl} alt="Logo" />
            </div>
            <h3>Мониторинговый сервис</h3>
        </div>

        {/* Мониторинг дисков */}
        <div className={styles.diskSection}>
            
            <div className={styles.diskRow}>

                <div className={styles.diskHeader}>
                    <span className={styles.diskLabel}>/</span>
                    <span className={styles.diskValue}>42,8 ГБ / 100 ГБ</span>
                </div>

                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: "42.8%" }} />
                </div>
            </div>

            <div className={styles.diskRow}>
                <div className={styles.diskHeader}>
                    <span className={styles.diskLabel}>/data</span>
                    <span className={styles.diskValue}>128 ГБ / 500 ГБ</span>
                </div>
                    <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: "25.6%" }} />
                </div>
            </div>

        </div>

        {/* Основные метрики */}
        <div className={styles.metricsGrid}>

            <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Загрузка CPU</span>
                <span className={styles.metricValue}>25,9%</span>
            </div>

            <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Оперативная память</span>
                <span className={styles.metricValue}>51,2%</span>
            </div>

        </div>

        {/* График (заглушка в виде SVG) */}
        <div className={styles.chartSection}>

            <div className={styles.chartWrapper}>

                <div className={styles.chartYAxis}>
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                </div>
                
                <div className={styles.chartBody}>
                    <svg viewBox="0 0 500 100" className={styles.chartSvg} preserveAspectRatio="none">
                        
                        {/* Линии сетки по Y */}
                        <line x1="0" y1="10" x2="500" y2="10" className={styles.gridLine} />
                        <line x1="0" y1="50" x2="500" y2="50" className={styles.gridLine} />
                        <line x1="0" y1="90" x2="500" y2="90" className={styles.gridLine} />
                        
                        {/* Линия графика */}
                        <polyline
                        fill="none"
                        stroke="var(--chart-line-color)"
                        strokeWidth="2"
                        points="0,60 25,25 45,65 65,25 80,85 105,45 130,25 155,60 185,75 215,25 240,40 265,55 290,30 315,45 340,85 365,85 390,45 420,25 450,55 470,35 500,60"
                        />

                    </svg>
                </div>

            </div>

            {/* Временная шкала под графиком */}
            <div className={styles.chartTimeline}>

                <span>18:00</span>
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
            
            </div>
        </div>


    </section>
  );
};

export default MainStubSection;