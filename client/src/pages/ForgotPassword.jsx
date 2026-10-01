import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import NovaVaultLogo from "../components/navigation/NovaVaultLogo";

function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const data = await forgotPassword(email);

      setSuccess(
        data.message ||
          "If an account exists with this email, we've sent you a password reset link.",
      );
    } catch (error) {
      setError(error.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link to="/">
              <NovaVaultLogo />
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0c101c] p-6 shadow-2xl shadow-black/30 sm:p-8">
            {/* Header */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                <Mail className="h-6 w-6 text-violet-400" />
              </div>

              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-xl">
                Forgot Password?
              </h1>

              <p className="mt-3 !text-[12px] leading-6 text-white/50">
                We'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Success */}
            {success && (
              <div className="mb-5 flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                <p className="text-sm leading-5 text-emerald-300">{success}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="!text-[9px] uppercase tracking-wider text-white/35">
                  Reset link will be sent to
                </p>

                <p className="mt-1 truncate text-sm text-white/80">{email}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 !text-[14px] font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 !text-[13px] font-medium text-white/60 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/25">
            NovaVault · Secure account recovery
          </p>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
