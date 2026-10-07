import { PostCreatedEvent } from "../../domain/events/PostCreatedEvent";

export interface IEventPublisher {
  publishPostCreated(event: PostCreatedEvent): Promise<void>;
}
