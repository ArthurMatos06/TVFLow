import { create } from "zustand";
import type { Favorite, MediaType } from "@/types";
import { favoriteService } from "@/services/api/favoriteService";

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
      const favorite = await favoriteService.addFavorite({
        mediaId,
        mediaType,
      });
      set((state) => ({
        favorites: state.favorites.map((item) =>
          item.mediaId === mediaId && item.mediaType === mediaType
            ? normalizeFavorite(favorite)
            : item,
        ),
      }));
    } catch {
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

    set((state) => ({
      favorites: state.favorites.filter(
        (favorite) =>
          !(favorite.mediaId === mediaId && favorite.mediaType === mediaType),
      ),
    }));

    try {
      await favoriteService.removeFavorite(mediaId);
    } catch (error) {
      set({ favorites: previousFavorites });
      throw error;
    }
  },

  isFavorite: (mediaId) =>
    get().favorites.some((favorite) => favorite.mediaId === mediaId),

  getFavorites: () => get().favorites,

  hydrate: async () => {
    const data = await favoriteService.getFavorites();
    set({
      favorites: data.map(normalizeFavorite),
    });
  },

  clear: () => {
    set({
      favorites: [],
    });
  },
}));
