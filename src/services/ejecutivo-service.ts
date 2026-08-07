import { apiClient } from "@/clients/axios";
import { DashboardEjecutivoResponseDTO, EjecutivoListResponseDTO } from "@/types/api";

export const ejecutivoService = {
  getDashboard: async (id: number, anio: number, mes: number): Promise<DashboardEjecutivoResponseDTO> => {
    const response = await apiClient.get<DashboardEjecutivoResponseDTO>(`/dashboard/ejecutivo/${id}`, {
      params: { periodo_anio: anio, periodo_mes: mes },
    });
    return response.data;
  },
  
  getListaEjecutivos: async (soloActivos: boolean = true): Promise<EjecutivoListResponseDTO> => {
    const response = await apiClient.get<EjecutivoListResponseDTO>("/ejecutivos", {
      params: { solo_activos: soloActivos },
    });
    return response.data;
  },
};