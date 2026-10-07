import express from "express";
import { PostService } from "./application/services/PostService";
import { PostController } from "./api/controllers/PostController";
import { buildPostRoutes } from "./api/routes/postRoutes";

export const createApp = (postService: PostService) => {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK" });
  });

  app.use("/api/posts", buildPostRoutes(new PostController(postService)));
  return app;
};
