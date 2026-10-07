import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app";
import { PostService } from "./application/services/PostService";
import { connectDB } from "./infrastructure/database/db";
import { PostRepository } from "./infrastructure/database/repositories/PostRepository";
import { KafkaEventPublisher } from "./infrastructure/kafka/KafkaEventPublisher";

const PORT = Number(process.env.PORT) || 3000;

const main = async () => {
  await connectDB();

  const publisher = new KafkaEventPublisher();
  await publisher.connect();

  const service = new PostService(new PostRepository(), publisher);
  const server = createApp(service).listen(PORT, () =>
    console.log(`API listening on port ${PORT}`),
  );

  const shutdown = async () => {
    server.close();
    await publisher.disconnect();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
