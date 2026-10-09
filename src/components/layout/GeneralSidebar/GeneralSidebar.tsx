import style from "./GeneralSidebar.module.css";
import logoUrl from "@assets/icons/logo.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { meClient } from "@api/authClients/authMeClient/authMeClient";
import { logoutClient } from "@api/authClients/logoutClient/logoutClient";

const GeneralSidebar = () => {
  const [username, setUsername] = useState("Пользователь");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    let active = true;
    void meClient.getMe().then((user) => { if (active) setUsername(user.username); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutClient.logout();
    } catch {
      // Клиент удаляет локальный токен даже при недоступности сервера.
    } finally {
      window.location.replace("/");
    }
  };
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
        <Link to="/dashboard" className={style.menuItemActive} style={{ textDecoration: "none" }}>
          Устройства
        </Link>
      </nav>

      {/* Нижняя часть с профилем и выходом */}
      <div className={style.footerSection}>
        <div className={style.profileBadge}>
          {username}
        </div>
        <button className={style.logoutButton} onClick={logout} disabled={isLoggingOut}>
          Выйти из аккаунта
        </button>
      </div>
    </aside>
  );
};

export default GeneralSidebar;
