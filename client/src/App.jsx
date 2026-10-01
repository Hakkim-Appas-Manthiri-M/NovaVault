import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/common/PageLoader";
import StoreProvider from "./context/StoreProvider";
import AuthProvider from "./context/AuthContext.jsx";
import NotificationProvider from "./context/NotificationProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <PageLoader />

      <AuthProvider>
        <NotificationProvider>
          <StoreProvider>
            <AppRoutes />
          </StoreProvider>
        </NotificationProvider>
      </AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0b0f1a",
            color: "#ffffff",
            border: "1px solid rgba(139, 92, 246, 0.20)",
            borderRadius: "12px",
            boxShadow:
              "0 20px 45px rgba(0, 0, 0, 0.45)",
            fontSize: "12px",
            fontWeight: "600",
            padding: "12px 14px",
          },
        }}
      />
    </>
  );
}

export default App;