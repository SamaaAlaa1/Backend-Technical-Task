# Posts Service

A small backend for creating and reading posts. When a post is created, an event is sent to Kafka and a separate consumer processes it.

**Tech:** Node.js, Express, TypeScript, MongoDB, Apache Kafka, Docker, DDD

**Live API:** https://backend-technical-task-production.up.railway.app/

## Project structure

```
src/
├── domain/           Business types: Post, PostCreatedEvent
├── application/      Use cases (PostService) and interfaces
├── infrastructure/   MongoDB repository and Kafka producer/consumer
├── api/              Express controllers and routes
├── app.ts            Express app setup
├── server.ts         API entry point
└── consumer.ts       Kafka consumer entry point
```

Dependencies point inward: `api → application → domain`. The infrastructure layer implements the interfaces defined by the application layer, so the business logic does not know about MongoDB or Kafka.

## How it works

```
POST /api/posts → PostService → saves to MongoDB
                              → sends event to Kafka topic "post.created"
                                       ↓
                              Consumer receives it and logs it
```

## Run with Docker

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/SamaaAlaa1/Backend-Technical-Task
docker compose up --build -d
```

This starts four containers: MongoDB, Kafka, the API (port 3000) and the consumer.

Check it works:

```bash
curl http://localhost:3000/health
```

Watch the Kafka consumer:

```bash
docker compose logs -f consumer
```

Stop everything:

```bash
docker compose down
```

## API endpoints

| Method | Path             | Description     |
|--------|------------------|-----------------|
| GET    | `/health`        | Health check    |
| POST   | `/api/posts`     | Create a post   |
| GET    | `/api/posts/:id` | Get one post    |
| GET    | `/api/posts`     | List all posts  |

Create a post:

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"My first post","author":"Samaa"}'
```

Required fields: `title`, `content`, `author`. Missing fields return `400`, and an unknown id returns `404`.

A Postman collection is included: `postman_collection.json`. Set the `baseUrl` variable to `http://localhost:3000` or the live URL.

## Kafka flow

- **Topic:** `post.created`
- **Producer:** the API publishes a `POST_CREATED` event after saving a post. The post id is used as the message key.
- **Consumer:** runs in its own container in the group `post-created-handlers` and logs each event.
- If the consumer is stopped, Kafka keeps the events, and the consumer processes them when it starts again.
- If Kafka is down, the post is still saved and the error is logged.

## Environment variables

| Variable          | Description                                      |
|-------------------|--------------------------------------------------|
| `MONGO_URI`       | MongoDB connection string                        |
| `KAFKA_BROKERS`   | Kafka broker address                             |
| `PORT`            | API port (default 3000)                          |
| `KAFKA_ENABLED`   | Set to `false` to run without Kafka              |
| `RUN_CONSUMER`    | Set to `true` to run the consumer inside the API |

See `.env.example` for local values.

## Deployment

The API is deployed on **Railway**, with MongoDB on **MongoDB Atlas**.

- The public deployment runs with `KAFKA_ENABLED=false`, so posts are saved but events are skipped.
- AWS and GCP require a payment card, and the free hosting tier does not have enough memory for a Kafka broker.
- The full system with Kafka and the consumer runs with `docker compose up`. The same compose file can be deployed on any AWS EC2 or GCP VM with Docker installed.

More details are in `DEPLOYMENT.md`.