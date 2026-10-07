import { NewPost, Post } from "../../domain/entities/Post";

export interface IPostRepository {
  create(data: NewPost): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
}
