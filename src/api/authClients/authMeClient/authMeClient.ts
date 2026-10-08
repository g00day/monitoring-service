import axios from "axios";
import { apiClient } from "../apiClient";
import { UserResponse, ApiErrorResponse } from "./meClient.types";

export const meClient = {
  /**
   * Получить пользователя текущей сессии
   * GET /auth/me
   */
  getMe: async (): Promise<UserResponse> => {
    try {
      const response = await apiClient.get<UserResponse>("/auth/me");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при получении данных профиля");
    }
  },
};
