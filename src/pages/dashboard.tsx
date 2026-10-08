import { useState, FormEvent } from "react";
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
  | { type: "CREATE_DEVICE" }

  | { type: "RENAME_DEVICE"; deviceId: string | number };

const Dashboard = () => {
  const { isChecking } = useAuthProtected(); // проверка аутентификации

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>({ type: "NONE" });
  
  const [devices, setDevices] = useState([
    { id: 1, name: "Основной сервер", status: "online" as const, statusText: "Онлайн", cpu: "25,9%", ram: "8,2 / 16 ГБ", time: "12 секунд назад" },
    { id: 2, name: "Рабочий компьютер", status: "online" as const, statusText: "Онлайн", cpu: "17,8%", ram: "27,1 / 31,3 ГБ", time: "24 секунды назад" },
    { id: 3, name: "Linux - WSL", status: "online" as const, statusText: "Онлайн", cpu: "0,5%", ram: "1,2 / 15,3 ГБ", time: "8 секунд назад" },
    { id: 4, name: "Учебный ноутбук", status: "offline" as const, statusText: "Офлайн", cpu: "—", ram: "—", time: "23 минуты назад" },
  ]);

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

  // открытие модалки СТРОГО по клику на строку устройства
  const handleDeviceRowClick = (id: string | number) => {
    const targetDevice = devices.find(d => d.id === id);
    if (!targetDevice) return;

    setPopupError(null);
    setDeviceName(targetDevice.name); // Предзаполняем текущее имя в инпут
    setActiveModal({ type: "RENAME_DEVICE", deviceId: id });
  };

  const handleCloseModal = () => {
    setActiveModal({ type: "NONE" });
  };

  // Локальное сохранение изменений в стейт массива
  const handleModalSubmit = (e: FormEvent) => {
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
      
      const newDevice = {
        id: Date.now(), 
        name: deviceName,
        status: "offline" as const,
        statusText: "Офлайн",
        cpu: "—",
        ram: "—",
        time: "Только что добавлен"
      };
      setDevices(prev => [...prev, newDevice]);

    } else if (activeModal.type === "RENAME_DEVICE") {
      setDevices(prev => prev.map(d => d.id === activeModal.deviceId ? { ...d, name: deviceName } : d));
    }

    setActiveModal({ type: "NONE" });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Расчет счетчиков на основе локального стейта
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === "online").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />

        <main style={{ padding: "32px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          <DevicesMainSection
            devices={devices}
            totalCount={totalCount}
            onlineCount={onlineCount}
            offlineCount={offlineCount}
            onAddDevice={handleOpenCreateModal}
            onRefresh={handleRefresh}
            onDeviceClick={handleDeviceRowClick}
            isRefreshing={isRefreshing}
          />
        </main>
      </div>

      <Popup
        isOpen={activeModal.type !== "NONE"}
        onClose={handleCloseModal}
        title={activeModal.type === "CREATE_DEVICE" ? "Добавить устройство" : "Редактировать устройство"}
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
              onClick={handleModalSubmit}
              coloringType="submit"
              style={{ width: "auto", padding: "12px 24px" }}
            >
              {activeModal.type === "CREATE_DEVICE" ? "Добавить" : "Сохранить изменения"}
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
