import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/ui/PageLoader";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const Home = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.Home })),
);
const Movies = lazy(() =>
  import("@/pages/Movies").then((m) => ({ default: m.Movies })),
);
const TvShows = lazy(() =>
  import("@/pages/TvShows").then((m) => ({ default: m.TvShows })),
);
const Search = lazy(() =>
  import("@/pages/Search").then((m) => ({ default: m.Search })),
);
const MovieDetails = lazy(() =>
  import("@/pages/MovieDetails").then((m) => ({ default: m.MovieDetails })),
);
const TvDetails = lazy(() =>
  import("@/pages/TvDetails").then((m) => ({ default: m.TvDetails })),
);
const Favorites = lazy(() =>
  import("@/pages/Favorites").then((m) => ({ default: m.Favorites })),
);
const Ratings = lazy(() =>
  import("@/pages/Ratings").then((m) => ({ default: m.Ratings })),
);
const Profile = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.Profile })),
);
const EditProfile = lazy(() =>
  import("@/pages/EditProfile").then((m) => ({ default: m.EditProfile })),
);
const Login = lazy(() =>
  import("@/pages/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("@/pages/Register").then((m) => ({ default: m.Register })),
);

function withPageLoader(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={withPageLoader(<Home />)} />
        <Route path="/movies" element={withPageLoader(<Movies />)} />
        <Route path="/tv" element={withPageLoader(<TvShows />)} />
        <Route path="/search" element={withPageLoader(<Search />)} />
        <Route path="/movie/:id" element={withPageLoader(<MovieDetails />)} />
        <Route path="/tv/:id" element={withPageLoader(<TvDetails />)} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={withPageLoader(<Favorites />)} />
          <Route path="/Ratings" element={withPageLoader(<Ratings />)} />
          <Route path="/profile" element={withPageLoader(<Profile />)} />
          <Route
            path="/profile/edit"
            element={withPageLoader(<EditProfile />)}
          />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={withPageLoader(<Login />)} />
        <Route path="/register" element={withPageLoader(<Register />)} />
      </Route>
    </Routes>
  );
}
