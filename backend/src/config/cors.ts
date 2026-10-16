import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { env } from "../env.js";

const isProd = env.NODE_ENV === "production";

function getAllowedOrigin(): string {
  const origin = env.CORS_ORIGIN?.trim();

  if (!isProd) {
    return origin!;
  }

  if (!origin) {
    throw new Error("CORS_ORIGIN é obrigatória em produção");
  }

  try {
    const url = new URL(origin);

    if (
      url.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    ) {
      throw new Error();
    }
  } catch {
    throw new Error("CORS_ORIGIN deve ser uma URL HTTPS válida em produção");
  }

  return origin;
}

export async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: getAllowedOrigin(),
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
}
