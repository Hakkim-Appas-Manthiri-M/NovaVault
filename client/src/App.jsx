import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/common/PageLoader";
import StoreProvider from "./context/StoreProvider";
import AuthProvider from "./context/AuthContext.jsx";

function App() {
  return (
    <>
      <PageLoader />

      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </AuthProvider>
    </>
  );
}

export default App;