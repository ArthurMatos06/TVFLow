import { FastifyInstance } from "fastify";
import { ratingsService } from "../services/ratings.service.js";
import { ratingBodySchema, ratingQuerySchema } from "../schemas.js";

export async function RatingRoute(app: FastifyInstance) {
  app.post(
    "/ratings",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = ratingBodySchema.safeParse(req.body);

      if (!parsed.success) {
        return reply.status(400).send({
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { mediaId, mediaType, score } = parsed.data;

      try {
        const userId = req.user.sub;
        const rating = await ratingsService.upsert(
          userId,
          mediaId,
          mediaType,
          score,
        );
        reply.status(201).send(rating);
      } catch (error) {
        req.log.error(error, "ERRO AO CRIAR RATING");
        reply.status(500).send({ error: "Failed to create rating" });
      }
    },
  );

  app.get("/ratings", { preHandler: [app.authenticate] }, async (req, reply) => {
    const parsed = ratingQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Parâmetros inválidos.",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { mediaType } = parsed.data;

    try {
      const userId = req.user.sub;
      const ratings = await ratingsService.listByUser(userId, mediaType);
      reply.status(200).send(ratings);
    } catch (error) {
      req.log.error(error, "ERRO AO BUSCAR RATINGS");
      reply.status(500).send({ error: "Failed to fetch ratings" });
    }
  });
}
