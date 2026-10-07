import GeneralSidebar from "@layout/GeneralSidebar/GeneralSidebar";
import BreadCrumbNavigation from "@layout/BreadCrumbNavigation/BreadCrumbNavigation";

const direction = "Рабочая область/Устройства/Основной сервер";

const DevicesPage = () => {
  const breadCrumbItems = direction.split("/").map((item) => ({
    direction: item,
  }));

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <GeneralSidebar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <BreadCrumbNavigation BreadCrumbItems={breadCrumbItems} />
        
        <main style={{ padding: "32px", flexGrow: 1 }}>
          {/* Контент */}
        </main>
      </div>
    </div>
  );
};

export default DevicesPage;
