import { useEffect, useState } from "react";

export const useAuthProtected = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Если токена нет -> отправка на страницу входа
      window.location.replace("/");
    } else {
      setHasToken(true);
      setIsChecking(false);
    }
  }, []);

  return { isChecking, isAuthenticated: hasToken };
};
