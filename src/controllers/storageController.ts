import * as SecureStore from "expo-secure-store";

import type { AuthSession } from "@/types/auth";

const SESSION_KEY = "app-register-product/session";

export const storageController = {
  async saveSession(session: AuthSession) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  },

  async getSession() {
    const rawSession = await SecureStore.getItemAsync(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return null;
    }
  },

  async clearSession() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};

