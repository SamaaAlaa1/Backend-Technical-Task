import { Router } from "express";
import { PostController } from "../controllers/PostController";

export const buildPostRoutes = (controller: PostController): Router => {
  const router = Router();
  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  return router;
};
