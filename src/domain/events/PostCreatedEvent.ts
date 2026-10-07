import { Post } from "../entities/Post";

export const POST_CREATED_TOPIC = "post.created";

export interface PostCreatedEvent {
  type: "POST_CREATED";
  occurredAt: string;
  data: {
    postId: string;
    title: string;
    author: string;
  };
}

export const buildPostCreatedEvent = (post: Post): PostCreatedEvent => ({
  type: "POST_CREATED",
  occurredAt: new Date().toISOString(),
  data: { postId: post.id, title: post.title, author: post.author },
});
