import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/common/PageLoader";
import StoreProvider from "./context/StoreProvider";

function App() {
  return (
    <>
      <PageLoader />

      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </>
  );
}

export default App;