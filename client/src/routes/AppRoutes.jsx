import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../layouts/AppShell";
import ComingSoon from "../pages/ComingSoon";
import GameDetails from "../pages/GameDetails";
import Games from "../pages/Games";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Store */}
        <Route path="/games" element={<Games />} />

        {/* Game Details */}
        <Route path="/games/:gameId" element={<GameDetails />} />

        {/* Library */}
        <Route path="/library" element={<ComingSoon title="Library" />} />

        {/* Wishlist */}
        <Route path="/wishlist" element={<ComingSoon title="Wishlist" />} />

        {/* Profile */}
        <Route path="/profile" element={<ComingSoon title="Profile" />} />

        {/* Downloads */}
        <Route path="/downloads" element={<ComingSoon title="Downloads" />} />

        {/* Settings */}
        <Route path="/settings" element={<ComingSoon title="Settings" />} />

        {/* Cart */}
        <Route path="/cart" element={<ComingSoon title="Cart" />} />

        {/* Community */}
        <Route path="/community" element={<ComingSoon title="Community" />} />

        {/* News */}
        <Route path="/news" element={<ComingSoon title="News" />} />

        {/* Support */}
        <Route path="/support" element={<ComingSoon title="Support" />} />

        {/* New Releases */}
        <Route
          path="/new-releases"
          element={<ComingSoon title="New Releases" />}
        />

        {/* Deals */}
        <Route path="/deals" element={<ComingSoon title="Vault Deals" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;