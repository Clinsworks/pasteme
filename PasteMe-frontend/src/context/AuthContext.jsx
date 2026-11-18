import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/api/auth/me")
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (active && !error.message.includes("log in")) {
          console.error("Could not restore PasteMe session:", error);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signUp = useCallback(async (profile) => {
    const result = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(profile),
    });
    setUser(result.user);
    return result.user;
  }, []);

  const signIn = useCallback(async (credentials) => {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      logout,
    }),
    [user, loading, signIn, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook is intentionally exported with its provider from the context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
