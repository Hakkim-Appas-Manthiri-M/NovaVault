import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import NovaVaultLogo from "./NovaVaultLogo";

const navigation = [
  { label: "Store", to: "/games" },
  { label: "Library", to: "/library" },
  { label: "Community", to: "/community" },
  { label: "News", to: "/news" },
  { label: "Support", to: "/support" },
];

function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* =========================
          MAIN NAVBAR
      ========================== */}
      <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#050711]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1536px] items-center px-4 sm:px-6 lg:px-7">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="mr-3 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.04] hover:text-white lg:hidden"
          >
            <Menu className="size-[18px]" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label="NovaVault home"
            className="shrink-0"
          >
            <NovaVaultLogo />
          </Link>

          {/* Desktop navigation */}
          <nav className="ml-10 hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "relative py-[26px] text-[9px] font-bold uppercase tracking-[0.07em] transition-colors",
                    isActive
                      ? "text-violet-400"
                      : "text-slate-400 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}

                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            {/* Desktop / Tablet search
                Hidden only on small mobile screens */}
            <label className="relative hidden w-[190px] md:block lg:w-[220px] xl:w-[260px]">
              <span className="sr-only">Search games</span>

              <Search className="pointer-events-none absolute left-3 top-1/2 size-3 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search games, DLC, developers..."
                className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#080B15] pl-9 pr-8 text-[9px] text-white outline-none transition-all duration-200 placeholder:text-[13px] placeholder:text-slate-500 hover:border-white/[0.12] focus:border-violet-500/40"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="size-3" />
                </button>
              )}
            </label>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Heart className="size-[17px]" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <ShoppingCart className="size-[17px]" />

              <span className="absolute right-0.5 top-0.5 flex min-w-3.5 items-center justify-center rounded-full bg-violet-500 px-1 text-[7px] font-bold leading-3 text-white">
                2
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="ml-1 flex items-center gap-2 rounded-lg px-1 py-1 transition hover:bg-white/[0.04]"
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-[9px] font-bold text-violet-200">
                H
              </span>

              <span className="hidden text-[9px] font-semibold text-slate-300 md:block">
                Hakkim
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          MOBILE FULLSCREEN MENU
      ========================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] w-full bg-[#050711] lg:hidden">
          {/* Mobile menu header */}
          <div className="flex h-[70px] items-center border-b border-white/[0.06] px-4 sm:px-6">
            <Link
              to="/"
              aria-label="NovaVault home"
              onClick={closeMobileMenu}
              className="shrink-0"
            >
              <NovaVaultLogo />
            </Link>

            {/* Close button */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className="ml-auto flex size-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-[19px]" />
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="flex h-[calc(100vh-70px)] min-w-0 flex-col overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6">
            {/* Main navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    [
                      "flex h-12 items-center rounded-xl border px-4 text-[10px] font-bold uppercase tracking-[0.08em] transition-all",
                      isActive
                        ? "border-violet-400/15 bg-violet-500/[0.10] text-violet-300"
                        : "border-white/[0.04] bg-white/[0.015] text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.035] hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.06]" />

            {/* Secondary navigation */}
            <div className="space-y-2">
              {/* Wishlist */}
              <NavLink
                to="/wishlist"
                onClick={closeMobileMenu}
                className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 transition hover:bg-white/[0.035] hover:text-white"
              >
                <Heart className="size-4" />
                Wishlist
              </NavLink>

              {/* Cart */}
              <NavLink
                to="/cart"
                onClick={closeMobileMenu}
                className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 transition hover:bg-white/[0.035] hover:text-white"
              >
                <ShoppingCart className="size-4" />
                Cart

                <span className="ml-auto rounded-full bg-violet-500 px-2 py-0.5 text-[8px] font-bold text-white">
                  2
                </span>
              </NavLink>

              {/* Profile */}
              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 transition hover:bg-white/[0.035] hover:text-white"
              >
                <span className="flex size-6 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-[8px] font-bold text-violet-200">
                  H
                </span>

                Profile

                <span className="ml-auto text-[8px] normal-case tracking-normal text-slate-600">
                  Hakkim
                </span>
              </NavLink>
            </div>

            {/* Bottom branding */}
            <div className="mt-auto pt-10">
              <p className="text-center text-[7px] font-medium uppercase tracking-[0.18em] text-slate-700">
                NOVAVAULT
              </p>

              <p className="mt-1 text-center text-[7px] text-slate-700">
                Your next game awaits.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopNavbar;