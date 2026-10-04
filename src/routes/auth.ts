import { FastifyInstance } from "fastify";
import { z } from "zod";

import { authService } from "../services/auth.service.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
    };
    user: {
      sub: string;
    };
  }
}

const registerBody = z.object({
  name: z.string().min(2, "Nome muito curto."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
});

const loginBody = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req, res) => {
    const parsed = registerBody.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).send({
        error: "Dados inválidos.",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const user = await authService.register(parsed.data);

      const token = await app.jwt.sign({ sub: user.id }, { expiresIn: "7d" });

      res.setCookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res.status(201).send({ user });
    } catch (err) {
      console.error("ERRO NO REGISTER:", err);

      const message =
        err instanceof Error ? err.message : "Erro ao registrar usuário.";

      return res.status(500).send({ error: message });
    }
  });

  app.post("/login", async (req, res) => {
    const parsed = loginBody.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).send({
        error: "Dados inválidos.",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const user = await authService.login(parsed.data);

      const token = await app.jwt.sign({ sub: user.id }, { expiresIn: "7d" });

      res.setCookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res.status(200).send({ user });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao realizar login.";
      return res.status(401).send({ error: message });
    }
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (req, reply) => {
    try {
      const user = await authService.getUserById(req.user.sub);

      if (!user) {
        return reply.status(404).send({
          error: "Usuário não encontrado.",
        });
      }

      return reply.status(200).send({ user });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao buscar usuário.";

      return reply.status(500).send({ error: message });
    }
  });
}
