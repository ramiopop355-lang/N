import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser {
  username: string;
  phone: string;
  activated: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (token: string, user: AuthUser) => void;
}

const AUTH_KEY = "ustad-auth-token";
const USER_KEY = "ustad-auth-user";

const storage = {
  get: (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* unavailable */ }
  },
  remove: (key: string): void => {
    try { localStorage.removeItem(key); } catch { /* unavailable */ }
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => storage.get(AUTH_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = storage.get(USER_KEY);
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });

  const isLoggedIn = !!token && !!user;

  const login = (newToken: string, newUser: AuthUser) => {
    storage.set(AUTH_KEY, newToken);
    storage.set(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    storage.remove(AUTH_KEY);
    storage.remove(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (newToken: string, newUser: AuthUser) => {
    storage.set(AUTH_KEY, newToken);
    storage.set(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
