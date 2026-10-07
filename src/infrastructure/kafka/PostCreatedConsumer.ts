import { Consumer } from "kafkajs";
import {
  POST_CREATED_TOPIC,
  PostCreatedEvent,
} from "../../domain/events/PostCreatedEvent";
import { createKafka } from "./kafkaClient";

export class PostCreatedConsumer {
  private readonly consumer: Consumer = createKafka("posts-consumer").consumer({
    groupId: "post-created-handlers",
  });

  async start(): Promise<void> {
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
    console.log("Kafka consumer running");
  }

  async stop(): Promise<void> {
    await this.consumer.disconnect();
  }
}
