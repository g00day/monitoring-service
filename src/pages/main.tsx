import { useEffect } from "react";
import MainStubSection from "@sections/MainStubSection/MainStubSection";
import AuthFormSection from "@sections/AuthFormSection/AuthFormSection";

const Main = () => {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (token) {
      // редирект в случае если пользователь уже вошёл
      window.location.replace("/dashboard");
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color)",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <MainStubSection />
      <AuthFormSection />
    </div>
  );
};

export default Main;