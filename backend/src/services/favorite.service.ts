import { prisma } from '../lib/prisma.js'

export const favoriteService = {
  async addFavorite(
    userId: string,
    mediaId: number,
    mediaType: 'MOVIE' | 'TV',
  ) {
    return prisma.favorite.create({
      data: {
        userId,
        mediaId,
        mediaType,
      },
    })
  },

  async removeFavorite(
    userId: string,
    mediaId: number,
  ) {
    return prisma.favorite.deleteMany({
      where: {
        userId,
        mediaId,
      },
    })
  },

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async isFavorite(userId: string, mediaId: number) {
    return prisma.favorite.findFirst({
      where: {
        userId,
        mediaId,
      },
    })
  },
}