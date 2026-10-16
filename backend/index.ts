import "dotenv/config";

import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

import authPlugin from "./src/plugins/auth.js";
import { env } from "./src/env.js";
import { authRoutes } from "./src/routes/auth.js";
import { mediaRoutes } from "./src/routes/media.js";
import cors from "@fastify/cors";
import { favoriteRoutes } from "./src/routes/favorite.routes.js";
import { RatingRoute } from "./src/routes/ratings.routes.js";
import { ProfileRoute } from "./src/routes/profile.routes.js";
import multipart from "@fastify/multipart";
import { registerCors } from './src/config/cors.js'

const app = Fastify({ logger: true });

//cors
await registerCors(app)
// Plugins
await app.register(cookie);

await app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "access_token",
    signed: false,
  },
});
await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
});

await app.register(authPlugin);

// Routes
await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(mediaRoutes, { prefix: "/api" });
await app.register(favoriteRoutes, { prefix: "/api" });
await app.register(RatingRoute, { prefix: "/api" });
await app.register(ProfileRoute, { prefix: "/api" });


app.get("/health", async () => ({ status: "ok" }));

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
