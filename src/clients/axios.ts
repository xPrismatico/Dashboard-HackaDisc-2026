/**
 * @fileoverview Configuración del cliente HTTP global utilizando Axios.
 * Centraliza la configuración de la conexión con la API de FastAPI.
 */

import axios from "axios";
import { env } from "@/env";

/**
 * Instancia preconfigurada de Axios.
 * Utiliza la variable de entorno validada `NEXT_PUBLIC_API_URL` como URL base.
 * Aplica automáticamente el encabezado `Content-Type: application/json` a todas las peticiones.
 */

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});