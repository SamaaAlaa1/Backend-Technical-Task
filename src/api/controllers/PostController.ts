import { Request, Response } from "express";
import { PostService } from "../../application/services/PostService";

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export class PostController {
  constructor(private readonly service: PostService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { title, content, author } = req.body ?? {};
    if (![title, content, author].every(isNonEmptyString)) {
      res.status(400).json({ message: "title, content and author are required strings" });
      return;
    }
    try {
      res.status(201).json(await this.service.createPost({ title, content, author }));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const post = await this.service.getPost(req.params.id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get post" });
    }
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.json(await this.service.listPosts());
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to list posts" });
    }
  };
}
