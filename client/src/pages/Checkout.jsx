import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Gamepad2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { createOrder } from "../services/orderApi";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/paymentApi";
import { useStore } from "../context/useStore";

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartCount, removeFromCart, updateCartQuantity, clearCart } =
    useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [razorpayReady, setRazorpayReady] = useState(false);

  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setRazorpayReady(true));
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayReady(true);
    };

    script.onerror = () => {
      setError("Unable to load the payment gateway. Please try again.");
    };

    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

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

    if (!razorpayReady || !window.Razorpay) {
      setError("Payment gateway is still loading. Please try again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Create or reuse NovaVault order
      let novaVaultOrder = pendingOrder;

      if (!novaVaultOrder) {
        const items = cart.map((item) => ({
          game: item.id,
          quantity: item.quantity,
        }));

        const orderData = await createOrder(items);

        novaVaultOrder = orderData.order;
        setPendingOrder(novaVaultOrder);
      }

      // 2. Create or reuse Razorpay order
      const razorpayData = await createRazorpayOrder(novaVaultOrder._id);

      // 3. Open Razorpay Checkout
      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "NovaVault",
        description: "Game purchase",
        order_id: razorpayData.razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            setError("");

            const verificationData = await verifyRazorpayPayment({
              novaVaultOrderId: novaVaultOrder._id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            clearCart();
            setPendingOrder(null);

            navigate("/order-success", {
              state: {
                order: verificationData.order,
              },
            });
          } catch (verificationError) {
            setLoading(false);

            setError(
              verificationError.message ||
                "Payment verification failed. Please contact support if your payment was deducted.",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);

            setError(
              "Payment was cancelled. Your order is still available to retry.",
            );
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setLoading(false);

        setError(
          response.error?.description ||
            "Payment failed. Your order is still available to retry.",
        );
      });

      razorpay.open();
    } catch (requestError) {
      setLoading(false);

      setError(
        requestError.message ||
          "Unable to start the payment. Please try again.",
      );
    }
  };

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
                          updateCartQuantity(item.id, item.quantity - 1)
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
                          updateCartQuantity(item.id, item.quantity + 1)
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
                        {formatPrice(item.price * item.quantity)}
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
                NovaVault account. Payment details are not collected on this
                step.
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
                <span className="text-[10px] text-slate-600">Items</span>

                <span className="text-[11px] font-medium text-slate-400">
                  {cartCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Subtotal</span>

                <span className="text-[11px] font-semibold text-slate-300">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Payment</span>

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
                <p className="!text-[9px] leading-4 text-red-300">{error}</p>
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
                  Processing...
                </>
              ) : (
                <>
                  <LockKeyhole className="size-3.5" />
                  {pendingOrder ? "Retry Payment" : "Pay Now"}
                </>
              )}
            </button>

            <p className="mt-3 text-center !text-[7px] leading-4 text-slate-700">
              By continuing, your order will be created using the current
              server-side game prices and paid securely through Razorpay.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
