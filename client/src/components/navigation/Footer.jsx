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
      {/* =========================================================
          DESKTOP / TABLET FOOTER
          ========================================================= */}
      <div className="mx-auto hidden max-w-7xl px-6 py-8 md:block lg:px-8 lg:py-9">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.35fr] lg:gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="group inline-flex items-center gap-2"
            >
              <NovaVaultLogo />
            </Link>

            <p className="mt-3 max-w-xs !text-[9px] leading-4 text-slate-600">
              Discover premium games, explore new worlds, and build your
              personal game vault.
            </p>

            <div className="mt-4 flex items-center gap-1.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="
                      flex size-7
                      items-center justify-center
                      rounded-lg
                      border border-white/[0.07]
                      bg-white/[0.025]
                      text-slate-600
                      transition-all duration-200
                      hover:border-violet-400/25
                      hover:bg-violet-500/[0.08]
                      hover:text-violet-300
                    "
                  >
                    <Icon className="size-3" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Groups */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="!text-[7px] font-bold uppercase tracking-[0.18em] text-violet-400">
                {group.title}
              </p>

              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="
                      group flex items-center gap-1
                      !text-[9px]
                      font-medium
                      text-slate-600
                      transition-colors duration-150
                      hover:text-white
                    "
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      className="
                        size-2.5
                        opacity-0
                        transition-all duration-150
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div>
            <p className="!text-[7px] font-bold uppercase tracking-[0.18em] text-violet-400">
              NovaVault
            </p>

            <h2 className="nv-display mt-2 text-base font-bold tracking-tight text-white">
              Enter the Vault.
            </h2>

            <p className="mt-1.5 max-w-xs !text-[8px] leading-4 text-slate-600">
              Stay updated with new releases, featured titles, and exclusive
              deals.
            </p>

            <Link
              to="/games"
              className="
                mt-3
                inline-flex
                min-h-7
                items-center
                gap-1.5
                rounded-lg
                border border-violet-400/20
                bg-violet-500/[0.08]
                px-2.5
                !text-[7px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-violet-300
                transition-all duration-200
                hover:border-violet-400/35
                hover:bg-violet-500/[0.14]
                hover:text-violet-200
              "
            >
              Explore Store
              <ArrowUpRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE FOOTER
          ========================================================= */}
      <div className="px-4 py-6 md:hidden">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center"
          >
            <NovaVaultLogo />
          </Link>

          <p className="mt-2 max-w-[290px] !text-[8px] leading-4 text-slate-600">
            Discover premium games, explore new worlds, and build your
            personal game vault.
          </p>

          {/* Social */}
          <div className="mt-3 flex items-center gap-1.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="
                    flex size-7
                    items-center justify-center
                    rounded-lg
                    border border-white/[0.07]
                    bg-white/[0.025]
                    text-slate-600
                    transition-colors
                    hover:border-violet-400/25
                    hover:text-violet-300
                  "
                >
                  <Icon className="size-3" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Compact Links */}
        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/[0.05] pt-5">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="!text-[7px] font-bold uppercase tracking-[0.16em] text-violet-400">
                {group.title}
              </p>

              <div className="mt-2.5 space-y-1.5">
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="
                      block
                      !text-[8px]
                      font-medium
                      text-slate-600
                      transition-colors
                      hover:text-white
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 border-t border-white/[0.05] pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="!text-[7px] font-bold uppercase tracking-[0.16em] text-violet-400">
                NovaVault
              </p>

              <h2 className="nv-display mt-1 text-sm font-bold text-white">
                Enter the Vault.
              </h2>
            </div>

            <Link
              to="/games"
              className="
                inline-flex
                min-h-7
                shrink-0
                items-center
                gap-1
                rounded-lg
                border border-violet-400/20
                bg-violet-500/[0.08]
                px-2.5
                !text-[7px]
                font-bold
                uppercase
                tracking-[0.07em]
                text-violet-300
                transition
                hover:border-violet-400/35
                hover:bg-violet-500/[0.14]
              "
            >
              Store
              <ArrowUpRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM BAR
          ========================================================= */}
      <div className="border-t border-white/[0.05]">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-2
            px-4
            py-3
            sm:px-6
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-8
          "
        >
          <p className="!text-[7px] font-medium uppercase tracking-[0.08em] text-slate-700">
            © {new Date().getFullYear()} NovaVault. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              to="/support"
              className="
                !text-[7px]
                font-medium
                uppercase
                tracking-[0.06em]
                text-slate-700
                transition-colors
                hover:text-slate-400
              "
            >
              Privacy
            </Link>

            <Link
              to="/support"
              className="
                !text-[7px]
                font-medium
                uppercase
                tracking-[0.06em]
                text-slate-700
                transition-colors
                hover:text-slate-400
              "
            >
              Terms
            </Link>

            <span className="!text-[7px] font-medium uppercase tracking-[0.06em] text-slate-800">
              Built for gamers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;