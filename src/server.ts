import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app";
import { PostService } from "./application/services/PostService";
import { IEventPublisher } from "./application/interfaces/IEventPublisher";
import { connectDB } from "./infrastructure/database/db";
import { PostRepository } from "./infrastructure/database/repositories/PostRepository";
import { KafkaEventPublisher } from "./infrastructure/kafka/KafkaEventPublisher";
import { NoopEventPublisher } from "./infrastructure/kafka/NoopEventPublisher";
import { PostCreatedConsumer } from "./infrastructure/kafka/PostCreatedConsumer";

const PORT = Number(process.env.PORT) || 3000;
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== "false";

const main = async () => {
  await connectDB();

  let publisher: IEventPublisher = new NoopEventPublisher();
  let kafkaPublisher: KafkaEventPublisher | undefined;
  let consumer: PostCreatedConsumer | undefined;

  if (KAFKA_ENABLED) {
    kafkaPublisher = new KafkaEventPublisher();
    publisher = kafkaPublisher;
    kafkaPublisher.connectInBackground();

    if (process.env.RUN_CONSUMER === "true") {
      consumer = new PostCreatedConsumer();
      consumer.start();
    }
  } else {
    console.log("Kafka disabled (KAFKA_ENABLED=false)");
  }

  const service = new PostService(new PostRepository(), publisher);
  const server = createApp(service).listen(PORT, () =>
    console.log(`API listening on port ${PORT}`),
  );

  const shutdown = async () => {
    server.close();
    await consumer?.stop();
    await kafkaPublisher?.disconnect();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
