import { create } from "zustand";
import type { MediaType, Rating } from "@/types";
import { ratingService } from "@/services/api/ratingService";

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
    const rating = await ratingService.setRating({ mediaId, mediaType, score });

    const normalizedRating = normalizeRating(rating);

    set((state) => {
      const exists = state.ratings.some(
        (rating) =>
          rating.mediaId === mediaId && rating.mediaType === mediaType,
      );

      return {
        ratings: exists
          ? state.ratings.map((item) =>
              item.mediaId === mediaId && item.mediaType === mediaType
                ? normalizedRating
                : item,
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
    const data = await ratingService.getRatings();

    set({
      ratings: data.map(normalizeRating),
    });
  },

  clear: () => set({ ratings: [] }),
}));
