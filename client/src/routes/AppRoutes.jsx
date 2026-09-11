import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../layouts/AppShell";
import ComingSoon from "../pages/ComingSoon";
import GameDetails from "../pages/GameDetails";
import Games from "../pages/Games";
import Home from "../pages/Home";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Categories from "../pages/Categories";
import Deals from "../pages/Deals";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import OrderSuccess from "../pages/OrderSuccess";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppShell />}>
        {/* =========================
            PUBLIC STORE
        ========================== */}

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Store */}
        <Route path="/games" element={<Games />} />

        {/* Game Details */}
        <Route path="/games/:gameId" element={<GameDetails />} />

        {/* Categories */}
        <Route path="/categories" element={<Categories />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Wishlist */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Deals */}
        <Route path="/deals" element={<Deals />} />

        {/* =========================
            PROTECTED USER AREA
        ========================== */}

        <Route element={<ProtectedRoute />}>
          {/* Library */}
          <Route
            path="/library"
            element={<ComingSoon title="Library" />}
          />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Downloads */}
          <Route
            path="/downloads"
            element={<ComingSoon title="Downloads" />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<ComingSoon title="Settings" />}
          />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Order Success */}
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />

          {/* Order Details */}
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          
        </Route>

        {/* =========================
            PUBLIC / COMING SOON
        ========================== */}

        {/* Community */}
        <Route
          path="/community"
          element={<ComingSoon title="Community" />}
        />

        {/* News */}
        <Route
          path="/news"
          element={<ComingSoon title="News" />}
        />

        {/* Support */}
        <Route
          path="/support"
          element={<ComingSoon title="Support" />}
        />

        {/* New Releases */}
        <Route
          path="/new-releases"
          element={<ComingSoon title="New Releases" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;