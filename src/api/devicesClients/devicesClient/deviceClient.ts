import axios from "axios";
import { apiClient } from "../../apiClient";
import { 
  CreateDeviceDto, 
  RenameDeviceDto, 
  UpdateAgentTokenDto, 
  DeviceResponse, 
  ApiErrorResponse,
  MetricsHistory,
  GetMetricsHistoryParams,
  MetricsResponse
} from "./deviceClient.types";

export const devicesApiClient = {
  /**
   * Создать новое устройство
   * POST /devices
   */
  createDevice: async (dto: CreateDeviceDto): Promise<DeviceResponse> => {
    try {
      const response = await apiClient.post<DeviceResponse>("/devices", dto);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при создании устройства");
    }
  },

  /**
   * Получить устройство и его последние метрики по ID
   * GET /devices/{device_id}
   */
  getDeviceById: async (deviceId: number | string): Promise<DeviceResponse> => {
    try {
      const response = await apiClient.get<DeviceResponse>(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при получении данных устройства");
    }
  },

  /**
   * Переименовать устройство
   * PATCH /devices/{device_id}
   */
  renameDevice: async (deviceId: number | string, dto: RenameDeviceDto): Promise<DeviceResponse> => {
    try {
      const response = await apiClient.patch<DeviceResponse>(`/devices/${deviceId}`, dto);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при переименовании устройства");
    }
  },

  /**
   * Заменить токен агента устройства
   * PUT /devices/{device_id}/agent-token
   */
  updateAgentToken: async (deviceId: number | string, dto: UpdateAgentTokenDto): Promise<DeviceResponse> => {
    try {
      const response = await apiClient.put<DeviceResponse>(`/devices/${deviceId}/agent-token`, dto);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при обновлении токена агента");
    }
  },

  /**
   * Удалить устройство и всю его историю
   * DELETE /devices/{device_id}
   */
  deleteDevice: async (deviceId: number | string): Promise<void> => {
    try {
      await apiClient.delete<void>(`/devices/${deviceId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при удалении устройства");
    }
  },


  /**
   * Получить историю метрик устройства за указанный период времени для графиков
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

  /**
   * Получить самую последнюю точку метрик устройства (realtime обновление)
   * GET /devices/{device_id}/metrics/latest
   */
  getLatestMetrics: async (deviceId: number | string): Promise<MetricsResponse> => {
    try {
      const response = await apiClient.get<MetricsResponse>(`/devices/${deviceId}/metrics/latest`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiErrorResponse;
        throw apiError;
      }
      throw new Error("Произошла непредвиденная ошибка при получении последних метрик");
    }
  },
};
