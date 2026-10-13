import { create } from "zustand";
import { authService } from "@/services/api/authService";
import type { User } from "@/types";
import type { LoginCredentials, RegisterData } from "@/types/auth";
import { clearAuthStorage } from "@/utils/auth";
import { tmdbClient } from "@/services/tmdb";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: {
    name: string;
    username: string;
    bio: string | null;
  }) => void;
  hydrate: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const { user } = await authService.login(credentials);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Erro ao fazer login. Tente novamente.",
      });
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Erro ao criar conta. Tente novamente.",
      });
    }
  },

  logout: () => {
    clearAuthStorage();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  updateUser: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const { data: updatedUser } = await tmdbClient.put<User>(
        "/profile",
        data,
      );

      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Erro ao atualizar dados. Tente novamente.",
      });

      throw err;
    }
  },

  hydrate: async () => {
    try {
      const user = await authService.me();

      set({
        user,
        isAuthenticated: true,
        isHydrated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },
  clearError: () => set({ error: null }),
}));
