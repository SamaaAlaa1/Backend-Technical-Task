import dotenv from "dotenv";
dotenv.config();
import { PostCreatedConsumer } from "./infrastructure/kafka/PostCreatedConsumer";

const consumer = new PostCreatedConsumer();

consumer.start();

const shutdown = async () => {
  await consumer.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);