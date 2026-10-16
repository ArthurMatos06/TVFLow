import type { FastifyInstance } from "fastify";
import { profileService } from "../services/profile.service.js";
import { avatarService } from "../services/avatar.service.js";

export async function ProfileRoute(app: FastifyInstance) {
  app.put(
    "/profile",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const { name, username, avatarUrl, bio } = req.body as {
        name?: string;
        username?: string;
        avatarUrl?: string | null;
        bio?: string | null;
      };

      try {
        const updatedUser = await profileService.editProfile({
          userId: req.user.sub,
          name,
          username,
          avatarUrl,
          bio,
        });

        return reply.status(200).send(updatedUser);
      } catch (error) {
        req.log.error(error);

        return reply.status(500).send({
          error: "Não foi possível atualizar o perfil.",
        });
      }
    },
  );
  app.post(
    "/profile/avatar",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      try {
        const file = await req.file();

        if (!file) {
          return reply.status(400).send({
            error: "Envie uma imagem.",
          });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
          return reply.status(400).send({
            error: "Formato inválido. Use JPEG, PNG ou WebP.",
          });
        }

        const buffer = await file.toBuffer();

        const avatarUrl = await avatarService.upload(buffer, req.user.sub);

        const updatedUser = await profileService.updateAvatar(
          req.user.sub,
          avatarUrl,
        );

        return reply.status(200).send(updatedUser);
      } catch (error) {
        req.log.error(error);

        return reply.status(500).send({
          error: "Não foi possível atualizar o avatar.",
        });
      }
    },
  );
}
