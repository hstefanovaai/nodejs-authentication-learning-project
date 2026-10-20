import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import * as authApi from "../api/auth";
import type { AuthUser } from "../api/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authApi
      .getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        // Keep the user logged out if the initial check fails.
        // A production app may expose a separate connection error.
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password);
    setUser(data.user);
  }

  async function signup(name: string, email: string, password: string) {
    await authApi.signup(name, email, password);
    // Signup does not create a session in our backend.
    // The user must log in afterward.
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  async function forgotPassword(email: string) {
    await authApi.forgotPassword(email);
  }

  async function resetPassword(
    token: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    await authApi.resetPassword(token, email, password, confirmPassword);
  }

  async function verifyEmail(token: string) {
    await authApi.verifyEmail(token);
  }

  async function resendVerificationEmail(email: string) {
    await authApi.resendVerificationEmail(email);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
