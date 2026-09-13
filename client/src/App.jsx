import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/common/PageLoader";
import StoreProvider from "./context/StoreProvider";
import AuthProvider from "./context/AuthContext.jsx";
import NotificationProvider from "./context/NotificationProvider";

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
    </>
  );
}

export default App;