import { Outlet } from "react-router-dom";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import Sidebar from "../components/navigation/Sidebar";
import TopNavbar from "../components/navigation/TopNavbar";
import ScrollToTop from "../components/common/ScrollToTop";
import useAuth from "../context/useAuth";
import Footer from "../components/navigation/Footer";

function AppShell() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100">
      <ScrollToTop />

      <TopNavbar />
      {isAuthenticated && <Sidebar />}

      <main
        className={[
          "min-h-screen pt-[70px] pb-[70px] lg:pb-0",
          isAuthenticated ? "lg:ml-[152px]" : "lg:ml-[20px]",
        ].join(" ")}
      >
        <Outlet />
      </main>

      {!isAuthenticated && <Footer />}

      {isAuthenticated && <MobileBottomNav />}
    </div>
  );
}

export default AppShell;
