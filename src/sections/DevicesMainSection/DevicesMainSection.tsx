import styles from "./DevicesMainSection.module.css";
import StatusLabel from "@ui/StatusLabel/StatusLabel";
import SubmitButton from "@ui/SubmitButton/SubmitButton";

export interface DeviceItem {
  id: string | number;
  name: string;
  status: "online" | "offline";
  statusText: string;
  cpu: string;
  ram: string;
  time: string;
}

interface DevicesMainSectionProps {
  devices: DeviceItem[];
  totalCount: number;
  onlineCount: number;
  offlineCount: number;
  onAddDevice?: () => void;
  onRefresh?: () => void;
  onDeviceClick?: (id: string | number) => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  isRefreshing?: boolean;
}

const DevicesMainSection = ({
  devices,
  totalCount,
  onlineCount,
  offlineCount,
  onAddDevice,
  onRefresh,
  onDeviceClick,
  onSearchChange,
  searchValue,
  isRefreshing = false,
}: DevicesMainSectionProps) => {
  return (
    <section className={styles.container}>
      {/* Шапка секции */}
      <div className={styles.header}>
        <h1 className={styles.title}>Устройства</h1>
        <SubmitButton 
          onClick={onAddDevice}
          className={styles.addButton}
          coloringType="submit"
        >
          + Добавить устройство
        </SubmitButton>
      </div>

      {/* Верхние карточки статистики */}
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <span className={styles.statsLabel}>Всего устройств</span>
          <span className={styles.statsValue}>{totalCount}</span>
        </div>
        <div className={`${styles.statsCard} ${styles.statsOnline}`}>
          <span className={styles.statsLabel}>Онлайн</span>
          <span className={styles.statsValue}>{onlineCount}</span>
        </div>
        <div className={`${styles.statsCard} ${styles.statsOffline}`}>
          <span className={styles.statsLabel}>Офлайн</span>
          <span className={styles.statsValue}>{offlineCount}</span>
        </div>
      </div>

      {/* Панель поиска и фильтров */}
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Поиск по названию устройства"
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <SubmitButton 
          onClick={onRefresh}
          isLoading={isRefreshing}
          className={styles.refreshButton}
          coloringType="submit"
        >
          Обновить
        </SubmitButton>
      </div>

      {/* Таблица устройств */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>УСТРОЙСТВО</th>
              <th>СОСТОЯНИЕ</th>
              <th>CPU</th>
              <th>ПАМЯТЬ</th>
              <th>ПОСЛЕДНИЕ ДАННЫЕ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr
                key={device.id}
                className={styles.row}
                onClick={() => onDeviceClick?.(device.id)}
              >
                <td>
                  <div className={styles.deviceCell}>
                    <div className={styles.pcIcon}>PC</div>
                    <span className={styles.deviceName}>{device.name}</span>
                  </div>
                </td>
                <td>
                  <StatusLabel status={device.status} text={device.statusText} />
                </td>
                <td className={styles.centerText}>{device.cpu}</td>
                <td>{device.ram}</td>
                <td className={styles.timeCell}>{device.time}</td>
                <td className={styles.arrowCell}>&rsaquo;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Подвал таблицы */}
      <div className={styles.footerRow}>
        Показано {devices.length} из {totalCount} устройств
      </div>
    </section>
  );
};

export default DevicesMainSection;
