export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export type NewPost = Pick<Post, "title" | "content" | "author">;
