import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppRoutes } from "@/routes";
import { useFavoriteStore } from "@/store/favoriteStore.ts";
import { useAuthStore } from "@/store/authStore.ts";
import { useRatingStore } from "@/store/ratingStore.ts";

function App() {
  const { hydrate } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrateFavorites = useFavoriteStore((state) => state.hydrate);
  const hydrateRatings = useRatingStore((state) => state.hydrate);
  const clearFavorites = useFavoriteStore((state) => state.clear);
  const clearRatings = useRatingStore((state) => state.clear);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      void hydrateFavorites();
      void hydrateRatings();
    } else {
      clearFavorites();
      clearRatings();
    }
  }, [
    isHydrated,
    isAuthenticated,
    hydrateFavorites,
    hydrateRatings,
    clearFavorites,
    clearRatings,
  ]);

  return <AppRoutes />;
}

export default App;
