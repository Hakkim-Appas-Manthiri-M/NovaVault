import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Library,
  Search,
  Settings,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import NovaVaultLogo from "./NovaVaultLogo";

import { useStore } from "../../context/useStore";
import useAuth from "../../context/useAuth";
import { getGames } from "../../services/gameApi";

const navigation = [
  { label: "Discover", to: "/games" },
  { label: "Vault", to: "/library" },
  { label: "Community", to: "/community" },
  { label: "News", to: "/news" },
  { label: "Support", to: "/support" },
];

function SearchDropdown({
  searchQuery,
  searchLoading,
  searchResults,
  onGameClick,
  onViewAll,
}) {
  return (
    <div
      className="
        absolute left-0 top-[44px]
        z-[200]
        w-full
        overflow-hidden
        rounded-xl
        border border-white/[0.08]
        bg-[#080B15]/98
        shadow-2xl
        shadow-black/50
        backdrop-blur-2xl
      "
    >
      {/* Search header */}
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="!text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Search Results
          </span>

          <span className="max-w-[150px] truncate !text-[10px] text-slate-700">
            {searchQuery.trim()}
          </span>
        </div>
      </div>

      {/* Loading skeleton */}
      {searchLoading ? (
        <div className="space-y-2 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-lg p-2">
              <div className="size-12 shrink-0 animate-pulse rounded-lg bg-white/[0.06]" />

              <div className="min-w-0 flex-1 space-y-2 py-1">
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/[0.07]" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-2 w-full animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <>
          {/* Results */}
          <div className="max-h-[390px] overflow-y-auto p-2">
            {searchResults.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => onGameClick(game)}
                className="
                  group flex w-full
                  gap-3 rounded-lg
                  p-2 text-left
                  transition-all duration-200
                  hover:bg-white/[0.045]
                "
              >
                {/* Game image */}
                <img
                  src={game.portraitImage || game.image}
                  alt=""
                  className="
                    size-12 shrink-0
                    rounded-lg object-cover
                    ring-1 ring-white/[0.06]
                    transition-transform duration-300
                    group-hover:scale-[1.03]
                  "
                />

                {/* Game information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate !text-[10px] font-bold text-slate-200 group-hover:text-white">
                      {game.title}
                    </h3>

                    <span className="shrink-0 !text-[9px] font-bold text-violet-300">
                      ₹{Number(game.price || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate !text-[8px] font-semibold uppercase tracking-[0.04em] text-violet-400/80">
                    {game.genre}
                  </p>

                  <p className="mt-1 line-clamp-2 !text-[8px] leading-3 text-slate-600">
                    {game.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* View all */}
          <button
            type="button"
            onClick={onViewAll}
            className="
              flex w-full items-center justify-center
              border-t border-white/[0.06]
              px-4 py-3
              !text-[8px]
              font-bold uppercase
              tracking-[0.1em]
              text-violet-400
              transition-colors
              hover:bg-violet-500/[0.05]
              hover:text-violet-300
            "
          >
            View All Results
          </button>
        </>
      ) : (
        /* No results */
        <div className="px-4 py-8 text-center">
          <Search className="mx-auto size-5 text-slate-700" />

          <p className="mt-3 !text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            No games found
          </p>

          <p className="mt-1 !text-[8px] text-slate-700">
            Try another game, genre, or developer.
          </p>
        </div>
      )}
    </div>
  );
}

function TopNavbar() {
  const { wishlistCount, cartCount } = useStore();
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showGlobalSearch = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      // Auth state is already cleared by the context when logout succeeds.
    }
  };

  // =========================
  // GLOBAL SEARCH
  // =========================
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // =========================
  // MOBILE MENU
  // =========================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // =========================
  // MOBILE SEARCH
  // Only visible when scrollY === 0
  // =========================
  const [mobileSearchVisible, setMobileSearchVisible] = useState(
    window.scrollY <= 1,
  );

  // =========================
  // LOCK BACKGROUND SCROLL
  // =========================
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [mobileMenuOpen]);

  // =========================
  // CLOSE MOBILE MENU WITH ESC
  // =========================
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

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

  // =========================
  // ACCOUNT MENU
  // CLOSE ON OUTSIDE CLICK / ESC
  // =========================
  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  // =========================
  // MOBILE SEARCH SCROLL BEHAVIOR
  //
  // TOP:
  //   visible
  //
  // ANY SCROLL DOWN:
  //   hidden
  //
  // SCROLL BACK UP:
  //   stays hidden
  //
  // ONLY scrollY === 0:
  //   visible again
  // =========================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setMobileSearchVisible(currentScrollY <= 1);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // MOBILE HEADER HEIGHT
  //
  // Search visible:
  // 70px navbar + 61px search = 131px
  //
  // Search hidden:
  // 70px navbar + 0px search = 70px
  // =========================
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--nv-mobile-header-height",
      showGlobalSearch && mobileSearchVisible ? "131px" : "70px",
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--nv-mobile-header-height",
      );
    };
  }, [mobileSearchVisible, showGlobalSearch]);

  // =========================
  // GLOBAL SEARCH API
  // =========================
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      return undefined;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const data = await getGames({
          search: query,
          limit: 6,
        });

        if (cancelled) return;

        const results = (data.games || []).map((game) => ({
          ...game,
          id: game._id,
        }));

        setSearchResults(results);
      } catch {
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  // =========================
  // SEARCH INPUT
  // =========================
  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchQuery(value);
    setSearchOpen(Boolean(value.trim()));

    if (!value.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
  };

  // =========================
  // CLEAR SEARCH
  // =========================
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchLoading(false);
    setSearchOpen(false);
  };

  // =========================
  // OPEN GAME
  // =========================
  const openGame = (game) => {
    clearSearch();
    navigate(`/games/${game.slug}`);
  };

  // =========================
  // VIEW ALL SEARCH RESULTS
  // =========================
  const openAllSearchResults = () => {
    const query = searchQuery.trim();

    if (!query) return;

    clearSearch();
    navigate(`/games?search=${encodeURIComponent(query)}`);
  };

  // =========================
  // MOBILE MENU
  // =========================
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    clearSearch();
    setMobileMenuOpen(true);
  };

  return (
    <>
      {/* =========================
          MAIN NAVBAR
      ========================== */}
      <header
        className="
          fixed left-0 right-0 top-0 z-50 w-full
          border-b border-white/[0.06]
          bg-[#050711]/95
          backdrop-blur-xl
        "
      >
        {/* =========================
            TOP NAV ROW
        ========================== */}
        <div
          className="
            mx-auto flex h-[70px]
            max-w-[1536px]
            items-center
            px-4 sm:px-6 lg:px-2
          "
        >
          {/* Logo */}
          <Link to="/" aria-label="NovaVault home" className="shrink-0">
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
                    "relative py-[26px] !text-[10px] font-bold uppercase tracking-[0.07em] transition-colors",
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

          {/* =========================
              RIGHT SIDE
          ========================== */}
          <div className="relative ml-auto flex items-center gap-1">
            {/* =========================
                DESKTOP / TABLET SEARCH
            ========================== */}
            {showGlobalSearch && (
              <div
                className="
                  relative hidden
                  w-[350px]
                  md:block
                  lg:w-[280px]
                  xl:w-[400px]
                  2xl:w-[420px]"
              >
                <label className="relative block w-full">
                  <span className="sr-only">Search games</span>

                  <Search
                    className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    size-3
                    -translate-y-1/2
                    text-slate-500
                  "
                  />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search games, DLC, developers..."
                    className="
                    h-9 w-full
                    rounded-lg
                    border border-white/[0.08]
                    bg-[#080B15]
                    pl-9 pr-8
                    !text-[13px]
                    text-white
                    outline-none
                    transition-all duration-200
                    placeholder:!text-[13px]
                    placeholder:text-slate-500
                    hover:border-white/[0.12]
                    focus:border-violet-500/40
                  "
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={clearSearch}
                      className="
                      absolute right-2 top-1/2
                      flex size-5
                      -translate-y-1/2
                      items-center justify-center
                      rounded-md
                      text-slate-500
                      transition
                      hover:bg-white/[0.06]
                      hover:text-white
                    "
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </label>

                {/* Desktop search dropdown */}
                {searchOpen && (
                  <SearchDropdown
                    searchQuery={searchQuery}
                    searchLoading={searchLoading}
                    searchResults={searchResults}
                    onGameClick={openGame}
                    onViewAll={openAllSearchResults}
                  />
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="
                relative hidden size-9
                items-center justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-white/[0.04]
                hover:text-white
                lg:flex
              "
            >
              <Heart className="size-[17px]" />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex size-3.5
                    items-center justify-center
                    rounded-full
                    bg-violet-600
                    text-[7px]
                    font-bold
                    leading-none
                    text-white
                  "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="
                relative hidden size-9
                items-center justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-white/[0.04]
                hover:text-white
                lg:flex
              "
            >
              <ShoppingCart className="size-[17px]" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    flex size-3.5
                    items-center justify-center
                    rounded-full
                    bg-violet-600
                    text-[7px]
                    font-bold
                    leading-none
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Authentication */}
            {authLoading ? (
              <div
                className="
                  ml-1 flex size-8
                  items-center justify-center
                  rounded-full border border-white/[0.06]
                bg-white/[0.025]"
                aria-label="Loading account"
              >
                <span className="size-3 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : isAuthenticated ? (
              <div ref={accountMenuRef} className="relative ml-1 shrink-0">
                <button
                  type="button"
                  aria-label="Open account menu"
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((current) => !current)}
                  className="
                    flex shrink-0 items-center gap-1.5
                    rounded-lg px-1 py-1
                    transition hover:bg-white/[0.04]"
                >
                  <span
                    className="
                      flex size-8 shrink-0
                      items-center justify-center
                      rounded-full
                      border border-violet-400/30
                    bg-violet-500/10
                      !text-[9px]
                      font-bold uppercase
                    text-violet-200
                    "
                  >
                    {user?.name?.charAt(0) || "U"}
                  </span>

                  <span
                    className="
                      hidden max-w-[70px]
                      truncate !text-[9px]
                      font-semibold
                    text-slate-300
                      md:block
                    "
                  >
                    {user?.name || "Account"}
                  </span>

                  <ChevronDown
                    className={`
                      hidden size-3 text-slate-500
                      transition-transform duration-200
                      md:block
                      ${accountMenuOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="
                        absolute z-[200] hidden
                        w-56 overflow-hidden rounded-xl
                        border border-white/[0.08]
                      bg-[#080B15]/98
                        shadow-2xl
                        shadow-black/50
                        backdrop-blur-2xl

                        md:block md:fixed md:right-4 md:top-15
                        lg:absolute lg:right-0 lg:top-11
                      "
                    >
                      {/* User details */}
                      <div className="border-b border-white/[0.06] p-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="
                              flex size-10 shrink-0
                              items-center justify-center
                              rounded-full
                              border border-violet-400/30
                            bg-violet-500/10
                              text-xs font-bold
                              uppercase text-violet-200
                            "
                          >
                            {user?.name?.charAt(0) || "U"}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-white">
                              {user?.name || "NovaVault User"}
                            </p>

                            <p className="mt-0.5 truncate !text-[9px] text-slate-500">
                              {user?.email || "No email available"}
                            </p>

                            <span className="mt-1 inline-flex rounded-md border border-violet-500/15 bg-violet-500/[0.06] px-1.5 py-0.5 !text-[7px] font-bold uppercase tracking-[0.1em] text-violet-300">
                              {user?.role || "user"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Account links */}
                      <div className="p-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setAccountMenuOpen(false)}
                          className="
                            flex h-9 items-center gap-2.5
                            rounded-lg px-2.5
                            !text-[9px] font-semibold
                          text-slate-400
                            transition
                          hover:bg-white/[0.045]
                          hover:text-white
                          "
                        >
                          <UserRound className="size-3.5" />
                          Profile
                        </Link>

                        <Link
                          to="/library"
                          onClick={() => setAccountMenuOpen(false)}
                          className="
                            flex h-9 items-center gap-2.5
                            rounded-lg px-2.5
                            !text-[9px] font-semibold
                          text-slate-400
                            transition
                          hover:bg-white/[0.045]
                          hover:text-white
                          "
                        >
                          <Library className="size-3.5" />
                          Library
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="
                            flex h-9 items-center gap-2.5
                            rounded-lg px-2.5
                            !text-[9px] font-semibold
                          text-slate-400
                            transition
                          hover:bg-white/[0.045]
                          hover:text-white
                          "
                        >
                          <Heart className="size-3.5" />
                          Wishlist
                        </Link>

                        <Link
                          to="/cart"
                          onClick={() => setAccountMenuOpen(false)}
                          className="
                            flex h-9 items-center gap-2.5
                            rounded-lg px-2.5
                            !text-[9px] font-semibold
                          text-slate-400
                            transition
                          hover:bg-white/[0.045]
                          hover:text-white
                          "
                        >
                          <ShoppingCart className="size-3.5" />
                          Cart
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setAccountMenuOpen(false)}
                          className="
                            flex h-9 items-center gap-2.5
                            rounded-lg px-2.5
                            !text-[9px] font-semibold
                          text-slate-400
                            transition
                          hover:bg-white/[0.045]
                          hover:text-white
                          "
                        >
                          <Settings className="size-3.5" />
                          Settings
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-white/[0.06] p-1.5">
                        <button
                          type="button"
                          onClick={async () => {
                            setAccountMenuOpen(false);
                            await handleLogout();
                          }}
                          className="
                            flex h-9 w-full
                            items-center gap-2.5
                            rounded-lg px-2.5
                            text-left
                            !text-[9px] font-semibold
                          text-red-400/80
                            transition
                          hover:bg-red-500/[0.06]
                          hover:text-red-300
                          "
                        >
                          <LogOut className="size-3.5" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  ml-1 flex h-8
                  items-center gap-1.5
                  rounded-lg border border-violet-400/15
                bg-violet-500/[0.08] px-3 !text-[9px]
                  font-bold uppercase tracking-[0.08em]
                text-violet-300 transition hover:border-violet-400/25
                hover:bg-violet-500/[0.14] hover:text-violet-200"
              >
                <LogIn className="size-3.5" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={openMobileMenu}
              className="
                mr-0 flex size-9
                items-center justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-white/[0.04]
                hover:text-white
                lg:hidden
              "
            >
              <Menu className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* =========================
            MOBILE GLOBAL SEARCH
        ========================== */}
        {showGlobalSearch && (
          <motion.div
            className="
            box-border
            overflow-visible
            border-t border-white/[0.04]
            bg-[#050711]/95
            px-4
            backdrop-blur-xl
            md:hidden
          "
            initial={false}
            animate={{
              height: mobileSearchVisible ? "61px" : "0px",
              opacity: mobileSearchVisible ? 1 : 0,
            }}
            transition={{
              height: {
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.18,
                ease: "easeOut",
              },
            }}
          >
            <div className="relative py-2.5">
              <Search
                className="
                pointer-events-none
                absolute left-3 top-1/2
                size-3
                -translate-y-1/2
                text-slate-500
              "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search games, DLC, developers..."
                className="
                h-10 w-full
                rounded-lg
                border border-white/[0.08]
                bg-[#080B15]
                pl-9 pr-9
                !text-[12px]
                text-white
                outline-none
                transition-all duration-200
                placeholder:!text-[11px]
                placeholder:text-slate-500
                hover:border-white/[0.12]
                focus:border-violet-500/40
              "
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={clearSearch}
                  className="
                  absolute right-2 top-1/2
                  flex size-6
                  -translate-y-1/2
                  items-center justify-center
                  rounded-md
                  text-slate-500
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
                >
                  <X className="size-3" />
                </button>
              )}

              {/* Mobile dropdown */}
              {searchOpen && mobileSearchVisible && (
                <SearchDropdown
                  searchQuery={searchQuery}
                  searchLoading={searchLoading}
                  searchResults={searchResults}
                  onGameClick={openGame}
                  onViewAll={openAllSearchResults}
                />
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* =========================
          MOBILE FULLSCREEN MENU
      ========================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="
                fixed inset-0 z-[90]
                bg-black/50
                backdrop-blur-[2px]
                lg:hidden
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              onClick={closeMobileMenu}
            />

            {/* Sliding Menu */}
            <motion.div
              className="
                fixed inset-0 z-[100]
                h-[100dvh] w-full
                overflow-hidden
                bg-[#050711]
                lg:hidden
              "
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Mobile menu header */}
              <div
                className="
                  flex h-[70px]
                  items-center
                  border-b border-white/[0.06]
                  px-4 sm:px-6
                "
              >
                <Link
                  to="/"
                  aria-label="NovaVault home"
                  onClick={closeMobileMenu}
                  className="shrink-0"
                >
                  <NovaVaultLogo />
                </Link>

                {/* Close */}
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMobileMenu}
                  className="
                    ml-auto flex size-10
                    items-center justify-center
                    rounded-lg
                    border border-white/[0.06]
                    bg-white/[0.025]
                    text-slate-400
                    transition
                    hover:bg-white/[0.06]
                    hover:text-white
                    active:scale-95
                  "
                >
                  <X className="size-[19px]" />
                </button>
              </div>

              {/* Mobile menu content */}
              <div
                className="
                  flex h-[calc(100dvh-70px)]
                  min-w-0 flex-col
                  overflow-y-auto overflow-x-hidden
                  px-4 py-6 sm:px-6
                  overscroll-none
                  [&::-webkit-scrollbar]:w-1
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-white/10
                "
              >
                {/* Main navigation */}
                <nav className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{
                        opacity: 0,
                        x: -18,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.08 + index * 0.045,
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          [
                            "flex h-12 items-center rounded-xl border px-4 !text-[10px] font-bold uppercase tracking-[0.08em] transition-all",
                            isActive
                              ? "border-violet-400/15 bg-violet-500/[0.10] text-violet-300"
                              : "border-white/[0.04] bg-white/[0.015] text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.035] hover:text-white",
                          ].join(" ")
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <motion.div
                  className="my-6 h-px bg-white/[0.06]"
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  transition={{
                    delay: 0.25,
                    duration: 0.3,
                  }}
                />

                {/* Secondary navigation */}
                <div className="space-y-2">
                  {/* Wishlist */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -18,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.3,
                      duration: 0.28,
                    }}
                  >
                    <NavLink
                      to="/wishlist"
                      onClick={closeMobileMenu}
                      className="
                        flex h-12
                        items-center gap-3
                        rounded-xl border
                        border-white/[0.04]
                        bg-white/[0.015]
                        px-4
                        !text-[10px]
                        font-bold uppercase
                        tracking-[0.08em]
                        text-slate-400
                        transition
                        hover:bg-white/[0.035]
                        hover:text-white
                      "
                    >
                      <Heart className="size-4" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto rounded-full bg-violet-500 px-2 py-0.5 text-[8px] font-bold text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>

                  {/* Cart */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -18,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.34,
                      duration: 0.28,
                    }}
                  >
                    <NavLink
                      to="/cart"
                      onClick={closeMobileMenu}
                      className="
                        flex h-12
                        items-center gap-3
                        rounded-xl border
                        border-white/[0.04]
                        bg-white/[0.015]
                        px-4
                        !text-[10px]
                        font-bold uppercase
                        tracking-[0.08em]
                        text-slate-400
                        transition
                        hover:bg-white/[0.035]
                        hover:text-white
                      "
                    >
                      <ShoppingCart className="size-4" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-auto rounded-full bg-violet-500 px-2 py-0.5 text-[8px] font-bold text-white">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>

                  {/* Profile / Authentication */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -18,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.38,
                      duration: 0.28,
                    }}
                  >
                    {authLoading ? (
                      <div
                        className="
        flex h-12
        items-center gap-3
        rounded-xl border
        border-white/[0.04]
        bg-white/[0.015]
        px-4
      "
                      >
                        <span className="flex size-6 items-center justify-center">
                          <span className="size-3 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                        </span>

                        <span
                          className="
          !text-[10px]
          font-bold uppercase
          tracking-[0.08em]
          text-slate-500
        "
                        >
                          Loading account
                        </span>
                      </div>
                    ) : isAuthenticated ? (
                      <>
                        <NavLink
                          to="/profile"
                          onClick={closeMobileMenu}
                          className="
          flex h-12
          items-center gap-3
          rounded-xl border
          border-white/[0.04]
          bg-white/[0.015]
          px-4
          !text-[10px]
          font-bold uppercase
          tracking-[0.08em]
          text-slate-400
          transition
          hover:bg-white/[0.035]
          hover:text-white
        "
                        >
                          <span
                            className="
            flex size-6 shrink-0
            items-center justify-center
            rounded-full
            border border-violet-400/30
            bg-violet-500/10
            !text-[8px]
            font-bold
            uppercase
            text-violet-200
          "
                          >
                            {user?.name?.charAt(0) || "U"}
                          </span>
                          Profile
                          <span
                            className="
            ml-auto
            max-w-[120px]
            truncate
            !text-[8px]
            normal-case
            tracking-normal
            text-slate-600
          "
                          >
                            {user?.name || "Account"}
                          </span>
                        </NavLink>

                        <button
                          type="button"
                          onClick={async () => {
                            await handleLogout();
                            closeMobileMenu();
                          }}
                          className="
          mt-2 flex h-12 w-full
          items-center gap-3
          rounded-xl border
          border-red-400/[0.08]
          bg-red-500/[0.025]
          px-4
          !text-[10px]
          font-bold uppercase
          tracking-[0.08em]
          text-red-400/80
          transition
          hover:border-red-400/[0.15]
          hover:bg-red-500/[0.06]
          hover:text-red-300
        "
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <NavLink
                        to="/login"
                        onClick={closeMobileMenu}
                        className="
        flex h-12
        items-center gap-3
        rounded-xl border
        border-violet-400/15
        bg-violet-500/[0.08]
        px-4
        !text-[10px]
        font-bold uppercase
        tracking-[0.08em]
        text-violet-300
        transition
        hover:border-violet-400/25
        hover:bg-violet-500/[0.12]
        hover:text-violet-200
      "
                      >
                        <LogIn className="size-4" />
                        Sign in
                        <span
                          className="
          ml-auto
          !text-[8px]
          normal-case
          tracking-normal
          text-violet-400/50
        "
                        >
                          Account
                        </span>
                      </NavLink>
                    )}
                  </motion.div>
                </div>

                {/* Bottom branding */}
                <motion.div
                  className="mt-auto pt-10"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.42,
                    duration: 0.3,
                  }}
                >
                  <p
                    className="
                      text-center
                      !text-[7px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-slate-700
                    "
                  >
                    NOVAVAULT
                  </p>

                  <p className="mt-1 text-center !text-[7px] text-slate-700">
                    Your next game awaits.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default TopNavbar;
