import GeneralSidebar from "@layout/GeneralSidebar/GeneralSidebar";
import BreadCrumbNavigation from "@layout/BreadCrumbNavigation/BreadCrumbNavigation";
import DevicesHeaderSection from "@sections/DevicesHeaderSection/DevicesHeaderSection";
import DevicesBottomSection from "@sections/DevicesBottomSection/DevicesBottomSection";

const direction = "Рабочая область/Устройства/Основной сервер";

const DevicesPage = () => {
  const breadCrumbItems = direction.split("/").map((item) => ({
    direction: item,
  }));

  // Тестовые данные для отображения метрик в шапке
  const mockMetrics = [
    { label: "Загрузка CPU", value: "25,9%" },
    { label: "Оперативная память", value: "51,2%" },
    { label: "Файловые системы", value: 2 },
  ];

  // Тестовые данные для файловых систем
  const mockDisks = [
    { label: "/", value: "42,8 ГБ / 100 ГБ", percentage: 42.8 },
    { label: "/data", value: "128 ГБ / 500 ГБ", percentage: 25.6 },
  ];

  // Тестовые данные для отслеживаемых служб
  const mockServices = [
    { name: "cron.service", status: "running" as const },
    { name: "systemd-journald.service", status: "running" as const },
    { name: "snapd.service", status: "stopped" as const },
  ];

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />
        
        <main style={{ padding: "32px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          <DevicesHeaderSection 
            title="Основной сервер"
            status="online"
            statusText="Онлайн"
            lastMeasurement="01.10.2026, 18:06:08"
            metrics={mockMetrics}
            onRename={() => console.log("Открыть модалку переименования")}
            onChangeAgentToken={() => console.log("Открыть модалку изменения токена")}
            onBackClick={() => window.location.replace("/dashboard")} // Ссылка-редирект на главную панель
          />
          
          <DevicesBottomSection 
            disks={mockDisks}
            services={mockServices}
          />
        </main>
      </div>
    </div>
  );
};

export default DevicesPage;
