import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail as verifyEmailRequest,
  resendOtp as resendOtpRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from "../services/authApi";

import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCurrentUser = async () => {
      try {
        const data = await getCurrentUser();

        if (!cancelled) {
          setUser(data.user || null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user || null);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await registerUser(userData);
    setUser(data.user || null);
    return data;
  }, []);

  const verifyEmail = useCallback(async (email, otp) => {
    const data = await verifyEmailRequest(email, otp);
    setUser(data.user || null);
    return data;
  }, []);

  const resendOtp = useCallback(async (email) => {
    const data = await resendOtpRequest(email);
    return data;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const data = await forgotPasswordRequest(email);
    return data;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const data = await resetPasswordRequest(token, password);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const data = await logoutUser();
    setUser(null);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      login,
      register,
      verifyEmail,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
      checkAuth,
    }),
    [user, authLoading, login, register, verifyEmail, resendOtp, forgotPassword, resetPassword, logout, checkAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;