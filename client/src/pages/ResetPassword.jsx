import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import useAuth from "../context/useAuth";
import NovaVaultLogo from "../components/navigation/NovaVaultLogo";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, password);

      setSuccess(
        data.message ||
          "Password reset successfully. You can now sign in.",
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1800);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050711] text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[130px]" />

        <div className="absolute bottom-[-220px] right-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.06] blur-[130px]" />

        <div className="absolute left-[-180px] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-violet-500/[0.035] blur-[120px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[430px]">
          {/* NovaVault Logo */}
          <div className="mb-4 flex justify-center">
            <Link
              to="/"
              aria-label="Go to NovaVault home"
              className="
                inline-flex
                rounded-lg
                transition-opacity
                duration-200
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
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/[0.08]">
              <LockKeyhole className="size-5 text-violet-400" />
            </div>

            <h1
              className="
                nv-display
                !text-[28px]
                font-bold
                tracking-[-0.025em]
                text-white
                sm:text-[30px]
              "
            >
              Reset Password
            </h1>

            <p
              className="
                mx-auto
                mt-2
                max-w-[300px]
                !text-[10px]
                leading-5
                text-slate-500
              "
            >
              Create a new password for your NovaVault account.
            </p>
          </div>

          {/* Reset Card */}
          <div
            className="
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#080B15]/90
              p-5
              shadow-2xl
              shadow-black/40
              backdrop-blur-2xl
              sm:p-6
            "
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="
                    mb-2
                    block
                    !text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.13em]
                    text-slate-500
                  "
                >
                  New password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      z-10
                      size-4
                      -translate-y-1/2
                      text-slate-600
                    "
                    aria-hidden="true"
                  />

                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    disabled={loading || Boolean(success)}
                    className="
                      nv-auth-input
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-white/[0.08]
                      bg-black/25
                      pl-10
                      pr-10
                      !text-[11px]
                      text-white
                      caret-violet-300
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-slate-700
                      hover:border-white/[0.12]
                      focus:border-violet-400/40
                      focus:bg-violet-500/[0.025]
                      focus:ring-2
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading || Boolean(success)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      z-10
                      flex
                      size-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-md
                      text-slate-600
                      transition
                      hover:bg-white/[0.05]
                      hover:text-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-400/40
                      disabled:pointer-events-none
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>

                <p className="mt-2 !text-[8px] text-slate-600">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mt-4">
                <label
                  htmlFor="confirm-password"
                  className="
                    mb-2
                    block
                    !text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.13em]
                    text-slate-500
                  "
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      z-10
                      size-4
                      -translate-y-1/2
                      text-slate-600
                    "
                    aria-hidden="true"
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    disabled={loading || Boolean(success)}
                    className="
                      nv-auth-input
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-white/[0.08]
                      bg-black/25
                      pl-10
                      pr-10
                      !text-[11px]
                      text-white
                      caret-violet-300
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-slate-700
                      hover:border-white/[0.12]
                      focus:border-violet-400/40
                      focus:bg-violet-500/[0.025]
                      focus:ring-2
                      focus:ring-violet-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    disabled={loading || Boolean(success)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      z-10
                      flex
                      size-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-md
                      text-slate-600
                      transition
                      hover:bg-white/[0.05]
                      hover:text-slate-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-violet-400/40
                      disabled:pointer-events-none
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Success */}
              {success && (
                <div
                  className="
                    mt-4
                    flex
                    gap-2.5
                    rounded-lg
                    border
                    border-emerald-400/15
                    bg-emerald-500/[0.06]
                    px-3
                    py-2.5
                  "
                  role="status"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />

                  <p className="!text-[9px] leading-4 text-emerald-300">
                    {success}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
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
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || Boolean(success)}
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
                  !text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
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
                    <Loader2 className="size-3.5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  gap-2
                  !text-[9px]
                  font-semibold
                  text-slate-500
                  transition
                  hover:text-white
                "
              >
                <ArrowLeft className="size-3.5" />
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center !text-[8px] text-slate-700">
            NovaVault · Secure account recovery
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;