import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { devicesApiClient } from "@api/devicesClients/deviceClient/deviceClient";
import type { DeviceResponse } from "@api/devicesClients/deviceClient/deviceClient.types";
import { apiErrorMessage } from "@utils/apiErrorMessage";
import { formatMemory } from "@utils/formatMetrics";
import BreadCrumbNavigation from "@layout/BreadCrumbNavigation/BreadCrumbNavigation";
import GeneralSidebar from "@layout/GeneralSidebar/GeneralSidebar";
import DevicesMainSection from "@sections/DevicesMainSection/DevicesMainSection";

import Popup from "@ui/Popup/Popup";
import FormField from "@ui/FormField/FormField";
import SubmitButton from "@ui/SubmitButton/SubmitButton";


import { useAuthProtected } from "@hooks/useAuthProtected";

const direction = "Рабочая область/Устройства";

type ActiveModal = 
  | { type: "NONE" }
  | { type: "CREATE_DEVICE" };

const Dashboard = () => {
  const { isChecking } = useAuthProtected(); // проверка аутентификации

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>({ type: "NONE" });
  
  const navigate = useNavigate();
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const requestId = useRef(0);
  const invalidateRequests = useCallback(() => { requestId.current++; }, []);
  const limit = 10;

  const loadDevices = useCallback(async () => {
    const id = ++requestId.current;
    setIsRefreshing(true);
    try {
      const [page, online, offline] = await Promise.all([
        devicesApiClient.getDevices({ limit, offset, search }),
        devicesApiClient.getDevices({ limit: 1, search, status: "online" }),
        devicesApiClient.getDevices({ limit: 1, search, status: "offline" }),
      ]);
      if (id !== requestId.current) return;
      if (offset > 0 && offset >= page.total) {
        setOffset(Math.max(0, Math.ceil(page.total / limit) - 1) * limit);
        return;
      }
      setDevices(page.devices);
      setTotalCount(page.total);
      setOnlineCount(online.total);
      setOfflineCount(offline.total);
      setPageError(null);
    } catch (error) {
      if (id === requestId.current) setPageError(apiErrorMessage(error));
    } finally {
      if (id === requestId.current) setIsRefreshing(false);
    }
  }, [offset, search]);

  useEffect(() => {
    if (isChecking) return;
    const debounce = window.setTimeout(() => void loadDevices(), 250);
    const timer = window.setInterval(() => void loadDevices(), 30000);
    return () => {
      window.clearTimeout(debounce);
      window.clearInterval(timer);
      invalidateRequests();
    };
  }, [isChecking, loadDevices, invalidateRequests]);

  const [deviceName, setDeviceName] = useState("");
  const [agentToken, setAgentToken] = useState("");
  const [popupError, setPopupError] = useState<string | null>(null);

  const breadCrumbItems = direction.split("/").map((item: string) => ({
    direction: item,
  }));

  // Если сессия еще проверяется, блокировка построения DOM-дерева страницы
  if (isChecking) return null;

  const handleOpenCreateModal = () => {
    setPopupError(null);
    setDeviceName("");
    setAgentToken("");
    setActiveModal({ type: "CREATE_DEVICE" });
  };

  const handleDeviceRowClick = (id: string | number) => {
    navigate(`/devices/${id}`);
  };

  const handleCloseModal = () => {
    if (isMutating) return;
    setActiveModal({ type: "NONE" });
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!deviceName) {
      setPopupError("Название устройства не может быть пустым");
      return;
    }

    if (activeModal.type === "CREATE_DEVICE") {
      if (!agentToken) {
        setPopupError("Токен агента обязателен при создании");
        return;
      }
      
      setIsMutating(true);
      setPopupError(null);
      try {
        const device = await devicesApiClient.createDevice({ name: deviceName, agent_token: agentToken });
        setActiveModal({ type: "NONE" });
        navigate(`/devices/${device.id}`);
      } catch (error) {
        setPopupError(apiErrorMessage(error));
      } finally {
        setIsMutating(false);
      }
    }
  };

  const handleRefresh = () => {
    void loadDevices();
  };

  const deviceItems = devices.map((device) => ({
    ...device,
    statusText: device.status === "online" ? "Онлайн" : "Офлайн",
    cpu: device.latest_metrics?.cpu_percent == null ? "—" : `${device.latest_metrics.cpu_percent}%`,
    ram: formatMemory(device.latest_metrics?.memory_used_bytes, device.latest_metrics?.memory_total_bytes),
    time: device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : "Нет данных",
  }));

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />

        <main style={{ padding: "32px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          {pageError && <p role="alert" style={{ color: "var(--offline-label-color)" }}>{pageError}</p>}
          <DevicesMainSection
            devices={deviceItems}
            totalCount={totalCount}
            onlineCount={onlineCount}
            offlineCount={offlineCount}
            onAddDevice={handleOpenCreateModal}
            onRefresh={handleRefresh}
            onDeviceClick={handleDeviceRowClick}
            isRefreshing={isRefreshing}
            searchValue={search}
            onSearchChange={(value) => { setSearch(value); setOffset(0); }}
          />
          {!isRefreshing && !pageError && devices.length === 0 && <p style={{ color: "var(--secondary-text-color)" }}>Устройства не найдены</p>}
          <div style={{ display: "flex", gap: "16px" }}>
            <SubmitButton coloringType="submit" disabled={offset === 0 || isRefreshing} onClick={() => setOffset(Math.max(0, offset - limit))}>Назад</SubmitButton>
            <SubmitButton coloringType="submit" disabled={offset + limit >= totalCount || isRefreshing} onClick={() => setOffset(offset + limit)}>Далее</SubmitButton>
          </div>
        </main>
      </div>

      <Popup
        isOpen={activeModal.type !== "NONE"}
        onClose={handleCloseModal}
        title="Добавить устройство"
        footerButtons={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              style={{
                backgroundColor: "#7f1d1d",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
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
              Добавить
            </SubmitButton>
          </>
        }
      >
        {popupError && (
          <div style={{ color: "var(--offline-label-color, #DA1F1F)", fontSize: "14px", fontWeight: 500 }}>
            {popupError}
          </div>
        )}

        <FormField
          label="Название устройства"
          placeholder="Например: Тестовый сервер"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
        
        {activeModal.type === "CREATE_DEVICE" && (
          <FormField
            label="Токен агента"
            placeholder="Вставьте случайный токен агента"
            value={agentToken}
            onChange={(e) => setAgentToken(e.target.value)}
          />
        )}

        <div style={{
          backgroundColor: "var(--metricks-bg-color)",
          border: "1px solid var(--metricks-border-color)",
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "18px",
        }}>
          Один токен - одно устройство
        </div>
      </Popup>
    </div>
  );
};

export default Dashboard;
