import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const PostModel = mongoose.model("Post", postSchema);
