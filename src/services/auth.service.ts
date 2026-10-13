import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

// ── Types ─────────────────────────────────────────────────────

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// ── Helpers ───────────────────────────────────────────────────

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
} as const;

// ── Service ───────────────────────────────────────────────────

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: { email },
    });

    if (existing) {
      if (existing.email === email) throw new Error("E-mail já cadastrado.");
      throw new Error("E-mail já está em uso.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: name.toLowerCase().replace(/\s+/g, ""),
      },
      select: safeUserSelect,
    });

    return user;
  },

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("Credenciais inválidas.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Credenciais inválidas.");

    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      // select: safeUserSelect,
    });
  },
};
