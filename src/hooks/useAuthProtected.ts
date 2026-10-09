import { useEffect, useState } from "react";

export const useAuthProtected = () => {
  const [hasToken] = useState(() => Boolean(localStorage.getItem("access_token")));

  useEffect(() => {
    if (!hasToken) {
      // Если токена нет -> отправка на страницу входа
      window.location.replace("/");
    }
  }, [hasToken]);

  return { isChecking: !hasToken, isAuthenticated: hasToken };
};
