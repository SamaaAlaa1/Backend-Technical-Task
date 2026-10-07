import { IEventPublisher } from "../../application/interfaces/IEventPublisher";
import { PostCreatedEvent } from "../../domain/events/PostCreatedEvent";

// Used when KAFKA_ENABLED=false: the API works without any broker
export class NoopEventPublisher implements IEventPublisher {
  async publishPostCreated(event: PostCreatedEvent): Promise<void> {
    console.log(`[noop] Kafka disabled, skipped ${event.type} for ${event.data.postId}`);
  }
}