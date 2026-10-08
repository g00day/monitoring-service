import axios from "axios";
import { apiClient } from "../../apiClient"; 
import { LoginCredentials, LoginResponse, ApiErrorResponse } from "./loginClient.types";

export const loginClient = {
  /**
   * Вход в систему по username и password
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
      
      // Сохранение токенов в localStorage
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      // Перехват ошибки от бэкенда (401, 422, 429)
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при попытке входа");
    }
  },
};