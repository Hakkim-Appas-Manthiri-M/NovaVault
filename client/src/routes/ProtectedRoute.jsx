import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import PageLoader from "../components/common/PageLoader";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;