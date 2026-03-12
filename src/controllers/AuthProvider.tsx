import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import { authController } from "./AuthController";
import { queryClient } from "@/query/queryClient";
import { userController } from "./UserController";

type AuthContextValue = {
  session: AuthSession | null;
  user: User | null;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    authController.setSessionListener(setSession);

    return () => {
      authController.setSessionListener(null);
    };
  }, []);

  useEffect(() => {
    if (!session) {
      queryClient.clear();
    }
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.accessToken && session?.user?.id),
      signIn: async (payload) => authController.signIn(payload),
      register: async (payload) => authController.register(payload),
      signOut: async () => {
        await authController.signOut();
      },
      refreshUser: async () => {
        const user = await userController.getMe();

        if (session) {
          await authController.persistSession({
            ...session,
            user,
          });
        }

        return user;
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
};
