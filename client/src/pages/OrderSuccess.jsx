import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  Home,
  PackageCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <PackageCheck className="mx-auto mb-4 h-10 w-10 text-violet-400" />

          <h1 className="text-lg font-semibold text-white">
            Order information unavailable
          </h1>

          <p className="mt-2 text-xs text-slate-500">
            We couldn't find the order details for this page.
          </p>

          <Link
            to="/"
            className="
              mt-6
              inline-flex
              h-10
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
            <Home className="h-3.5 w-3.5" />
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          w-full
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#080B15]
          p-6
          text-center
          shadow-2xl
          shadow-black/20
          sm:p-8
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            border
            border-emerald-400/20
            bg-emerald-400/10
          "
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>

        <p className="mt-6 !text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
          NovaVault Order
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Order Created Successfully
        </h1>

        <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-slate-400">
          Your order has been created and is currently awaiting payment.
        </p>

        <div className="mx-auto mt-7 max-w-md rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-left">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="!text-[10px] uppercase tracking-wider text-slate-500">
              Order ID
            </span>

            <span className="max-w-[190px] truncate !text-[10px] font-medium text-slate-300">
              {order._id}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="!text-[10px] uppercase tracking-wider text-slate-500">
              Total
            </span>

            <span className="text-sm font-semibold text-white">
              ₹{Number(order.total || 0).toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="!text-[10px] uppercase tracking-wider text-slate-500">
              Status
            </span>

            <span className="rounded-full bg-amber-400/10 px-2.5 py-1 !text-[8px] font-semibold uppercase tracking-wider text-amber-400">
              {order.paymentStatus || "pending"}
            </span>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/games"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.03]
              px-5
              !text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-slate-300
              transition-all
              duration-200
              hover:border-white/[0.14]
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="
              inline-flex
              h-10
              items-center
              justify-center
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
              hover:shadow-lg
              hover:shadow-violet-950/20
            "
          >
            Back Home
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;