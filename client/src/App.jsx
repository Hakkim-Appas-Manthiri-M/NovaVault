import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/common/PageLoader";
import StoreProvider from "./context/StoreProvider";
import AuthProvider from "./context/AuthContext.jsx";

function App() {
  return (
    <>
      <PageLoader />

      <StoreProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </StoreProvider>
    </>
  );
}

export default App;