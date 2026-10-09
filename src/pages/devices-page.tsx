import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiErrorMessage } from "@utils/apiErrorMessage";
import { formatMemory } from "@utils/formatMetrics";
import { onlineTimeoutSeconds } from "@/config";
import GeneralSidebar from "@layout/GeneralSidebar/GeneralSidebar";
import BreadCrumbNavigation from "@layout/BreadCrumbNavigation/BreadCrumbNavigation";
import DevicesHeaderSection from "@sections/DevicesHeaderSection/DevicesHeaderSection";
import DevicesBottomSection from "@sections/DevicesBottomSection/DevicesBottomSection";

// UI-компоненты для модальных окон мутаций
import Popup from "@ui/Popup/Popup";
import FormField from "@ui/FormField/FormField";
import SubmitButton from "@ui/SubmitButton/SubmitButton";

import generateSvgPoints from "@utils/generateSvgPoints";

// Сервисный API-клиент устройств
import { devicesApiClient } from "@api/devicesClients/deviceClient/deviceClient";
import type { DeviceResponse, MetricsHistory } from "@api/devicesClients/deviceClient/deviceClient.types"

import { useAuthProtected } from "@hooks/useAuthProtected";


// Полиморфный стейт для управления контекстом модальных окон
type ActiveModalContext = 
  | { type: "NONE" }
  | { type: "RENAME" }
  | { type: "CHANGE_TOKEN" };

