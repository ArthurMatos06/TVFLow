import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-text">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-border px-4 py-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} TvFlow. Dados fornecidos pelo TMDB.
      </footer>
    </div>
  )
}
