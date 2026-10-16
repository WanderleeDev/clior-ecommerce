import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBusPort } from '../../../../application/ports/out/event-bus.port';

@Injectable()
export class NestEventBusAdapter extends EventBusPort {
  private readonly logger = new Logger(NestEventBusAdapter.name);

  constructor(private readonly emitter: EventEmitter2) {
    super();
  }

  /**
   * Fire-and-forget dispatch that never drops a rejection (H4).
   *
   * EventBusPort.publish intentionally stays `void` (call sites across the
   * application use cases are fire-and-forget), so the adapter owns containment:
   * `dispatch` is fully wrapped in try/catch, which makes the floating promise
   * it returns always resolve. `emitAsync` is used instead of `emit` because
   * `emit` discards the promises returned by async listeners — a rejection
   * there would otherwise reach the process as an unhandled rejection.
   * Every failure is logged here so it stays observable (M10).
   */
  publish(eventName: string, payload: unknown): void {
    void this.dispatch(eventName, payload);
  }

  private async dispatch(eventName: string, payload: unknown): Promise<void> {
    try {
      // Returns `false` (not a promise) when the event has no listeners;
      // `await` handles both cases.
      await this.emitter.emitAsync(eventName, payload);
    } catch (error) {
      this.logger.error(
        `Event "${eventName}" dispatch failed`,
        error instanceof Error ? error.stack ?? error.message : String(error),
      );
    }
  }
}
