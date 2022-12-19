import { Router } from "@deps";
import { getTodos } from "./todo.controller.ts";

const router = new Router();

router.get("/", getTodos);

export default router.routes();
