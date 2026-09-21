export abstract class EventBusPort {
  abstract publish(eventName: string, payload: unknown): void;
}
