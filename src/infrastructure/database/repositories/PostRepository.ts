import mongoose from "mongoose";
import { NewPost, Post } from "../../../domain/entities/Post";
import { IPostRepository } from "../../../application/interfaces/IPostRepository";
import { PostModel } from "../models/Post.model";

const toDomain = (doc: InstanceType<typeof PostModel>): Post => ({
  id: doc._id.toString(),
  title: doc.title,
  content: doc.content,
  author: doc.author,
  createdAt: doc.get("createdAt") as Date,
});

export class PostRepository implements IPostRepository {
  async create(data: NewPost): Promise<Post> {
    return toDomain(await PostModel.create(data));
  }

  async findById(id: string): Promise<Post | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await PostModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findAll(): Promise<Post[]> {
    const docs = await PostModel.find().sort({ createdAt: -1 });
    return docs.map(toDomain);
  }
}
