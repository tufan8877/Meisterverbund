import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useGetMe } from "@workspace/api-client-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("mv_token"));
  const [user, setUser] = useState<User | null>(null);

  const { data: meData, isLoading: meLoading } = useGetMe({
    query: { enabled: !!token },
  });

  useEffect(() => {
    if (meData) {
      setUser(meData as unknown as User);
    }
  }, [meData]);

  function login(newToken: string, newUser: User) {
    localStorage.setItem("mv_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("mv_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === "admin",
      isLoading: !!token && meLoading && !user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
