import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useStore } from "../context/useStore";

function Cart() {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useStore();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                <ShoppingCart className="size-3" />
                Your Vault
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Shopping Cart
              </h1>

              <p className="mt-1.5 max-w-xl text-[10px] leading-relaxed text-slate-500 sm:text-[13px]">
                Review your games before adding them to your vault.
              </p>
            </div>

            {cartCount > 0 && (
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"}
                </span>

                <button
                  type="button"
                  onClick={clearCart}
                  className="
                    flex h-8 items-center gap-1.5
                    rounded-lg
                    border border-white/[0.06]
                    bg-white/[0.02]
                    px-2.5
                    !text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.05em]
                    text-slate-500
                    transition-all duration-200
                    hover:border-red-500/20
                    hover:bg-red-500/[0.06]
                    hover:text-red-400
                  "
                >
                  <Trash2 className="size-3" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 ? (
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
            {/* Cart Items */}
            <div className="min-w-0 space-y-2.5">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="
                    flex min-w-0 items-center gap-2
                    rounded-xl
                    border border-white/[0.06]
                    bg-[#080B15]/80
                    p-2.5
                    backdrop-blur-xl
                  "
                >
                  {/* Artwork */}
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.03] sm:h-24 sm:w-16">
                    <img
                      src={item.portraitImage}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[12px] font-semibold text-white sm:text-[13px]">
                      {item.title}
                    </h2>

                    <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.08em] text-slate-600">
                      {item.genre}
                    </p>

                    <p className="mt-2 text-[11px] font-semibold text-slate-300">
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
                          item.quantity - 1
                        )
                      }
                      aria-label={`Decrease ${item.title} quantity`}
                      className="
                        flex size-7 items-center justify-center
                        text-slate-500
                        transition-colors
                        hover:text-white
                      "
                    >
                      <Minus className="size-3" />
                    </button>

                    <span className="flex min-w-6 items-center justify-center text-[10px] font-semibold text-slate-300">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      aria-label={`Increase ${item.title} quantity`}
                      className="
                        flex size-7 items-center justify-center
                        text-slate-500
                        transition-colors
                        hover:text-white
                      "
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="hidden w-20 shrink-0 text-right sm:block">
                    <p className="text-[11px] font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                    className="
                      flex size-7 shrink-0
                      items-center justify-center
                      rounded-lg
                      text-slate-600
                      transition-all duration-200
                      hover:bg-red-500/[0.06]
                      hover:text-red-400
                    "
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </article>
              ))}
            </div>

            {/* Summary */}
            <aside
              className="
                h-fit rounded-xl
                border border-white/[0.06]
                bg-[#080B15]/80
                p-4
                backdrop-blur-xl
                lg:sticky lg:top-20
              "
            >
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-violet-400">
                Order Summary
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">
                    Items
                  </span>

                  <span className="text-[12px] font-medium text-slate-400">
                    {cartCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">
                    Subtotal
                  </span>

                  <span className="text-[12px] font-semibold text-slate-300">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Total
                    </span>

                    <span className="text-[15px] font-bold text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="
                  mt-5 flex h-10 w-full
                  items-center justify-center
                  rounded-lg
                  bg-violet-600
                  !text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  opacity-50
                  cursor-not-allowed
                "
              >
                Checkout Coming Soon
              </button>

              <Link
                to="/games"
                className="
                  mt-2 flex h-9 w-full
                  items-center justify-center
                  rounded-lg
                  border border-white/[0.06]
                  bg-white/[0.02]
                  !text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-slate-500
                  transition-all duration-200
                  hover:border-white/[0.1]
                  hover:bg-white/[0.04]
                  hover:text-slate-300
                "
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        ) : (
          /* Empty Cart */
          <div
            className="
              flex min-h-[320px]
              flex-col items-center justify-center
              rounded-xl
              border border-dashed border-white/[0.07]
              bg-[#080B15]/50
              px-6
              text-center
            "
          >
            <div
              className="
                mb-4 flex size-12
                items-center justify-center
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.02]
                text-slate-600
              "
            >
              <ShoppingCart className="size-5" />
            </div>

            <h2 className="nv-display text-[15px] font-bold text-slate-300">
              Your cart is empty
            </h2>

            <p className="mt-1.5 max-w-sm text-[10px] leading-relaxed text-slate-600">
              Add games from the store and they’ll appear here.
            </p>

            <Link
              to="/games"
              className="
                mt-5 flex h-8 items-center
                rounded-lg
                bg-violet-600
                px-3
                !text-[9px]
                font-semibold
                uppercase
                tracking-[0.06em]
                text-white
                shadow-lg shadow-violet-950/20
                transition-all duration-200
                hover:bg-violet-500
              "
            >
              Explore Games
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;