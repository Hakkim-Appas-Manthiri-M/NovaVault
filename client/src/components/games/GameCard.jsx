import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/useStore";

function GameCard({ game }) {
  const { toggleWishlist, isWishlisted, addToCart, isInCart, } = useStore();

const wishlisted = isWishlisted(game.id);

const inCart = isInCart(game.id);

  const hasDiscount =
    Number(game.discount) > 0 && Number(game.originalPrice) > game.price;

  return (
    <article
      className="
        group relative w-full overflow-hidden rounded-xl
        border border-white/[0.07]
        bg-[#090D19]
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:-translate-y-1
        hover:border-violet-400/20
        hover:shadow-violet-950/20
        motion-reduce:transform-none
      "
    >
      {/* Artwork */}
      <Link
        to={`/games/${game.id}`}
        className="
          relative block aspect-[5/6]
          overflow-hidden bg-[#0B0F1C]
        "
      >
        <img
          src={game.portraitImage ?? game.image}
          alt={game.title}
          loading="lazy"
          className="
            h-full w-full object-cover object-[center_30%]
            transition-transform duration-500 ease-out
            group-hover:scale-[1.045]
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        />

        {/* Artwork gradient */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t
            from-[#090D19]
            via-transparent
            to-black/10
            opacity-90
          "
        />

        {/* Hover glow */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-violet-500/[0.04]
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        {/* Discount */}
        {hasDiscount && (
          <span
            className="
              absolute left-3 top-3
              rounded-md
              bg-violet-600
              px-2 py-1
              text-[8px] font-bold
              tracking-wide text-white
              shadow-lg shadow-violet-950/30
            "
          >
            -{game.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${game.title} to wishlist`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist(game);
          }}
          className="
            absolute right-3 top-3
            flex size-8 items-center justify-center
            rounded-lg
            border border-white/10
            bg-black/35
            text-slate-300
            backdrop-blur-md
            transition-all duration-200
            hover:border-violet-400/30
            hover:bg-violet-500/15
            hover:text-white
            active:scale-95
          "
        >
          <Heart className={["size-3.5 transition-all duration-200", wishlisted ? "fill-violet-600 text-violet-600" : "text-slate-300", ].join(" ") }/>
        </button>
      </Link>

      {/* Card information */}
      <div className="relative px-3 pb-3 pt-2.5">
        {/* Title */}
        <Link
          to={`/games/${game.id}`}
          className="
            block truncate
            text-[11px] font-bold
            tracking-[-0.01em]
            text-white
            transition-colors
            hover:text-violet-300
          "
        >
          {game.title}
        </Link>

        {/* Genre / platform */}
        <div
          className="
            mt-1 flex min-w-0 items-center gap-1.5
            text-[7px] font-medium
            uppercase tracking-[0.08em]
            text-slate-500
          "
        >
          <span className="truncate">
            {game.genre || "Action"}
          </span>

          <span className="text-slate-700">•</span>

          <span>PC</span>
        </div>

        {/* Rating + price + cart */}
        <div className="mt-2 flex items-end justify-between gap-2">
          {/* Rating */}
          <div className="relative -top-2 flex items-center gap-1">
            <Star className="size-3 fill-current text-amber-400" />

            <span className="text-[8px] font-semibold text-slate-300">
              {game.rating}
            </span>
          </div>

          {/* Price + cart */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              {hasDiscount && (
                <span
                  className="
                    mr-1.5
                    text-[7px]
                    text-slate-600
                    line-through
                  "
                >
                  ₹{Number(game.originalPrice).toLocaleString("en-IN")}
                </span>
              )}

              <span
                className="
                  nv-display
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                ₹{Number(game.price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Cart icon only — no Add to Cart text */}
            <button
              type="button"
              aria-label={`Add ${game.title} to cart`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addToCart(game);
              }}
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-lg
                border border-white/[0.08]
                bg-white/[0.03]
                text-slate-400
                transition-all duration-200
                hover:border-violet-400/30
                hover:bg-violet-500/15
                hover:text-violet-300
                active:scale-95
              "
            >
              <ShoppingCart className={["size-3.5 transition-colors duration-200", inCart ? "text-violet-600" : "text-slate-400", ].join(" ")}/>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default GameCard;