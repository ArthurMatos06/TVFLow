import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { EditProfile } from '@/pages/EditProfile'
import { Favorites } from '@/pages/Favorites'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { MovieDetails } from '@/pages/MovieDetails'
import { Movies } from '@/pages/Movies'
import { Profile } from '@/pages/Profile'
import { Register } from '@/pages/Register'
import { Search } from '@/pages/Search'
import { TvDetails } from '@/pages/TvDetails'
import { TvShows } from '@/pages/TvShows'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TvShows />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TvDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  )
}
