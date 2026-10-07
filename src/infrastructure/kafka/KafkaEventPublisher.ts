import { Partitioners, Producer } from "kafkajs";
import { IEventPublisher } from "../../application/interfaces/IEventPublisher";
import {
  POST_CREATED_TOPIC,
  PostCreatedEvent,
} from "../../domain/events/PostCreatedEvent";
import { createKafka } from "./kafkaClient";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class KafkaEventPublisher implements IEventPublisher {
  private readonly producer: Producer = createKafka("posts-api").producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  private connected = false;
  private stopped = false;

  connectInBackground(): void {
    void (async () => {
      while (!this.connected && !this.stopped) {
        try {
          await this.producer.connect();
          this.connected = true;
          console.log("Kafka producer connected");
        } catch (err) {
          console.error("Kafka producer not connected, retrying in 5s:", (err as Error).message);
          await sleep(5000);
        }
      }
    })();
  }

  async publishPostCreated(event: PostCreatedEvent): Promise<void> {
    if (!this.connected) throw new Error("Kafka producer is not connected yet");
    await this.producer.send({
      topic: POST_CREATED_TOPIC,
      messages: [{ key: event.data.postId, value: JSON.stringify(event) }],
    });
    console.log(`[producer] published ${event.type} for post ${event.data.postId}`);
  }

  async disconnect(): Promise<void> {
    this.stopped = true;
    if (this.connected) await this.producer.disconnect();
  }
}