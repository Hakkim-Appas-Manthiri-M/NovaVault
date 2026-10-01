import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import useAuth from "../context/useAuth";
import NovaVaultLogo from "../components/navigation/NovaVaultLogo";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyEmail, resendOtp } = useAuth();

  const email = location.state?.email || "";
  const redirectPath = location.state?.from || "/";

  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill(""),
  );

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef([]);

  /*
   * Start the resend cooldown when the page opens.
   */
  useEffect(() => {
    if (!email) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [email]);

  /*
   * Focus the first OTP input when the page opens.
   */
  useEffect(() => {
    if (email) {
      inputRefs.current[0]?.focus();
    }
  }, [email]);

  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      setOtp((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });

      return;
    }

    /*
     * Support pasting the complete OTP into any input.
     */
    if (numericValue.length > 1) {
      const pastedCode = numericValue
        .slice(0, OTP_LENGTH)
        .split("");

      setOtp((current) => {
        const next = [...current];

        pastedCode.forEach((digit, offset) => {
          if (index + offset < OTP_LENGTH) {
            next[index + offset] = digit;
          }
        });

        return next;
      });

      const nextIndex = Math.min(
        index + pastedCode.length,
        OTP_LENGTH - 1,
      );

      inputRefs.current[nextIndex]?.focus();

      return;
    }

    setOtp((current) => {
      const next = [...current];
      next[index] = numericValue;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedText = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedText) {
      return;
    }

    const digits = pastedText.split("");

    setOtp((current) => {
      const next = [...current];

      digits.forEach((digit, index) => {
        next[index] = digit;
      });

      return next;
    });

    const focusIndex = Math.min(
      digits.length,
      OTP_LENGTH - 1,
    );

    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error(
        "Verification email is missing. Please register again.",
      );
      return;
    }

    const verificationCode = otp.join("");

    if (verificationCode.length !== OTP_LENGTH) {
      toast.error(
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    try {
      setLoading(true);

      await verifyEmail(
        email,
        verificationCode,
      );

      toast.success("Email verified successfully!", {
        icon: "✓",
        duration: 2500,
      });

      window.setTimeout(() => {
        navigate(redirectPath, {
          replace: true,
        });
      }, 700);
    } catch (requestError) {
      toast.error(
        requestError.message ||
          "Unable to verify your email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (
      !email ||
      cooldown > 0 ||
      resending ||
      loading
    ) {
      return;
    }

    try {
      setResending(true);

      await resendOtp(email);

      setOtp(Array(OTP_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN);

      toast.success(
        "A new verification code has been sent to your email.",
        {
          icon: "✉",
        },
      );

      inputRefs.current[0]?.focus();
    } catch (requestError) {
      toast.error(
        requestError.message ||
          "Unable to resend the verification code.",
      );
    } finally {
      setResending(false);
    }
  };

  /*
   * If the page was opened directly without registration state,
   * don't render a broken verification form.
   */
  if (!email) {
    return (
      <>
        <style>
          {`
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px #080b15 inset !important;
              -webkit-text-fill-color: #ffffff !important;
              caret-color: #ffffff !important;
              transition: background-color 9999s ease-in-out 0s;
            }
          `}
        </style>

        <main className="relative min-h-screen overflow-hidden bg-[#050711] text-slate-100">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[-220px] h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[130px]" />

            <div className="absolute bottom-[-220px] left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.06] blur-[130px]" />

            <div className="absolute right-[-180px] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-violet-500/[0.035] blur-[120px]" />
          </div>

          <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-[420px]"
            >
              <div className="mb-4 flex justify-center">
                <Link
                  to="/"
                  aria-label="Go to NovaVault home"
                  className="
                    inline-flex rounded-lg
                    transition-opacity duration-200
                    hover:opacity-90
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-400/50
                  "
                >
                  <NovaVaultLogo />
                </Link>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-white/[0.07]
                  bg-[#080B15]/90
                  p-5
                  text-center
                  shadow-2xl shadow-black/40
                  backdrop-blur-2xl
                  sm:p-6
                "
              >
                <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.08]">
                  <Mail className="size-5 text-violet-400" />
                </div>

                <h1 className="nv-display !text-[25px] font-bold tracking-[-0.025em] text-white">
                  Verification required
                </h1>

                <p className="mx-auto mt-2 max-w-[300px] !text-[10px] leading-5 text-slate-500">
                  Please register your NovaVault account first
                  to receive a verification code.
                </p>

                <Link
                  to="/register"
                  className="
                    mt-6 inline-flex h-10
                    items-center justify-center gap-2
                    rounded-lg
                    bg-violet-600
                    px-5
                    !text-[9px]
                    font-bold uppercase
                    tracking-[0.12em]
                    text-white
                    transition-all duration-200
                    hover:bg-violet-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-400/50
                  "
                >
                  Create account
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Chrome autofill fix */}
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #080b15 inset !important;
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff !important;
            transition: background-color 9999s ease-in-out 0s;
          }
        `}
      </style>

      <main className="relative min-h-screen overflow-hidden bg-[#050711] text-slate-100">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-220px] h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[130px]" />

          <div className="absolute bottom-[-220px] left-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.06] blur-[130px]" />

          <div className="absolute right-[-180px] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-violet-500/[0.035] blur-[120px]" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[420px]"
          >
            {/* NovaVault logo */}
            <div className="mb-4 flex justify-center">
              <Link
                to="/"
                aria-label="Go to NovaVault home"
                className="
                  inline-flex rounded-lg
                  transition-opacity duration-200
                  hover:opacity-90
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-400/50
                "
              >
                <NovaVaultLogo />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="nv-display !text-[28px] font-bold tracking-[-0.025em] text-white !sm:text-[30px]">
                Verify your email
              </h1>

              <p className="mx-auto mt-2 max-w-[310px] !text-[10px] leading-5 text-slate-500">
                Enter the 6-digit code we sent to your email
                address.
              </p>
            </div>

            {/* Verification card */}
            <div
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-[#080B15]/90
                p-5
                shadow-2xl shadow-black/40
                backdrop-blur-2xl
                sm:p-6
              "
            >
              {/* Email preview */}
              <div
                className="
                  flex items-center gap-3
                  rounded-lg
                  border border-white/[0.06]
                  bg-white/[0.02]
                  px-3.5 py-3
                "
              >
                <div
                  className="
                    flex size-8 shrink-0
                    items-center justify-center
                    rounded-md
                    bg-violet-500/[0.08]
                    text-violet-400
                  "
                >
                  <Mail className="size-3.5" />
                </div>

                <div className="min-w-0">
                  <p className="!text-[8px] font-bold uppercase tracking-[0.13em] text-slate-600">
                    Verification email
                  </p>

                  <p className="mt-0.5 truncate !text-[10px] font-medium text-slate-300">
                    {email}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
              >
                {/* OTP */}
                <div className="mt-5">
                  <label
                    htmlFor="otp-0"
                    className="
                      mb-3 block
                      text-center
                      !text-[9px]
                      font-bold uppercase
                      tracking-[0.13em]
                      text-slate-500
                    "
                  >
                    Verification code
                  </label>

                  <div
                    className="flex justify-center gap-2 sm:gap-2.5"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                          index === 0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          handleOtpChange(
                            index,
                            event.target.value,
                          )
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(
                            event,
                            index,
                          )
                        }
                        disabled={
                          loading || resending
                        }
                        aria-label={`Verification digit ${index + 1}`}
                        className="
                          h-11 w-10
                          rounded-lg
                          border border-white/[0.08]
                          bg-black/25
                          text-center
                          !text-[15px]
                          font-bold
                          text-white
                          caret-violet-300
                          outline-none
                          transition-all duration-200
                          hover:border-white/[0.12]
                          focus:border-violet-400/50
                          focus:bg-violet-500/[0.025]
                          focus:ring-2
                          focus:ring-violet-500/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:h-12
                          sm:w-11
                        "
                      />
                    ))}
                  </div>
                </div>

                {/* Expiry */}
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <span className="size-1 rounded-full bg-violet-400" />

                  <p className="!text-[8px] text-slate-600">
                    Your verification code expires in
                    10 minutes.
                  </p>
                </div>

                {/* Verify button */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    resending ||
                    otp.join("").length !== OTP_LENGTH
                  }
                  className="
                    mt-5 flex h-11 w-full
                    items-center justify-center gap-2
                    rounded-lg
                    bg-violet-600
                    px-4
                    !text-[10px]
                    font-bold uppercase
                    tracking-[0.12em]
                    text-white
                    transition-all duration-200
                    hover:bg-violet-500
                    hover:shadow-lg
                    hover:shadow-violet-950/30
                    active:scale-[0.99]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-400/50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {loading ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify email
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="mt-5 text-center">
                <p className="!text-[9px] text-slate-600">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={
                    cooldown > 0 ||
                    resending ||
                    loading
                  }
                  className="
                    mt-2
                    inline-flex
                    items-center gap-1.5
                    !text-[9px]
                    font-semibold
                    text-violet-500
                    transition
                    hover:text-violet-300
                    focus:outline-none
                    disabled:cursor-not-allowed
                    disabled:text-slate-700
                  "
                >
                  <RefreshCw
                    className={`size-3 ${
                      resending
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  {resending
                    ? "Sending..."
                    : cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend verification code"}
                </button>
              </div>
            </div>

            {/* Back */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="
                  inline-flex
                  items-center gap-1.5
                  !text-[9px]
                  font-semibold
                  text-slate-600
                  transition
                  hover:text-slate-300
                "
              >
                <ArrowLeft className="size-3" />
                Back to registration
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default VerifyEmail;