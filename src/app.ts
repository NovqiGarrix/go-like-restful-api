import "@dotenv";
import { Application, oakCors, Router } from "@deps";

import V1 from "@routes/v1.ts";
import logAndErrorHandler from "@middlewares/logAndErrorHandler.ts";

export default function createServer() {
  const CORS_ORIGIN = Deno.env.get("CORS_ORIGIN")!;

  const app = new Application();
  const router = new Router();

  app.use(oakCors({
    credentials: true,
    methods: "*",
    origin: [CORS_ORIGIN],
    preflightContinue: true,
  }));

  // Logger
  app.use(logAndErrorHandler);

  router.get("/", ({ response }) => {
    response.status = 200;
    response.body = {
      data: "Main Endpoint",
      error: null,
    };
  }).use("/api", V1);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
