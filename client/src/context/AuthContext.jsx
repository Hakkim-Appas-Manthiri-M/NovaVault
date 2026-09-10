import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
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
      logout,
      checkAuth,
    }),
    [user, authLoading, login, register, logout, checkAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;