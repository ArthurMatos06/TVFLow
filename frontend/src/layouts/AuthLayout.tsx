import { NavLink, Outlet, useLocation } from 'react-router-dom'

export function AuthLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10 text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo principal
      </a>
      <NavLink to="/" className="mb-8 text-2xl font-bold tracking-tight text-primary">
        TvFlow
      </NavLink>
      <main
        id="main-content"
        className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-xl"
      >
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
