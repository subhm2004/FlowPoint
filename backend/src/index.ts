import "dotenv/config";
import express from "express";
import cors, { type CorsOptions } from "cors";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/** Allow configured origins plus any *.vercel.app (preview deploys) and localhost (any port). */
const VERCEL_PREVIEW = /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.vercel\.app$/i;
/** Vite often uses localhost; some browsers resolve to 127.0.0.1 or IPv6 [::1]. */
const LOCALHOST =
  /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (config.FRONTEND_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    if (VERCEL_PREVIEW.test(origin) || LOCALHOST.test(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  /** Bearer JWT only — no cookie session; false avoids strict credentialed-CORS issues in browsers. */
  credentials: false,
  /** Do not narrow allowedHeaders — Axios sends Accept, etc.; omitting this lets `cors` mirror the preflight request. */
};

app.use(cors(corsOptions));

app.get(`/`, (_req, res) => {
  res.status(200).json({
    ok: true,
    name: "FlowPilot API",
    docs: `${BASE_PATH}/auth`,
  });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
