import { Router } from "@deps";
import todoRoutes from "../todo/todo.routes.ts";

const router = new Router();

router.use("/v1/todos", todoRoutes);

export default router.routes();
