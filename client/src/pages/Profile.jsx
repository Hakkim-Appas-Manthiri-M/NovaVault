import {
  CalendarDays,
  Library,
  Heart,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  UserRound,
  Gamepad2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import useAuth from "../context/useAuth";

function Profile() {
  const { user } = useAuth();

  const displayName = user?.name || "NovaVault User";
  const email = user?.email || "No email available";
  const role = user?.role || "user";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
            Account
          </p>

          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Profile
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Manage your NovaVault account and gaming profile.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0f1a]"
        >
          {/* Cover */}
          <div className="relative h-28 overflow-hidden bg-gradient-to-r from-violet-950/50 via-[#101525] to-indigo-950/40 sm:h-36">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.12),transparent_35%)]" />
          </div>

          {/* Profile Information */}
          <div className="relative px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-[#0b0f1a] bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-xl shadow-violet-950/30 sm:h-24 sm:w-24 sm:text-2xl">
                  {initials || <UserRound size={28} />}
                </div>

                <div className="pb-1">
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    {displayName}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Mail size={12} />
                    <span>{email}</span>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="flex w-fit items-center gap-2 rounded-lg border border-violet-500/15 bg-violet-500/[0.06] px-3 py-2">
                <ShieldCheck size={13} className="text-violet-400" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-violet-300">
                  {role}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <CalendarDays size={15} />
                </div>

                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                  Member Since
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-200">
                  {joinedDate}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Gamepad2Icon size={15} />
                </div>

                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                  Account Type
                </p>

                <p className="mt-1 text-xs font-semibold capitalize text-slate-200">
                  {role}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-1">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={15} />
                </div>

                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
                  Account Status
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-400">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Account Shortcuts */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-5"
        >
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">
              Account shortcuts
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Link
              to="/library"
              className="group rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 transition-all duration-200 hover:border-violet-500/20 hover:bg-white/[0.025]"
            >
              <Library
                size={17}
                className="text-violet-400 transition-transform duration-200 group-hover:scale-110"
              />

              <p className="mt-3 text-xs font-semibold text-slate-200">
                Library
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Your games
              </p>
            </Link>

            <Link
              to="/wishlist"
              className="group rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 transition-all duration-200 hover:border-violet-500/20 hover:bg-white/[0.025]"
            >
              <Heart
                size={17}
                className="text-pink-400 transition-transform duration-200 group-hover:scale-110"
              />

              <p className="mt-3 text-xs font-semibold text-slate-200">
                Wishlist
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Saved games
              </p>
            </Link>

            <Link
              to="/cart"
              className="group rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 transition-all duration-200 hover:border-violet-500/20 hover:bg-white/[0.025]"
            >
              <Package
                size={17}
                className="text-amber-400 transition-transform duration-200 group-hover:scale-110"
              />

              <p className="mt-3 text-xs font-semibold text-slate-200">
                Cart
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Current items
              </p>
            </Link>

            <Link
              to="/settings"
              className="group rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 transition-all duration-200 hover:border-violet-500/20 hover:bg-white/[0.025]"
            >
              <Settings
                size={17}
                className="text-slate-400 transition-transform duration-200 group-hover:rotate-45"
              />

              <p className="mt-3 text-xs font-semibold text-slate-200">
                Settings
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Account settings
              </p>
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default Profile;