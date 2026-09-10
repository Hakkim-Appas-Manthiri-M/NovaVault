import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";

import useAuth from "../context/useAuth";
import NovaVaultLogo from "../components/navigation/NovaVaultLogo";

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.78-.07-1.53-.22-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.4Z"
      />

      <path
        fill="#34A853"
        d="M12 21.58c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.58Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.67a5.86 5.86 0 0 1 0-3.34V7.81H3.28a9.75 9.75 0 0 0 0 8.38l3.25-2.52Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.3c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.4 14.63 2.42 12 2.42a9.75 9.75 0 0 0-8.72 5.39l3.25 2.52C7.3 8.02 9.46 6.3 12 6.3Z"
      />
    </svg>
  );
}

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name,
        email,
        password: form.password,
      });

      navigate(redirectPath, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Google authentication will be connected later.
  };

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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
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
                Create your account
              </h1>

              <p className="mx-auto mt-2 max-w-[280px] !text-[10px] leading-5 text-slate-500">
                Join NovaVault and build your game library.
              </p>
            </div>

            {/* Register card */}
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
              <form onSubmit={handleSubmit} noValidate>
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="
                      mb-2 block
                      !text-[9px]
                      font-bold uppercase
                      tracking-[0.13em]
                      text-slate-500
                    "
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      className="
                        pointer-events-none
                        absolute left-3 top-1/2
                        z-10 size-4
                        -translate-y-1/2
                        text-slate-600
                      "
                      aria-hidden="true"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      disabled={loading}
                      maxLength={80}
                      className="
                        h-11 w-full
                        rounded-lg
                        border border-white/[0.08]
                        bg-black/25
                        pl-10 pr-3
                        !text-[11px]
                        text-white
                        caret-violet-300
                        outline-none
                        transition-all duration-200
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
                  </div>
                </div>

                {/* Email */}
                <div className="mt-4">
                  <label
                    htmlFor="email"
                    className="
                      mb-2 block
                      !text-[9px]
                      font-bold uppercase
                      tracking-[0.13em]
                      text-slate-500
                    "
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      className="
                        pointer-events-none
                        absolute left-3 top-1/2
                        z-10 size-4
                        -translate-y-1/2
                        text-slate-600
                      "
                      aria-hidden="true"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="
                        h-11 w-full
                        rounded-lg
                        border border-white/[0.08]
                        bg-black/25
                        pl-10 pr-3
                        !text-[11px]
                        text-white
                        caret-violet-300
                        outline-none
                        transition-all duration-200
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
                  </div>
                </div>

                {/* Password */}
                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="
                      mb-2 block
                      !text-[9px]
                      font-bold uppercase
                      tracking-[0.13em]
                      text-slate-500
                    "
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      className="
                        pointer-events-none
                        absolute left-3 top-1/2
                        z-10 size-4
                        -translate-y-1/2
                        text-slate-600
                      "
                      aria-hidden="true"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      disabled={loading}
                      minLength={6}
                      className="
                        h-11 w-full
                        rounded-lg
                        border border-white/[0.08]
                        bg-black/25
                        pl-10 pr-10
                        !text-[11px]
                        text-white
                        caret-violet-300
                        outline-none
                        transition-all duration-200
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
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        absolute right-2 top-1/2
                        z-10 flex size-7
                        -translate-y-1/2
                        items-center justify-center
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
                </div>

                {/* Confirm password */}
                <div className="mt-4">
                  <label
                    htmlFor="confirmPassword"
                    className="
                      mb-2 block
                      !text-[9px]
                      font-bold uppercase
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
                        absolute left-3 top-1/2
                        z-10 size-4
                        -translate-y-1/2
                        text-slate-600
                      "
                      aria-hidden="true"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      disabled={loading}
                      minLength={6}
                      className="
                        h-11 w-full
                        rounded-lg
                        border border-white/[0.08]
                        bg-black/25
                        pl-10 pr-10
                        !text-[11px]
                        text-white
                        caret-violet-300
                        outline-none
                        transition-all duration-200
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
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="
                        absolute right-2 top-1/2
                        z-10 flex size-7
                        -translate-y-1/2
                        items-center justify-center
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

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mt-4
                      rounded-lg
                      border border-red-400/15
                      bg-red-500/[0.06]
                      px-3 py-2.5
                    "
                    role="alert"
                  >
                    <p className="!text-[9px] leading-4 text-red-300">
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Create account */}
                <button
                  type="submit"
                  disabled={loading}
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
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.06]" />

                <span className="!text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  or
                </span>

                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="
                  flex h-11 w-full
                  items-center justify-center gap-2.5
                  rounded-lg
                  border border-white/[0.08]
                  bg-white/[0.025]
                  px-4
                  !text-[10px]
                  font-bold
                  text-slate-300
                  transition-all duration-200
                  hover:border-white/[0.13]
                  hover:bg-white/[0.05]
                  hover:text-white
                  active:scale-[0.99]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-400/30
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Login */}
            <p className="mt-6 text-center !text-[9px] text-slate-600">
              Already have a NovaVault account?{" "}
              <span 
                className="
                  font-semibold
                text-violet-500
                  transition
                hover:text-violet-300"
               >
              <Link
                to="/login"
                state={{ from: redirectPath }} 
              >
                Sign in
              </Link>
              </span>
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default Register;