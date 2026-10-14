import { prisma } from "../lib/prisma.js";
import type { MediaType } from "../../generated/prisma/client.js";

export const ratingsService = {
  listByUser(userId: string, mediaType?: MediaType) {
    return prisma.rating.findMany({
      where: { userId, mediaType },
      orderBy: { createdAt: "desc" },
      select: { mediaId: true, mediaType: true, score: true, createdAt: true },
    });
  },

  upsert(userId: string, mediaId: number, mediaType: MediaType, score: number) {
    return prisma.rating.upsert({
      where: { userId_mediaId_mediaType: { userId, mediaId, mediaType } },
      update: { score },
      create: { userId, mediaId, mediaType, score },
      select: { mediaId: true, mediaType: true, score: true, createdAt: true },
    });
  },
};
