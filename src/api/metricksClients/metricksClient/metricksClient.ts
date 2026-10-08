import axios from "axios";
import { apiClient } from "../../apiClient";
import type { MetricsHistory, GetMetricsHistoryParams, ApiErrorResponse } from "./metricksClient.types";


export const metricksClient = {
  /**
   * Получить историю метрик устройства за указанный период времени
   * GET /devices/{device_id}/metrics
   */
  getMetricsHistory: async (
    deviceId: number | string,
    params?: GetMetricsHistoryParams
  ): Promise<MetricsHistory> => {
    try {
      const response = await apiClient.get<MetricsHistory>(`/devices/${deviceId}/metrics`, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при получении истории метрик");
    }
  },
};
