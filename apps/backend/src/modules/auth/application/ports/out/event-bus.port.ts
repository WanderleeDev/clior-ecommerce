/**
 * Fire-and-forget event dispatch.
 *
 * `publish` deliberately returns `void`: application use cases dispatch auth
 * events without awaiting them, and NestEventBusAdapter contains and logs every
 * dispatch/listener failure internally, so no rejected promise can ever escape
 * to the process (H4). Failures surface in the adapter logs instead of at the
 * call site.
 */
export abstract class EventBusPort {
  abstract publish(eventName: string, payload: unknown): void;
}
