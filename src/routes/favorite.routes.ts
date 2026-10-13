import { FastifyInstance } from "fastify";
import { favoriteService } from "../services/favorite.service.js";
import { z } from "zod";

// const favoriteBody = z.object({
//   mediaId: z.number(),
//   mediaType: z.enum(['movie', 'tv']),
// })

export async function favoriteRoutes(app: FastifyInstance) {
  // Adicionar favorito
  app.post(
    "/favorites",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const { mediaId, mediaType } = req.body as {
        mediaId: number;
        mediaType: "MOVIE" | "TV";
      };

      const userId = req.user.sub;

      try {
        const favorite = await favoriteService.addFavorite(
          userId,
          mediaId,
          mediaType,
        );

        return reply.status(201).send(favorite);
      } catch (err) {
        return reply.status(500).send({
          error: "Erro ao adicionar favorito.",
        });
      }
    },
  );

  // Remover favorito
  app.delete(
    "/favorites/:mediaId",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const { mediaId } = req.params as {
        mediaId: string;
      };

      const userId = req.user.sub;

      try {
        await favoriteService.removeFavorite(userId, Number(mediaId));

        return reply.status(204).send();
      } catch (err) {
        console.error("ERRO AO REMOVER FAVORITO:", err);

        return reply.status(500).send({
          error: "Erro ao remover favorito.",
        });
      }
    },
  );

  // Buscar favoritos do usuário
  app.get(
    "/favorites",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub;

      try {
        const favorites = await favoriteService.getFavorites(userId);
        console.log(favorites); //teste
        return reply.send(favorites);
      } catch {
        return reply.status(500).send({
          error: "Erro ao buscar favoritos.",
        });
      }
    },
  );

  // Verificar se é favorito
  app.get(
    "/favorites/:mediaId",
    { preHandler: [app.authenticate] },
    async (req, reply) => { 
      const { mediaId } = req.params as {
        mediaId: string;
      };

      const userId = req.user.sub;

      try {
        const favorite = await favoriteService.isFavorite(
          userId,
          Number(mediaId),
        );

        return reply.send({
          isFavorite: Boolean(favorite),
        });
      } catch {
        return reply.status(500).send({
          error: "Erro ao verificar favorito.",
        });
      }
    },
  );
}
