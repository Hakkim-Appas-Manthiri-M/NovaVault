import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { getOrderById } from "../services/orderApi";

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(orderId);

        if (!cancelled) {
          setOrder(data.order || null);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Unable to load order details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      loadOrder();
    }

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-white/[0.04]" />
          <div className="h-32 rounded-xl border border-white/[0.06] bg-white/[0.02]" />
          <div className="h-64 rounded-xl border border-white/[0.06] bg-white/[0.02]" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-white/[0.07] bg-[#080B15] px-6 py-12 text-center">
          <Package className="mx-auto h-9 w-9 text-slate-600" />

          <h1 className="mt-4 text-base font-semibold text-white">
            Order not found
          </h1>

          <p className="mt-2 !text-[11px] leading-5 text-slate-500">
            {error || "We couldn't find this order."}
          </p>

          <Link
            to="/orders"
            className="
              mt-6
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              bg-violet-600
              px-5
              !text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              transition-all
              duration-200
              hover:bg-violet-500
            "
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const isCompleted = order.status === "completed";
  const isPaid = order.paymentStatus === "paid";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        to="/orders"
        className="
          mb-5
          inline-flex
          items-center
          gap-2
          !text-[10px]
          font-medium
          text-slate-500
          transition-colors
          hover:text-white
        "
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Orders
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <p className="!text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
          Order Details
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>

            <p className="mt-1 flex items-center gap-1.5 !text-[10px] text-slate-500">
              <CalendarDays className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              px-3
              py-1.5
              !text-[8px]
              font-semibold
              uppercase
              tracking-wider
              ${
                isCompleted
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-amber-400/10 text-amber-400"
              }
            `}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clock3 className="h-3.5 w-3.5" />
            )}

            {order.status || "pending"}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#080B15]
          "
        >
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-violet-400" />

              <h2 className="text-sm font-semibold text-white">
                Purchased Items
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {order.items?.map((item) => (
              <div
                key={item.game || item._id}
                className="flex gap-4 p-4 sm:p-5"
              >
                {/* Artwork */}
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03] sm:h-24 sm:w-16">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-semibold text-white sm:text-sm">
                    {item.title}
                  </h3>

                  <p className="mt-1 !text-[9px] text-slate-600">
                    {item.slug || "Digital game"}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="!text-[9px] text-slate-500">
                      Quantity:{" "}
                      <span className="text-slate-300">{item.quantity}</span>
                    </span>

                    <span className="!text-[9px] text-slate-500">
                      Unit price:{" "}
                      <span className="text-slate-300">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Item total */}
                <div className="shrink-0 text-right">
                  <p className="!text-[9px] uppercase tracking-wider text-slate-600">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    ₹{Number(item.subtotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#080B15] p-5">
            <h2 className="text-sm font-semibold text-white">Order Summary</h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="!text-[10px] text-slate-500">Subtotal</span>

                <span className="!text-[10px] text-slate-300">
                  ₹{Number(order.subtotal || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="!text-[10px] text-slate-500">Discount</span>

                <span className="!text-[10px] text-emerald-400">
                  -₹{Number(order.discount || 0).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Total
                  </span>

                  <span className="text-base font-bold text-white">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#080B15] p-5">
            <h2 className="text-sm font-semibold text-white">Payment</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="!text-[10px] text-slate-500">Status</span>

                <span
                  className={`
                    rounded-full
                    px-2.5
                    py-1
                    !text-[8px]
                    font-semibold
                    uppercase
                    tracking-wider
                    ${
                      isPaid
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-amber-400/10 text-amber-400"
                    }
                  `}
                >
                  {order.paymentStatus === "paid"
                    ? "PAID"
                    : order.paymentStatus === "failed"
                      ? "PAYMENT FAILED"
                      : order.paymentStatus === "refunded"
                        ? "REFUNDED"
                        : "PAYMENT PENDING"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="!text-[10px] text-slate-500">Provider</span>

                <span className="!text-[10px] text-slate-300">
                  {order.paymentProvider === "demo"
                    ? "NovaVault Demo"
                    : order.paymentProvider || "Not paid"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="!text-[10px] text-slate-500">Currency</span>

                <span className="!text-[10px] text-slate-300">
                  {order.currency || "INR"}
                </span>
              </div>
            </div>
          </section>

          {/* Created */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#080B15] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />

              <div>
                <p className="!text-[10px] font-semibold text-slate-300">
                  Order secured
                </p>

                <p className="mt-1 !text-[9px] leading-4 text-slate-600">
                  Created {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
