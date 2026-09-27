import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AppRoutes } from '@/routes'

function App() {
  const { hydrate } = useAuth()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return <AppRoutes />
}

export default App
