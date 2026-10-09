import axios from "axios";
import { apiClient } from "../../apiClient";
import type { AgentMetricsPayload, VerifyAgentResponse, ApiErrorResponse } from "./agentClient.types";
import type { MetricsResponse } from "../../devicesClients/deviceClient/deviceClient.types";


export const createAgentClient = (agentToken: string) => {
  const agentConfig = {
    ...apiClient.defaults,
    headers: {
      ...apiClient.defaults.headers,
      "Content-Type": "application/json",
      "X-Agent-Token": agentToken, // Привязываем токен конкретного агента
    } as any,
  };

  const agentInstance = axios.create(agentConfig);

  return {
    /**
     * Проверить валидность токена агента и получить привязанное устройство
     * GET /agent
     */
    verifyAgent: async (): Promise<VerifyAgentResponse> => {
      try {
        const response = await agentInstance.get<VerifyAgentResponse>("/agent");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const apiError = error.response.data as ApiErrorResponse;
          throw apiError;
        }
        throw new Error("Произошла непредвиденная ошибка при верификации агента");
      }
    },

    /**
     * Отправить собранные метрики операционной системы на бэкенд
     * POST /metrics
     */
    sendMetrics: async (payload: AgentMetricsPayload): Promise<MetricsResponse> => {
      try {
        const response = await agentInstance.post<MetricsResponse>("/metrics", payload);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const apiError = error.response.data as ApiErrorResponse;
          throw apiError;
        }
        throw new Error("Произошла непредвиденная ошибка при отправке метрик агента");
      }
    },
  };
};
