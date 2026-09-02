import {
  CircleUserRound,
  Download,
  Heart,
  Home,
  Library,
  Settings,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Home",
    to: "/",
    icon: Home,
  },
  {
    label: "Store",
    to: "/games",
    icon: ShoppingBag,
  },
  {
    label: "Library",
    to: "/library",
    icon: Library,
  },
  {
    label: "Wishlist",
    to: "/wishlist",
    icon: Heart,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: CircleUserRound,
  },
  {
    label: "Downloads",
    to: "/downloads",
    icon: Download,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[152px] border-r border-white/[0.07] bg-[#060914] lg:block">
      <div className="flex h-full flex-col px-2.5 py-5">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[9px] font-semibold uppercase tracking-[0.04em] transition-all duration-200",
                    isActive
                      ? "bg-violet-500/[0.10] text-white"
                      : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2.5 h-5 w-0.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                    )}

                    <Icon
                      className={[
                        "size-[16px] shrink-0 transition-colors",
                        isActive
                          ? "text-violet-300"
                          : "text-slate-600 group-hover:text-slate-300",
                      ].join(" ")}
                    />

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Flash Sale */}
        <div className="mt-auto">
          <div className="overflow-hidden rounded-xl border border-violet-400/15 bg-gradient-to-b from-violet-500/[0.10] to-transparent p-2">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3 text-violet-300" />

              <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-violet-300">
                Flash Sale
              </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#101529]">
              <img
                src="https://image.api.playstation.com/vulcan/ap/rnd/202501/2717/42b3ee6b1b2094212231b0b0a82824f687fc5c4dc9bde31c.png"
                alt="Forza Horizon 5"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Game information */}
              <div className="absolute inset-x-0 bottom-0 p-2">
                <p className="text-[8px] font-bold text-white">
                  FORZA HORIZON 5
                </p>

                <p className="mt-0.5 text-[7px] text-slate-400">
                  Premium Edition
                </p>
              </div>
            </div>

            <p className="mt-2 text-center text-[8px] font-bold text-violet-300">
              -70% OFF
            </p>

            <p className="mt-1 text-center font-mono text-[9px] text-slate-400">
              02 : 15 : 47
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
