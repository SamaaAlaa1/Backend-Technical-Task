import { Producer } from "kafkajs";
import { IEventPublisher } from "../../application/interfaces/IEventPublisher";
import {
  POST_CREATED_TOPIC,
  PostCreatedEvent,
} from "../../domain/events/PostCreatedEvent";
import { createKafka } from "./kafkaClient";

export class KafkaEventPublisher implements IEventPublisher {
  private readonly producer: Producer = createKafka("posts-api").producer();

  async connect(): Promise<void> {
    await this.producer.connect();
    console.log("Kafka producer connected");
  }

  async publishPostCreated(event: PostCreatedEvent): Promise<void> {
    await this.producer.send({
      topic: POST_CREATED_TOPIC,
      messages: [{ key: event.data.postId, value: JSON.stringify(event) }],
    });
    console.log(`[producer] published ${event.type} for post ${event.data.postId}`);
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
