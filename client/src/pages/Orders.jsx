import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  Package,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { getMyOrders } from "../services/orderApi";
import {
  retryRazorpayPayment,
  verifyRazorpayPayment,
} from "../services/paymentApi";

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusIcon(status) {
  if (status === "completed") {
    return CircleCheck;
  }

  return Clock3;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingOrderId, setRetryingOrderId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (!cancelled) {
          setOrders(data.orders || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Unable to load your orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const handleRetryPayment = async (order) => {
    if (!order?._id || order.paymentStatus === "paid" || retryingOrderId) {
      return;
    }

    try {
      setRetryingOrderId(order._id);
      setError("");

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is not loaded. Please open Checkout and try again.",
        );
      }

      const razorpayData = await retryRazorpayPayment(order._id);

      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "NovaVault",
        description: "Game purchase",
        order_id: razorpayData.razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            const verificationData = await verifyRazorpayPayment({
              novaVaultOrderId: order._id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            setOrders((currentOrders) =>
              currentOrders.map((currentOrder) =>
                currentOrder._id === order._id
                  ? verificationData.order
                  : currentOrder,
              ),
            );

            setRetryingOrderId(null);
          } catch (verificationError) {
            setRetryingOrderId(null);

            setError(
              verificationError.message ||
                "Payment verification failed. Please contact support if your payment was deducted.",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setRetryingOrderId(null);
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setRetryingOrderId(null);

        setError(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (requestError) {
      setRetryingOrderId(null);

      setError(
        requestError.message ||
          "Unable to start the payment. Please try again.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <p className="!text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
          Your Account
        </p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Order History
            </h1>

            <p className="mt-1 !text-[11px] text-slate-500">
              View your NovaVault purchases and order status.
            </p>
          </div>

          <Package className="hidden h-6 w-6 text-slate-600 sm:block" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                h-28
                animate-pulse
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
              "
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="
            rounded-xl
            border
            border-red-400/10
            bg-red-400/[0.03]
            px-5
            py-8
            text-center
          "
        >
          <Package className="mx-auto h-8 w-8 text-red-400/70" />

          <h2 className="mt-3 text-sm font-semibold text-white">
            Unable to load orders
          </h2>

          <p className="mt-1 !text-[11px] text-slate-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div
          className="
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.02]
            px-5
            py-14
            text-center
          "
        >
          <Package className="mx-auto h-9 w-9 text-slate-600" />

          <h2 className="mt-4 text-sm font-semibold text-white">
            No orders yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm !text-[11px] leading-5 text-slate-500">
            Your game purchases will appear here once you place your first
            order.
          </p>

          <Link
            to="/games"
            className="
              mt-5
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
            Browse Games
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Orders */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
              >
                <div
                  className="
                    group
                    block
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-[#080B15]
                    p-4
                    transition-all
                    duration-200
                    hover:border-violet-400/20
                    hover:bg-white/[0.025]
                  "
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white/[0.07]
                            bg-white/[0.03]
                          "
                        >
                          <Receipt className="h-4 w-4 text-violet-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="!text-[11px] font-semibold text-white">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1 !text-[9px] text-slate-500">
                              <CalendarDays className="h-3 w-3" />
                              {formatDate(order.createdAt)}
                            </span>

                            <span className="!text-[9px] text-slate-600">
                              {order.items?.length || 0}{" "}
                              {order.items?.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="!text-[9px] uppercase tracking-wider text-slate-600">
                          Total
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-white">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.paymentStatus === "pending" && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleRetryPayment(order);
                            }}
                            disabled={retryingOrderId === order._id}
                            className="
                              inline-flex h-7 items-center
                              justify-center rounded-lg
                              border border-violet-400/15
                              bg-violet-500/[0.08]
                              px-2.5 !text-[8px]
                              font-semibold uppercase
                              tracking-wider text-violet-300
                              transition-all duration-200
                              hover:border-violet-400/25
                              hover:bg-violet-500/[0.14]
                              hover:text-violet-200
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {retryingOrderId === order._id
                              ? "Processing..."
                              : "Pay Again"}
                          </button>
                        )}

                        <span
                          className={`
                            inline-flex items-center
                            gap-1.5 rounded-full
                            px-2.5 py-1 !text-[8px]
                            font-semibold uppercase
                            tracking-wider
                            ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-amber-400/10 text-amber-400"
                            }
                          `}
                        >
                          <StatusIcon className="h-3 w-3" />

                          {order.paymentStatus === "paid"
                            ? "PAID"
                            : order.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>

                        <Link
                          to={`/orders/${order._id}`}
                          aria-label={`View order ${order._id.slice(-8)}`}
                        >
                          <ChevronRight
                            className="
                              h-4 w-4 text-slate-600
                              transition-transform
                              duration-200
                              hover:text-violet-400
                              group-hover:translate-x-0.5
                            "
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