const DevicesPage = () => {
  // Инициализация хука защиты сессии: мгновенный редирект, если токен стерт
  const { isChecking } = useAuthProtected();

  const { deviceId = "" } = useParams();
  const [pageError, setPageError] = useState<string | null>(null);
  const [period, setPeriod] = useState<{ hours?: number; start?: string; end?: string }>({ hours: 0.25 });
  const requestId = useRef(0);
  const invalidateRequests = useCallback(() => { requestId.current++; }, []);

  // Состояния для хранения актуальных агрегированных данных бэкенда
  const [deviceData, setDeviceData] = useState<DeviceResponse | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Контекстные состояния модалок, лоадеров и валидации полей ввода
  const [activeModal, setActiveModal] = useState<ActiveModalContext>({ type: "NONE" });
  const [isMutating, setIsMutating] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const breadCrumbItems = ["Рабочая область", "Устройства", deviceData?.name || "Устройство"].map((item) => ({
    direction: item,
  }));

  const fetchDeviceDetails = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const end = period.end || new Date().toISOString();
      const start = period.start || new Date(Date.parse(end) - (period.hours || 24) * 3600000).toISOString();
      const [device, history] = await Promise.all([
        devicesApiClient.getDeviceById(deviceId),
        devicesApiClient.getMetricsHistory(deviceId, { max_points: 500, start, end })
      ]);
      if (id !== requestId.current) return;
      setDeviceData(device);
      setMetricsHistory(history);
      setPageError(null);
    } catch (error) {
      if (id === requestId.current) setPageError(apiErrorMessage(error));
    } finally {
      if (id === requestId.current) setPageLoading(false);
    }
  }, [deviceId, period]);

  useEffect(() => {
    if (isChecking) return;
    const initialLoad = window.setTimeout(() => void fetchDeviceDetails(), 0);
    const timer = window.setInterval(() => void fetchDeviceDetails(), 30000);
    return () => { window.clearTimeout(initialLoad); window.clearInterval(timer); invalidateRequests(); };
  }, [isChecking, fetchDeviceDetails, invalidateRequests]);

  // Коллбэки декларативного открытия окон управления
  const handleOpenRename = () => {
    setModalError(null);
    setInputName(deviceData?.name || "");
    setActiveModal({ type: "RENAME" });
  };

  const handleOpenChangeToken = () => {
    setModalError(null);
    setInputToken("");
    setActiveModal({ type: "CHANGE_TOKEN" });
  };

  const handleCloseModal = () => {
    if (isMutating) return; // Блокируем закрытие окна во время выполнения сетевого запроса
    setActiveModal({ type: "NONE" });
  };

  // Полиморфный обработчик отправки изменений (мутации) на бэкенд
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMutating(true);
    setModalError(null);

    try {
      if (activeModal.type === "RENAME") {
        if (!inputName.trim()) throw new Error("Название не может быть пустым");
        await devicesApiClient.renameDevice(deviceId, { name: inputName });
      } else if (activeModal.type === "CHANGE_TOKEN") {
        if (!inputToken.trim()) throw new Error("Токен не может быть пустым");
        await devicesApiClient.updateAgentToken(deviceId, { agent_token: inputToken });
      }

      setActiveModal({ type: "NONE" });
      setPageLoading(true);
      await fetchDeviceDetails(); // Инвалидация и рефреш актуальных данных на странице
    } catch (err: any) {
      if (err?.detail) {
        setModalError(typeof err.detail === "string" ? err.detail : err.detail[0]?.msg || "Ошибка валидации");
      } else {
        setModalError(err?.message || "Не удалось сохранить изменения");
      }
    } finally {
      setIsMutating(false);
    }
  };

  // Защитный барьер: прерываем рендеринг DOM, пока идет проверка сессии или загрузка API
  if (isChecking || (pageLoading && !deviceData)) return <p style={{ color: "white", padding: 32 }}>Загрузка…</p>;
  if (!deviceData) return <div style={{ color: "white", padding: 32 }}><p role="alert">{pageError || "Устройство не найдено"}</p><Link to="/dashboard">К списку устройств</Link></div>;

  const latestMetrics = deviceData?.latest_metrics;
  const historyPoints = metricsHistory?.points || [];

  // 1. Динамический расчет строки точек для графика CPU (среднее значение cpu_percent)
  const cpuSvgPoints = generateSvgPoints(historyPoints, (p) => p.cpu_percent, metricsHistory, onlineTimeoutSeconds);

  // 2. Динамический расчет строки точек для графика RAM с переводом байт в проценты
  const ramSvgPoints = generateSvgPoints(historyPoints, (p) => {
    if (p.memory_used_bytes == null || !p.memory_total_bytes) return null;
    return (p.memory_used_bytes / p.memory_total_bytes) * 100;
  }, metricsHistory, onlineTimeoutSeconds);

  // Безопасный маппинг сырых байт и чисел из API под интерфейсы UI-компонентов шапки
  const headerMetrics = [
    { label: "Загрузка CPU", value: latestMetrics?.cpu_percent == null ? "—" : `${latestMetrics.cpu_percent}%` },
    { label: "Оперативная память", value: formatMemory(latestMetrics?.memory_used_bytes, latestMetrics?.memory_total_bytes) },
    { label: "Файловые системы", value: latestMetrics?.disks?.length ?? "—" },
  ];

  // Конвертация мегабайт и процентов для прогресс-баров накопителей
  const processedDisks = latestMetrics?.disks?.map((disk) => ({
    label: disk.name,
    value: `${(disk.disk_used_bytes / (1024 ** 3)).toFixed(1)} ГиБ / ${(disk.disk_total_bytes / (1024 ** 3)).toFixed(1)} ГиБ`,
    percentage: disk.disk_total_bytes ? (disk.disk_used_bytes / disk.disk_total_bytes) * 100 : 0
  })) || [];

  // Нормализация маппинга стейтов отслеживаемых служб (running/stopped)
  const processedServices = latestMetrics?.services 
    ? Object.entries(latestMetrics.services).map(([name, status]) => ({
        name,
        status
      }))
    : [];


  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />
        
        <main style={{ padding: "32px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          {pageError && <p role="alert" style={{ color: "var(--offline-label-color)" }}>{pageError}. Показаны последние загруженные данные.</p>}
          <DevicesHeaderSection 
            title={deviceData?.name || "Загрузка..."}
            status={deviceData?.status || "offline"}
            statusText={deviceData?.status === "online" ? "Онлайн" : "Офлайн"}
            lastMeasurement={deviceData?.last_seen_at ? new Date(deviceData.last_seen_at).toLocaleString() : "Нет данных"}
            metrics={headerMetrics}
            onRename={handleOpenRename}
            onChangeAgentToken={handleOpenChangeToken}
            onBackClick={() => window.location.replace("/dashboard")}
          />
          
          <DevicesBottomSection 
            disks={processedDisks}
            services={processedServices}
            cpuPoints={cpuSvgPoints}
            ramPoints={ramSvgPoints}
            historyStart={metricsHistory?.start}
            historyEnd={metricsHistory?.end}
            historyPoints={historyPoints}
            onPeriodChange={setPeriod}
          />
        </main>
      </div>

      {/* Переиспользуемый Popup управления параметрами текущего сервера */}
      <Popup
        isOpen={activeModal.type !== "NONE"}
        onClose={handleCloseModal}
        title={activeModal.type === "RENAME" ? "Переименовать устройство" : "Изменить токен агента"}
        footerButtons={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isMutating}
              style={{
                backgroundColor: "#7f1d1d",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isMutating ? "not-allowed" : "pointer",
                opacity: isMutating ? 0.6 : 1,
              }}
            >
              Отмена
            </button>
            <SubmitButton
              isLoading={isMutating}
              onClick={handleModalSubmit}
              coloringType="submit"
              style={{ width: "auto", padding: "12px 24px" }}
            >
              Сохранить
            </SubmitButton>
          </>
        }
      >
        {modalError && (
          <div style={{ color: "var(--offline-label-color)", fontSize: "14px", fontWeight: 500 }}>
            {modalError}
          </div>
        )}

        {activeModal.type === "RENAME" ? (
          <FormField
            label="Новое название устройства"
            placeholder="Введите название"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            disabled={isMutating}
          />
        ) : (
          <FormField
            label="Новый токен агента"
            placeholder="Вставьте токен"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            disabled={isMutating}
          />
        )}
      </Popup>
    </div>
  );
};

export default DevicesPage;
