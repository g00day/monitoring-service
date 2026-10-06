import MainStubSection from "@sections/MainStubSection/MainStubSection";
import AuthFormSection from "@sections/AuthFormSection/AuthFormSection";

const Main = () => {

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