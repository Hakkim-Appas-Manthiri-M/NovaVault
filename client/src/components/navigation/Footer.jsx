import {
  ArrowUpRight,
  Globe,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import NovaVaultLogo from "./NovaVaultLogo";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Store", to: "/games" },
      { label: "Categories", to: "/categories" },
      { label: "Deals", to: "/deals" },
      { label: "New Releases", to: "/new-releases" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community", to: "/community" },
      { label: "News", to: "/news" },
      { label: "Support", to: "/support" },
    ],
  },
];

const socialLinks = [
  {
    label: "Community",
    icon: MessageCircle,
    href: "/community",
  },
  {
    label: "Videos",
    icon: Play,
    href: "/news",
  },
  {
    label: "Explore",
    icon: Globe,
    href: "/games",
  },
  {
    label: "NovaVault",
    icon: Sparkles,
    href: "/",
  },
];

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#050711]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="group inline-flex items-center gap-2"
            >
              <NovaVaultLogo />
            </Link>

            <p className="mt-4 max-w-xs !text-[10px] leading-5 text-slate-500 sm:!text-[11px]">
              Discover premium games, explore new worlds, and build your
              personal game vault.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-500 transition-all duration-200 hover:border-violet-400/25 hover:bg-violet-500/[0.08] hover:text-violet-300"
                  >
                    <Icon className="size-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Groups */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="!text-[8px] font-bold uppercase tracking-[0.18em] text-violet-400">
                {group.title}
              </p>

              <div className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-1 !text-[10px] font-medium text-slate-500 transition-colors duration-150 hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight className="size-2.5 opacity-0 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter / CTA */}
          <div>
            <p className="!text-[8px] font-bold uppercase tracking-[0.18em] text-violet-400">
              NovaVault
            </p>

            <h2 className="nv-display mt-3 text-lg font-bold tracking-tight text-white">
              Enter the Vault.
            </h2>

            <p className="mt-2 max-w-xs !text-[9px] leading-4 text-slate-600">
              Stay updated with new releases, featured titles, and exclusive
              deals.
            </p>

            <Link
              to="/games"
              className="mt-4 inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-violet-400/20 bg-violet-500/[0.08] px-3 !text-[8px] font-bold uppercase tracking-[0.08em] text-violet-300 transition-all duration-200 hover:border-violet-400/35 hover:bg-violet-500/[0.14] hover:text-violet-200"
            >
              Explore Store
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="!text-[8px] font-medium uppercase tracking-[0.08em] text-slate-700">
            © {new Date().getFullYear()} NovaVault. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/support"
              className="!text-[8px] font-medium uppercase tracking-[0.06em] text-slate-700 transition-colors hover:text-slate-400"
            >
              Privacy
            </Link>

            <Link
              to="/support"
              className="!text-[8px] font-medium uppercase tracking-[0.06em] text-slate-700 transition-colors hover:text-slate-400"
            >
              Terms
            </Link>

            <span className="!text-[8px] font-medium uppercase tracking-[0.06em] text-slate-800">
              Built for gamers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;