import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { login as authServiceLogin, logout as authServiceLogout } from "../services/authService";

interface AuthUser {
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): AuthUser | null {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  if (username && role) return { username, role };
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authServiceLogin(username, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("username", response.username);
    localStorage.setItem("role", response.role);
    setUser({ username: response.username, role: response.role });
  }, []);

  const logout = useCallback(() => {
    authServiceLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}