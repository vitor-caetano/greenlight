import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthToken } from "../types";
import { storeToken, clearStoredToken, getStoredToken } from "../api/client";

interface AuthContextValue {
  token: string | null;
  login: (authToken: AuthToken) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = useCallback((authToken: AuthToken) => {
    storeToken(authToken);
    setToken(authToken.token);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: token !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
