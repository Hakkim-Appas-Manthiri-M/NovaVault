import { Gift, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function GiftModal({ open, game, onClose, onSubmit }) {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setRecipient("");
    setError("");
    setSubmitting(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = recipient.trim();

    if (!value) {
      setError("Enter the recipient's registered email.");
      return;
    }

    if (submitting) {
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit?.(value);
    } catch (submitError) {
      setError(submitError.message || "Unable to send the gift.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && game && (
        <motion.div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            px-4
            py-6
            backdrop-blur-sm
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-modal-title"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              w-full
              max-w-[440px]
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.09]
              bg-[#080A14]
              shadow-2xl
              shadow-black/50
            "
          >
            {/* Violet top accent */}
            <div
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-violet-400
                to-transparent
              "
            />

            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/[0.06]
                px-5
                py-4
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-violet-400/20
                    bg-violet-500/[0.09]
                    text-violet-300
                  "
                >
                  <Gift className="size-4" />
                </div>

                <div>
                  <h2
                    id="gift-modal-title"
                    className="
                      nv-display
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    Gift This Game
                  </h2>

                  <p
                    className="
                      mt-0.5
                      !text-[8px]
                      text-slate-600
                    "
                  >
                    Send it to another NovaVault account
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close gift dialog"
                onClick={handleClose}
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-slate-500
                  transition-all
                  hover:border-white/[0.12]
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-5">
                {/* Game preview */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.02]
                    p-2.5
                  "
                >
                  <div
                    className="
                      h-16
                      w-12
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-[#101529]
                    "
                  >
                    <img
                      src={game.portraitImage || game.image}
                      alt=""
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        !text-[7px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-violet-400
                      "
                    >
                      Your Game
                    </p>

                    <h3
                      className="
                        nv-display
                        mt-1
                        truncate
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      {game.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        !text-[8px]
                        text-slate-600
                      "
                    >
                      This game will be sent to the selected account.
                    </p>
                  </div>
                </div>

                {/* Recipient */}
                <div className="mt-5">
                  <label
                    htmlFor="gift-recipient"
                    className="
                      block
                      !text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-slate-300
                    "
                  >
                    Recipient Account
                  </label>

                  <div className="relative mt-2">
                    <Search
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        size-3.5
                        -translate-y-1/2
                        text-slate-600
                      "
                    />

                    <input
                      id="gift-recipient"
                      type="text"
                      value={recipient}
                      onChange={(event) => {
                        setRecipient(event.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="Registered email address"
                      autoComplete="off"
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-white/[0.08]
                        bg-[#050711]
                        pl-9
                        pr-3
                        !text-[10px]
                        text-white
                        outline-none
                        transition-all
                        placeholder:!text-[9px]
                        placeholder:text-slate-600
                        hover:border-white/[0.12]
                        focus:border-violet-500/50
                        focus:ring-1
                        focus:ring-violet-500/10
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      !text-[8px]
                      leading-4
                      text-slate-600
                    "
                  >
                    Enter the recipient's registered NovaVault email.
                  </p>

                  {error && (
                    <p
                      role="alert"
                      className="
                        mt-2
                        !text-[8px]
                        font-medium
                        text-red-400
                      "
                    >
                      {error}
                    </p>
                  )}
                </div>

                {/* Notice */}
                <div
                  className="
                    mt-4
                    rounded-lg
                    border
                    border-violet-400/[0.10]
                    bg-violet-500/[0.035]
                    px-3
                    py-2.5
                  "
                >
                  <p
                    className="
                      !text-[8px]
                      leading-4
                      text-slate-500
                    "
                  >
                    The recipient must have a NovaVault account. Gift ownership
                    will be transferred after the gift is accepted.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  border-t
                  border-white/[0.06]
                  bg-white/[0.015]
                  px-5
                  py-4
                "
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="
                    h-9
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    px-4
                    !text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                    transition-all
                    hover:border-white/[0.14]
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    inline-flex
                    h-9
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-violet-600
                    px-4
                    !text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    shadow-lg
                    shadow-violet-950/30
                    transition-all
                    hover:bg-violet-500
                  "
                >
                  <Gift className="size-3" />
                  {submitting ? "Sending..." : "Send Gift"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default GiftModal;
