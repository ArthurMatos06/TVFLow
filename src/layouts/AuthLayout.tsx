import { NavLink, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10 text-text">
      <NavLink to="/" className="mb-8 text-2xl font-bold tracking-tight text-primary">
        TvFlow
      </NavLink>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-xl">
        <Outlet />
      </div>
    </div>
  )
}
