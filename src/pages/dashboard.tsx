import BreadCrumbNavigation from "@layout/BreadCrumbNavigation/BreadCrumbNavigation";
import GeneralSidebar from "@layout/GeneralSidebar/GeneralSidebar";
import DevicesMainSection from "@sections/DevicesMainSection/DevicesMainSection";

const direction = "Рабочая область/Устройства";

const Dashboard = () => {
  const breadCrumbItems = direction.split("/").map((item: string) => ({
    direction: item,
  }));

  // Массив устройств со всеми данными из таблицы на макете
  const mockDevices = [
    {
      id: 1,
      name: "Основной сервер",
      status: "online" as const,
      statusText: "Онлайн",
      cpu: "25,9%",
      ram: "8,2 / 16 ГБ",
      time: "12 секунд назад",
    },
    {
      id: 2,
      name: "Рабочий компьютер",
      status: "online" as const,
      statusText: "Онлайн",
      cpu: "17,8%",
      ram: "27,1 / 31,3 ГБ",
      time: "24 секунды назад",
    },
    {
      id: 3,
      name: "Linux - WSL",
      status: "online" as const,
      statusText: "Онлайн",
      cpu: "0,5%",
      ram: "1,2 / 15,3 ГБ",
      time: "8 секунд назад",
    },
    {
      id: 4,
      name: "Учебный ноутбук",
      status: "offline" as const,
      statusText: "Офлайн",
      cpu: "—",
      ram: "—",
      time: "23 минуты назад",
    },
  ];

  // Обработчики действий
  const handleAddDevice = () => {
    console.log("Добавление нового устройства");
  };

  const handleRefresh = () => {
    console.log("Обновление данных");
  };

  const handleDeviceClick = (id: string | number) => {
    console.log(`Переход на детальную страницу устройства с ID: ${id}`);
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />

        <main style={{ padding: "32px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          <DevicesMainSection
            devices={mockDevices}
            totalCount={4}
            onlineCount={3}
            offlineCount={1}
            onAddDevice={handleAddDevice}
            onRefresh={handleRefresh}
            onDeviceClick={handleDeviceClick}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;