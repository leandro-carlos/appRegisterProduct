import axios from "axios";

import { apiClient } from "@/query/apiClient";
import type { User } from "@/types/auth";

const normalizeUser = (payload: any): User => ({
  id: String(payload?.id ?? payload?._id ?? payload?.userId ?? ""),
  username: String(
    payload?.username ?? payload?.name ?? payload?.userName ?? "Usuario"
  ),
  email: String(payload?.email ?? ""),
});

export const userController = {
  async getMe() {
    const response = await apiClient.get("/api/users/me");
    return normalizeUser(response.data?.data ?? response.data);
  },

  getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    return "Nao foi possivel carregar seus dados.";
  },
};

