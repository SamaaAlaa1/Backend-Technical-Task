import { Kafka, logLevel } from "kafkajs";

export const createKafka = (clientId: string): Kafka =>
  new Kafka({
    clientId,
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    logLevel: logLevel.WARN,
    retry: { retries: 10, initialRetryTime: 500 },
  });
