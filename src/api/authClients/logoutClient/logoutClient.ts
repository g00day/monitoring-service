import axios from "axios";
import { apiClient } from "../../apiClient";
import type { ApiErrorResponse } from "./logoutClient.types";

export const logoutClient = {
  /**
   * Завершить текущую сессию пользователя
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>("/auth/logout");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при выходе из системы");
    } finally {
      // очитска токена из localstorage
      localStorage.removeItem("access_token");
    }
  },
};