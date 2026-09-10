import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Gamepad2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { createOrder } from "../services/orderApi";
import { useStore } from "../context/useStore";

function Checkout() {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0,
  );

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const handlePlaceOrder = async () => {
    if (!cart.length || loading) {
      return;
    }

    setError("");

    try {
      setLoading(true);

      const items = cart.map((item) => ({
        game: item.id,
        quantity: item.quantity,
      }));

      const data = await createOrder(items);

      setCreatedOrder(data.order || null);
      clearCart();
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to create your order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // ORDER CREATED
  // ==========================================================

  if (createdOrder) {
    return (
      <section className="min-h-screen min-w-0 px-4 py-8 sm:px-6 lg:px-7">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-[700px] items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              w-full
              rounded-2xl
              border border-white/[0.07]
              bg-[#080B15]/90
              p-6
              text-center
              shadow-2xl shadow-black/40
              backdrop-blur-2xl
              sm:p-8
            "
          >
            <div
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-2xl
                border border-emerald-400/15
                bg-emerald-500/[0.07]
                text-emerald-400
              "
            >
              <CheckCircle2 className="size-7" />
            </div>

            <p
              className="
                mt-5
                !text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-emerald-400/80
              "
            >
              Order Created
            </p>

            <h1
              className="
                nv-display
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-white
                sm:text-3xl
              "
            >
              Your order is ready
            </h1>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                !text-[10px]
                leading-5
                text-slate-500
              "
            >
              Your NovaVault order has been created successfully.
              Payment integration will be connected next.
            </p>

            <div
              className="
                mx-auto
                mt-6
                max-w-sm
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.02]
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                  Order ID
                </span>

                <span className="max-w-[190px] truncate text-[9px] font-medium text-slate-400">
                  {createdOrder._id}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                  Total
                </span>

                <span className="text-[14px] font-bold text-white">
                  {formatPrice(createdOrder.total)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                  Status
                </span>

                <span className="rounded-full bg-amber-500/[0.08] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-amber-400">
                  {createdOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                to="/games"
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-600
                  px-5
                  !text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition-all
                  hover:bg-violet-500
                "
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-lg
                  border border-white/[0.07]
                  bg-white/[0.02]
                  px-5
                  !text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  transition-all
                  hover:border-white/[0.12]
                  hover:bg-white/[0.04]
                  hover:text-slate-300
                "
              >
                Back Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (!cart.length) {
    return (
      <section className="min-h-screen min-w-0 px-4 py-8 sm:px-6 lg:px-7">
        <div className="mx-auto flex min-h-[65vh] w-full max-w-[600px] items-center justify-center">
          <div
            className="
              w-full
              rounded-2xl
              border border-white/[0.06]
              bg-[#080B15]/70
              px-6
              py-10
              text-center
              backdrop-blur-xl
            "
          >
            <div
              className="
                mx-auto
                flex
                size-12
                items-center
                justify-center
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.02]
                text-slate-600
              "
            >
              <ShoppingBag className="size-5" />
            </div>

            <h1 className="nv-display mt-4 text-xl font-bold text-white">
              Your checkout is empty
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-[10px] leading-relaxed text-slate-600">
              Add games to your cart before continuing to checkout.
            </p>

            <Link
              to="/games"
              className="
                mt-5
                inline-flex
                h-9
                items-center
                rounded-lg
                bg-violet-600
                px-4
                !text-[9px]
                font-semibold
                uppercase
                tracking-[0.07em]
                text-white
                transition
                hover:bg-violet-500
              "
            >
              Explore Games
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // CHECKOUT
  // ==========================================================

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/cart"
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
            Back to cart
          </Link>

          <div className="mt-4">
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
              <LockKeyhole className="size-3" />
              Secure Checkout
            </p>

            <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Review your order
            </h1>

            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 sm:text-[12px]">
              Confirm your games before creating the order.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* =================================================
              ITEMS
          ================================================== */}
          <div className="min-w-0">
            <div
              className="
                overflow-hidden
                rounded-xl
                border border-white/[0.06]
                bg-[#080B15]/80
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.06]
                  px-4
                  py-3
                "
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-violet-400" />

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-300">
                    Your games
                  </h2>
                </div>

                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                      px-3
                      py-3
                      sm:px-4
                    "
                  >
                    {/* Artwork */}
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.03] sm:h-16 sm:w-12">
                      <img
                        src={item.portraitImage || item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[11px] font-semibold text-white sm:text-[12px]">
                        {item.title}
                      </h3>

                      <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.08em] text-slate-600">
                        {item.genre}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex shrink-0 items-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity - 1,
                          )
                        }
                        disabled={loading}
                        className="
                          flex
                          size-7
                          items-center
                          justify-center
                          text-slate-600
                          transition
                          hover:text-white
                          disabled:pointer-events-none
                          disabled:opacity-40
                        "
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center text-[9px] font-semibold text-slate-300">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        disabled={loading}
                        className="
                          flex
                          size-7
                          items-center
                          justify-center
                          text-slate-600
                          transition
                          hover:text-white
                          disabled:pointer-events-none
                          disabled:opacity-40
                        "
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <div className="hidden w-20 shrink-0 text-right sm:block">
                      <p className="text-[11px] font-semibold text-white">
                        {formatPrice(
                          item.price * item.quantity,
                        )}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      aria-label={`Remove ${item.title}`}
                      className="
                        flex
                        size-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-700
                        transition
                        hover:bg-red-500/[0.06]
                        hover:text-red-400
                        disabled:pointer-events-none
                        disabled:opacity-40
                      "
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2.5">
              <ShieldCheck className="size-4 shrink-0 text-emerald-400/70" />

              <p className="!text-[8px] leading-4 text-slate-600">
                Your order is securely created using your authenticated
                NovaVault account. Payment details are not collected on
                this step.
              </p>
            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================== */}
          <aside
            className="
              h-fit
              rounded-xl
              border border-white/[0.06]
              bg-[#080B15]/80
              p-4
              backdrop-blur-xl
              lg:sticky
              lg:top-20
            "
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-violet-400" />

              <h2 className="text-[13px] font-bold uppercase tracking-[0.1em] text-slate-300">
                Order Summary
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">
                  Items
                </span>

                <span className="text-[11px] font-medium text-slate-400">
                  {cartCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">
                  Subtotal
                </span>

                <span className="text-[11px] font-semibold text-slate-300">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">
                  Payment
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.05em] text-emerald-400/80">
                  Next step
                </span>
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Total
                  </span>

                  <span className="text-[17px] font-bold text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mt-4
                  rounded-lg
                  border
                  border-red-400/15
                  bg-red-500/[0.06]
                  px-3
                  py-2.5
                "
                role="alert"
              >
                <p className="!text-[9px] leading-4 text-red-300">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="
                mt-5
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-violet-600
                px-4
                !text-[9px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                transition-all
                duration-200
                hover:bg-violet-500
                hover:shadow-lg
                hover:shadow-violet-950/30
                active:scale-[0.99]
                focus:outline-none
                focus:ring-2
                focus:ring-violet-400/50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-3.5 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <LockKeyhole className="size-3.5" />
                  Create Order
                </>
              )}
            </button>

            <p className="mt-3 text-center !text-[7px] leading-4 text-slate-700">
              By continuing, your order will be created with the
              current server-side game prices.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;