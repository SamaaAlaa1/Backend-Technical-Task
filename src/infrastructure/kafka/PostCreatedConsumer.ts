import { Consumer } from "kafkajs";
import {
  POST_CREATED_TOPIC,
  PostCreatedEvent,
} from "../../domain/events/PostCreatedEvent";
import { createKafka } from "./kafkaClient";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class PostCreatedConsumer {
  private readonly consumer: Consumer = createKafka("posts-consumer").consumer({
    groupId: "post-created-handlers",
  });
  private running = false;
  private stopped = false;

  start(): void {
    void (async () => {
      while (!this.running && !this.stopped) {
        try {
          await this.consumer.connect();
          await this.consumer.subscribe({ topic: POST_CREATED_TOPIC, fromBeginning: true });
          await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              if (!message.value) return;
              const event: PostCreatedEvent = JSON.parse(message.value.toString());
              console.log(
                `[consumer] ${topic}[${partition}]@${message.offset} -> ` +
                  `New post "${event.data.title}" by ${event.data.author} (id=${event.data.postId})`,
              );
            },
          });
          this.running = true;
          console.log("Kafka consumer running");
        } catch (err) {
          console.error("Kafka consumer not started, retrying in 5s:", (err as Error).message);
          try { await this.consumer.disconnect(); } catch { /* ignore */ }
          await sleep(5000);
        }
      }
    })();
  }

  async stop(): Promise<void> {
    this.stopped = true;
    if (this.running) await this.consumer.disconnect();
  }
}