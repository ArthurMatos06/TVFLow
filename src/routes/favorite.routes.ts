import { FastifyInstance } from "fastify";
import { favoriteService } from "../services/favorite.service.js";
import { favoriteBodySchema, mediaIdParamSchema } from "../schemas.js";

export async function favoriteRoutes(app: FastifyInstance) {
  // Adicionar favorito
  app.post(
    "/favorites",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const parsed = favoriteBodySchema.safeParse(req.body);

      if (!parsed.success) {
        return reply.status(400).send({
          error: "Dados inválidos.",
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { mediaId, mediaType } = parsed.data;

      const userId = req.user.sub;

      try {
        const favorite = await favoriteService.addFavorite(
          userId,
          mediaId,
          mediaType,
        );

        return reply.status(201).send(favorite);
      } catch (err) {
        req.log.error(err, "Erro ao adicionar favorito");
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
      const parsed = mediaIdParamSchema.safeParse(req.params);

      if (!parsed.success) {
        return reply.status(400).send({
          error: "mediaId inválido.",
        });
      }

      const { mediaId } = parsed.data;
      const userId = req.user.sub;

      try {
        await favoriteService.removeFavorite(userId, mediaId);

        return reply.status(204).send();
      } catch (err) {
        req.log.error(err, "Erro ao remover favorito");
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
        return reply.send(favorites);
      } catch (err) {
        req.log.error(err, "Erro ao buscar favoritos");
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
      const parsed = mediaIdParamSchema.safeParse(req.params);

      if (!parsed.success) {
        return reply.status(400).send({
          error: "mediaId inválido.",
        });
      }

      const { mediaId } = parsed.data;
      const userId = req.user.sub;

      try {
        const favorite = await favoriteService.isFavorite(userId, mediaId);

        return reply.send({
          isFavorite: Boolean(favorite),
        });
      } catch (err) {
        req.log.error(err, "Erro ao verificar favorito");
        return reply.status(500).send({
          error: "Erro ao verificar favorito.",
        });
      }
    },
  );
}
