import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({
        error: "Não autenticado.",
      });
    }
  });
};

export default fp(authPlugin);
