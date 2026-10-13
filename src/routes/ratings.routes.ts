import { FastifyInstance } from "fastify";
import { ratingsService } from "../services/ratings.service.js";
//TODO:colocar schemas
export async function RatingRoute(app: FastifyInstance) {
  app.post("/ratings", { preHandler: [app.authenticate] },async (req, reply) => {
    const { mediaId, mediaType, score } = req.body as {
      mediaId: number;
      mediaType: "MOVIE" | "TV";
      score: number;
    };
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
      console.error("ERRO AO CRIAR RATING:", error);
      reply.status(500).send({ error: "Failed to create rating" });
    }
  });

  //TODO:   listando por usuario
  app.get("/ratings", { preHandler: [app.authenticate] }, async (req, reply) => {
    const { mediaType } = req.query as { mediaType?: "MOVIE" | "TV" };
    try {
      const userId = req.user.sub;
      const ratings = await ratingsService.listByUser(userId, mediaType);
      reply.status(200).send(ratings);
    } catch (error) {
      console.error("ERRO AO BUSCAR RATINGS:", error);
      reply.status(500).send({ error: "Failed to fetch ratings" });
    }
  });
}
