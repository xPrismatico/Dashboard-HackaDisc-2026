import { apiClient } from "@/clients/axios";
import { DashboardGerenteResponseDTO } from "@/types/api";

export const gerenciaService = {
  getDashboard: async (anio: number, mes: number): Promise<DashboardGerenteResponseDTO> => {
    const response = await apiClient.get<DashboardGerenteResponseDTO>("/dashboard/gerente", {
      params: { periodo_anio: anio, periodo_mes: mes },
    });
    return response.data;
  },
};