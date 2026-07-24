import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { logActivity } from "./services/activityLogger";

export type User = {
  name: string;
  email: string;
  role: "user" | "admin";
};

export type LoginResult = { ok: true; user: User } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem("scentbase_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.email && parsed.role) {
      return parsed as User;
    }
    return null;
  } catch {
    return null;
  }
}

function storeUser(user: User | null) {
  try {
    if (user) {
      sessionStorage.setItem("scentbase_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("scentbase_user");
    }
  } catch {
    // sessionStorage may be unavailable
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.error === "invalid_credentials"
            ? "The email or password is incorrect."
            : result.error || "Unable to sign in.";
        return { ok: false, error: errorMessage };
      }

      const userData: User = {
        name: result.name,
        email: result.email,
        role: result.role === "admin" ? "admin" : "user",
      };

      setUser(userData);
      storeUser(userData);
      return { ok: true, user: userData };
    } catch {
      return { ok: false, error: "Unable to reach the authentication server." };
    }
  }, []);

  const logout = useCallback(() => {
    const currentUser = user;
    setUser(null);
    storeUser(null);
    // Log logout activity
    if (currentUser) {
      logActivity({
        userId: currentUser.email,
        username: currentUser.name,
        type: "logout",
        description: "User logged out",
      });
    }
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

