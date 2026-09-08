import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

// Express app definition only — no DB connection, no app.listen. Split
// out from index.ts so tests can import this directly with supertest
// and hit real routes without a real port or a real MongoDB connection
// (tests provide their own in-memory one).
export function createApp() {
  const app = express();

  app.use(helmet());

  // Two separate frontends (the main app and the admin app) each need to
  // be allowed — a single-origin CORS config blocks whichever one isn't
  // listed. Falls back to allowing no-origin requests (curl, Postman,
  // server-to-server) since `origin` is undefined for those, not "".
  const allowedOrigins = [...env.clientUrls, ...env.adminClientUrls].filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    })
  );

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
