import "dotenv/config";

import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

import authPlugin from "./src/plugins/auth.js";
import { env } from "./src/env.js";
import { authRoutes } from "./src/routes/auth.js";
import { mediaRoutes } from "./src/routes/media.js";
import cors from "@fastify/cors";
import { favoriteRoutes } from './src/routes/favorite.routes.js'

const app = Fastify({ logger: true });
//cors
await app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

// Plugins
await app.register(cookie);

await app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "access_token",
    signed: false,
  },
});

await app.register(authPlugin);

// Routes
await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(mediaRoutes, { prefix: "/api" });

await app.register(favoriteRoutes, {
  prefix: '/api',
})

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
