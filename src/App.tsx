import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AppRoutes } from '@/routes'
import {useFavoriteStore} from "@/store/favoriteStore.ts";
import {useAuthStore} from "@/store/authStore.ts";



function App() {
  const { hydrate } = useAuth()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const hydrateFavorites = useFavoriteStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      void hydrateFavorites()
    }
  }, [isHydrated, isAuthenticated, hydrateFavorites])

  return <AppRoutes />
}

export default App
