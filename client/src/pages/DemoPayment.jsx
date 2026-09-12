import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Gamepad2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { completeDemoPayment } from "../services/paymentApi";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function DemoPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialOrder = location.state?.order || null;

  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => Number(order?.total || 0),
    [order],
  );

  useEffect(() => {
    if (!initialOrder) {
      navigate("/orders", { replace: true });
    }
  }, [initialOrder, navigate]);

  if (!initialOrder) {
    return null;
  }

  const handleDemoPayment = async () => {
    if (!order?._id || loading || success) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await completeDemoPayment(order._id);

      setOrder(data.order);
      setSuccess(true);

      setTimeout(() => {
        navigate("/order-success", {
          replace: true,
          state: {
            order: data.order,
          },
        });
      }, 900);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to complete the demo payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      {/* Ambient gaming background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] size-56 rounded-full bg-violet-600/[0.07] blur-[100px]" />
        <div className="absolute bottom-[5%] right-[8%] size-72 rounded-full bg-fuchsia-600/[0.05] blur-[120px]" />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:44px_44px]
          "
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1040px]">
        {/* Back */}
        <Link
          to="/checkout"
          className="
            inline-flex
            items-center
            gap-1.5
            !text-[9px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-slate-600
            transition
            hover:text-slate-300
          "
        >
          <ArrowLeft className="size-3.5" />
          Back to checkout
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5"
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-lg
                border border-violet-400/15
                bg-violet-500/[0.08]
                text-violet-400
              "
            >
              <Zap className="size-4" />
            </div>

            <div>
              <p className="!text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400">
                NovaVault Secure
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Complete your payment
              </h1>
            </div>
          </div>

          <p className="mt-2 max-w-lg !text-[10px] leading-5 text-slate-600 sm:!text-[11px]">
            Finish your game purchase through the NovaVault demo
            payment experience.
          </p>
        </motion.header>

        {/* Payment Layout */}
        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left */}
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="
              overflow-hidden
              rounded-2xl
              border border-white/[0.07]
              bg-[#080B15]/90
              backdrop-blur-xl
            "
          >
            {/* Panel Header */}
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WalletCards className="size-4 text-violet-400" />

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                    NovaVault Demo Payment
                  </h2>
                </div>

                <span className="rounded-full bg-violet-500/[0.08] px-2.5 py-1 !text-[7px] font-bold uppercase tracking-[0.12em] text-violet-300">
                  Test Mode
                </span>
              </div>
            </div>

            {/* Payment visual */}
            <div className="p-5 sm:p-7">
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border border-violet-400/15
                  bg-gradient-to-br
                  from-violet-950/40
                  via-[#0B0D1A]
                  to-fuchsia-950/20
                  p-5
                  sm:p-7
                "
              >
                <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-violet-500/[0.12] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="!text-[8px] font-bold uppercase tracking-[0.18em] text-violet-300/70">
                        Amount to pay
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {formatPrice(total)}
                      </p>
                    </div>

                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20">
                      <Gamepad2 className="size-5 text-violet-300" />
                    </div>
                  </div>

                  <div className="mt-6 h-px bg-white/[0.08]" />

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                      <ShieldCheck className="size-4" />
                    </div>

                    <div>
                      <p className="!text-[9px] font-semibold text-slate-300">
                        Protected demo transaction
                      </p>

                      <p className="mt-0.5 !text-[8px] text-slate-600">
                        No real payment details are collected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo payment information */}
              <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-400" />

                  <div>
                    <p className="!text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300">
                      Demo payment
                    </p>

                    <p className="mt-1 !text-[9px] leading-4 text-slate-600">
                      This prototype simulates a successful payment.
                      No bank account, card, UPI ID, or real money is
                      involved.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    mt-4
                    rounded-xl
                    border border-red-400/15
                    bg-red-500/[0.06]
                    px-4
                    py-3
                  "
                  role="alert"
                >
                  <p className="!text-[9px] leading-4 text-red-300">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Pay button */}
              <button
                type="button"
                onClick={handleDemoPayment}
                disabled={loading || success}
                className="
                  mt-5
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-violet-600
                  px-5
                  !text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  shadow-lg
                  shadow-violet-950/20
                  transition-all
                  duration-200
                  hover:bg-violet-500
                  hover:shadow-violet-950/40
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-400/50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {success ? (
                  <>
                    <Check className="size-4" />
                    Payment Successful
                  </>
                ) : loading ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <LockKeyhole className="size-3.5" />
                    Pay {formatPrice(total)}
                  </>
                )}
              </button>
            </div>
          </motion.section>

          {/* Right */}
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="
              h-fit
              rounded-2xl
              border border-white/[0.07]
              bg-[#080B15]/90
              p-5
              backdrop-blur-xl
              lg:sticky
              lg:top-20
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="!text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  Order
                </p>

                <h2 className="mt-1 text-[13px] font-bold text-white">
                  #{order._id.slice(-8).toUpperCase()}
                </h2>
              </div>

              <div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <Gamepad2 className="size-4 text-violet-400" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.game || item._id}
                  className="flex items-center gap-3"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Gamepad2 className="size-4 text-slate-700" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate !text-[10px] font-semibold text-slate-300">
                      {item.title}
                    </p>

                    <p className="mt-0.5 !text-[8px] text-slate-600">
                      Digital ownership
                    </p>
                  </div>

                  <span className="shrink-0 !text-[10px] font-semibold text-white">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-white/[0.06]" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="!text-[9px] text-slate-600">
                  Subtotal
                </span>

                <span className="!text-[10px] text-slate-400">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="!text-[9px] text-slate-600">
                  Discount
                </span>

                <span className="!text-[10px] text-emerald-400">
                  -{formatPrice(order.discount)}
                </span>
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Total
                  </span>

                  <span className="text-lg font-bold text-white">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] px-3 py-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-400/70" />

                <p className="!text-[8px] leading-4 text-slate-600">
                  Payment is simulated securely on the NovaVault
                  server. Your game ownership is granted only after
                  the server confirms the transaction.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

export default DemoPayment;