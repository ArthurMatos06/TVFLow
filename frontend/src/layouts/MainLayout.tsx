import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col bg-background text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo principal
      </a>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} TvFlow. Dados fornecidos pelo TMDB.
      </footer>
    </div>
  )
}
