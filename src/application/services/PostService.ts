import { NewPost, Post } from "../../domain/entities/Post";
import { buildPostCreatedEvent } from "../../domain/events/PostCreatedEvent";
import { IEventPublisher } from "../interfaces/IEventPublisher";
import { IPostRepository } from "../interfaces/IPostRepository";

export class PostService {
  constructor(
    private readonly repository: IPostRepository,
    private readonly events: IEventPublisher,
  ) {}

  async createPost(data: NewPost): Promise<Post> {
    const post = await this.repository.create(data);

    try {
      await this.events.publishPostCreated(buildPostCreatedEvent(post));
    } catch (err) {
      console.error(`Failed to publish POST_CREATED for ${post.id}:`, err);
    }

    return post;
  }

  getPost(id: string): Promise<Post | null> {
    return this.repository.findById(id);
  }

  listPosts(): Promise<Post[]> {
    return this.repository.findAll();
  }
}
