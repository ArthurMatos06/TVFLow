import { prisma } from "../lib/prisma.js";

interface EditProfileInput {
  userId: string;
  name?: string;
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export const profileService = {
  async editProfile(input: EditProfileInput) {
    const { userId, name, username, avatarUrl, bio } = input;

    return prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        avatarUrl,
        bio,
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });
  },

  async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });
  },
};