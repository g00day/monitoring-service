import style from "./GeneralSidebar.module.css";
import logoUrl from "@assets/icons/logo.svg";

const GeneralSidebar = () => {
  return (
    <aside className={style.sidebar}>
      {/* Верхняя часть с логотипом */}
      <div className={style.topSection}>
        <div className={style.logoWrapper}>
          <img src={logoUrl} alt="Logo" />
        </div>
        <h3 className={style.serviceTitle}>
          Мониторинговый <br /> сервис
        </h3>
      </div>

      {/* Навигационное меню */}
      <nav className={style.navigation}>
        <span className={style.menuLabel}>РАБОЧАЯ ОБЛАСТЬ</span>
        <div className={style.menuItemActive}>
          Устройства
        </div>
      </nav>

      {/* Нижняя часть с профилем и выходом */}
      <div className={style.footerSection}>
        <div className={style.profileBadge}>
          admin
        </div>
        <button className={style.logoutButton}>
          Выйти из аккаунта
        </button>
      </div>
    </aside>
  );
};

export default GeneralSidebar;