import { create } from "zustand";
import type { MediaType, Rating } from "@/types";
import { tmdbClient } from "@/services/tmdb";

interface RatingState {
  ratings: Rating[];
  setRating: (
    mediaId: number,
    mediaType: MediaType,
    score: number,
  ) => Promise<void>;
  getRating: (mediaId: number, mediaType?: MediaType) => number | null;
  getAllRatings: () => Rating[];
  hydrate: () => Promise<void>;
  clear: () => void;
}

const normalizeRating = (rating: Rating): Rating => ({
  ...rating,
  mediaType: rating.mediaType.toLowerCase() as MediaType,
});

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: [],

  setRating: async (mediaId, mediaType, score) => {
    const { data } = await tmdbClient.post<Rating>("/ratings", {
      mediaId,
      mediaType: mediaType.toUpperCase(),
      score,
    });

    const normalizedRating = normalizeRating(data);

    set((state) => {
      const exists = state.ratings.some(
        (rating) =>
          rating.mediaId === mediaId && rating.mediaType === mediaType,
      );

      return {
        ratings: exists
          ? state.ratings.map((rating) =>
              rating.mediaId === mediaId && rating.mediaType === mediaType
                ? normalizedRating
                : rating,
            )
          : [...state.ratings, normalizedRating],
      };
    });
  },

  getRating: (mediaId, mediaType) => {
    const rating = get().ratings.find(
      (item) =>
        item.mediaId === mediaId &&
        (mediaType === undefined || item.mediaType === mediaType),
    );

    return rating ? rating.score : null;
  },

  getAllRatings: () => get().ratings,

  hydrate: async () => {
    const { data } = await tmdbClient.get<Rating[]>("/ratings");

    set({
      ratings: data.map(normalizeRating),
    });
  },

  clear: () => set({ ratings: [] }),
}));
