import axios from "axios";
import { z } from "zod";

import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import {
  apiClient,
  setAuthSessionHandlers,
  setUnauthorizedHandler,
} from "@/query/apiClient";
import { storageController } from "./storageController";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Informe um nome de usuario com pelo menos 3 caracteres."),
  email: z.email("Informe um email valido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const loginSchema = z.object({
  email: z.email("Informe um email valido."),
  password: z.string().min(1, "Informe sua senha."),
});

const normalizeUser = (payload: any): User => ({
  id: String(payload?.id ?? payload?._id ?? payload?.userId ?? ""),
  username: String(
    payload?.username ?? payload?.name ?? payload?.userName ?? "Usuario",
  ),
  email: String(payload?.email ?? ""),
});

const resolveAuthSession = (payload: any): AuthSession => {
  const data = payload?.data ?? payload;
  const userPayload = data?.user ?? data?.profile ?? payload?.user;

  return {
    accessToken: String(
      data?.accessToken ?? data?.token ?? data?.access_token ?? "",
    ),
    refreshToken: String(
      data?.refreshToken ?? data?.refresh_token ?? payload?.refreshToken ?? "",
    ),
    user: normalizeUser(userPayload),
  };
};

const mapAuthError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Dados invalidos.";
  }

  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (error.response?.status === 401) {
      return "Email ou senha invalidos.";
    }

    if (error.response?.status === 409) {
      return "Este email ja esta em uso.";
    }
  }

  return "Nao foi possivel concluir a autenticacao.";
};

type SessionListener = ((session: AuthSession | null) => void) | null;

let inMemorySession: AuthSession | null = null;
let sessionListener: SessionListener | null = null;

const notifySession = (session: AuthSession | null) => {
  inMemorySession = session;
  sessionListener?.(session);
};

export const authController = {
  setSessionListener(listener: SessionListener) {
    sessionListener = listener;
  },

  getSession() {
    return inMemorySession;
  },

  async persistSession(session: AuthSession) {
    notifySession(session);
    await storageController.saveSession(session);
    return session;
  },

  async signIn(payload: LoginPayload) {
    const body = loginSchema.parse(payload);
    const response = await apiClient.post("/api/auth/login", body, {
      skipAuthRefresh: true,
    });
    const session = resolveAuthSession(response.data);

    await this.persistSession(session);
    return session;
  },

  async register(payload: RegisterPayload) {
    const body = registerSchema.parse(payload);
    const response = await apiClient.post("/api/auth/register", body, {
      skipAuthRefresh: true,
    });

    return response;
  },

  async refreshSession(refreshToken?: string) {
    const currentRefreshToken = refreshToken ?? inMemorySession?.refreshToken;

    if (!currentRefreshToken) {
      throw new Error("Sessao expirada.");
    }

    const response = await apiClient.post(
      "/api/auth/refresh",
      { refreshToken: currentRefreshToken },
      { skipAuthRefresh: true },
    );

    const refreshedSession = resolveAuthSession({
      ...response.data,
      user: response.data?.user ?? inMemorySession?.user,
      refreshToken:
        response.data?.refreshToken ??
        response.data?.data?.refreshToken ??
        currentRefreshToken,
    });

    if (!refreshedSession.user.id && inMemorySession?.user) {
      refreshedSession.user = inMemorySession.user;
    }

    await this.persistSession(refreshedSession);
    return refreshedSession;
  },

  async signOut(options?: { remote?: boolean }) {
    const refreshToken = inMemorySession?.refreshToken;

    if (options?.remote !== false && refreshToken) {
      try {
        await apiClient.post(
          "/api/auth/logout",
          { refreshToken },
          { skipAuthRefresh: true },
        );
      } catch {
        // Local cleanup still needs to happen.
      }
    }

    notifySession(null);
    await storageController.clearSession();
  },

  getErrorMessage(error: unknown) {
    return mapAuthError(error);
  },
};

setAuthSessionHandlers({
  getAccessToken: () => inMemorySession?.accessToken ?? null,
  refreshAccessToken: async () => {
    const session = await authController.refreshSession();
    return session.accessToken;
  },
});

setUnauthorizedHandler(() => authController.signOut({ remote: false }));
