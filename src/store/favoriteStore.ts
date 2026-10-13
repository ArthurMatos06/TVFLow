import { create } from "zustand";
import type { Favorite, MediaType } from "@/types";
import { tmdbClient } from "@/services/tmdb";

interface FavoriteState {
  favorites: Favorite[];
  addFavorite: (mediaId: number, mediaType: MediaType) => Promise<void>;
  removeFavorite: (mediaId: number, mediaType: MediaType) => Promise<void>;
  isFavorite: (mediaId: number) => boolean;
  getFavorites: () => Favorite[];
  hydrate: () => Promise<void>;
  clear: () => void;
}
const normalizeFavorite = (favorite: Favorite): Favorite => ({
  ...favorite,
  mediaType: favorite.mediaType.toLowerCase() as MediaType,
});
export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  addFavorite: async (mediaId, mediaType) => {
    const { favorites } = get();

    if (
      favorites.some(
        (favorite) =>
          favorite.mediaId === mediaId && favorite.mediaType === mediaType,
      )
    ) {
      return;
    }

    const optimisticFavorite = {
      mediaId,
      mediaType,
    } as Favorite;

    set((state) => ({
      favorites: [...state.favorites, optimisticFavorite],
    }));

    try {
      const { data } = await tmdbClient.post<Favorite>("/favorites", {
        mediaId,
        mediaType: mediaType.toUpperCase(),
      });
      // Substitui o objeto temporário pela resposta da API
      set((state) => ({
        favorites: state.favorites.map((favorite) =>
          favorite.mediaId === mediaId && favorite.mediaType === mediaType
            ? normalizeFavorite(data)
            : favorite,
        ),
      }));
    } catch (error) {
      set((state) => ({
        favorites: state.favorites.filter(
          (favorite) =>
            !(favorite.mediaId === mediaId && favorite.mediaType === mediaType),
        ),
      }));
    }
  },

  removeFavorite: async (mediaId, mediaType) => {
    const previousFavorites = get().favorites;

    // Atualiza a interface imediatamente
    set((state) => ({
      favorites: state.favorites.filter(
        (favorite) =>
          !(favorite.mediaId === mediaId && favorite.mediaType === mediaType),
      ),
    }));

    try {
      await tmdbClient.delete(`/favorites/${mediaId}`, {
        params: {
          mediaType: mediaType.toUpperCase(),
        },
      });
    } catch (error) {
      // Restaura o estado anterior se a API falhar
      set({ favorites: previousFavorites });
      throw error;
    }
  },

  isFavorite: (mediaId) =>
    get().favorites.some((favorite) => favorite.mediaId === mediaId),

  getFavorites: () => get().favorites,
  //refatorar porque tem uma funcao que já chama o lowerCase
  hydrate: async () => {
    const { data } = await tmdbClient.get<Favorite[]>("/favorites");

    set({
      favorites: data.map((favorite) => ({
        ...favorite,
        mediaType: favorite.mediaType.toLowerCase() as MediaType,
      })),
    });
  },

  clear: () => {
    set({
      favorites: [],
    });
  },
}));
