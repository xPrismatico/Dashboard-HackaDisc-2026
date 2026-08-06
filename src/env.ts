import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


/**
 * Variables de entorno validadas al cargar el módulo (dev/build/start).
 * Este archivo agrupa server + client; solo figuran nombres de variables, sin secretos.
 */
export const env = createEnv({
  server: {
    DOMAIN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    DOMAIN: process.env.DOMAIN,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
});