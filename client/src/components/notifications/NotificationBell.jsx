import { Check, Gift, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import useNotifications from "../../context/useNotifications";

function NotificationBell() {
  const { notifications, unreadCount, notificationLoading, markAsRead } =
    useNotifications();

  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification._id);
      } catch {
        // Keep the dropdown usable if marking as read fails.
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Gift notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
      >
        <Gift className="h-4 w-4" />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#05070d]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed left-3 right-3 top-[58px]
              z-50 overflow-hidden
              rounded-xl border border-white/10
            bg-[#090c16] shadow-2xl shadow-black/50

              sm:left-auto sm:right-4
              sm:top-[58px]
              sm:w-[280px]

              lg:absolute lg:right-0 lg:top-11
            "
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
              <div>
                <p className="text-xs font-semibold text-white">Gifts</p>

                <p className="mt-0.5 !text-[9px] text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} new gift${unreadCount === 1 ? "" : "s"}`
                    : "No new gifts"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {notificationLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
                  <p className="mt-3 text-xs text-slate-500">
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10">
                    <Gift className="h-4 w-4 text-violet-400" />
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-300">
                    No gifts yet
                  </p>

                  <p className="mt-1 text-[9px] text-slate-600">
                    Gifts from other NovaVault users will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const game = notification.game;
                  const sender = notification.sender;

                  return (
                    <div
                      key={notification._id}
                      className={`border-b border-white/[0.06] px-3 py-2.5 transition ${
                        notification.read
                          ? "bg-transparent"
                          : "bg-violet-500/[0.06]"
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <Gift className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-white">
                              {notification.title}
                            </p>

                            {!notification.read && (
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                            {notification.message}
                          </p>

                          {game && (
                            <Link
                              to={`/games/${game.slug}`}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 transition hover:text-violet-300"
                            >
                              View {game.title}
                            </Link>
                          )}

                          {sender && (
                            <p className="mt-1 text-[9px] text-slate-600">
                              From {sender.name || sender.email}
                            </p>
                          )}

                          {!notification.read && (
                            <button
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className="mt-2 inline-flex items-center gap-1 text-[9px] font-medium text-slate-500 transition hover:text-white"
                            >
                              <Check className="h-3 w-3" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;
